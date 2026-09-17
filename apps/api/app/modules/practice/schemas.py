"""Versioned operator contract. No raw HTML, paths or checker data in public DTOs."""

import math
from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.content.schemas import (
    CalloutBlock,
    CodeExampleBlock,
    DiagramPointer,
    ListBlock,
    TableBlock,
    TextBlock,
    WorkedExampleBlock,
)

Identifier = Annotated[str, Field(pattern=r"^[a-z0-9][a-z0-9_-]{0,119}$")]
Checksum = Annotated[str, Field(pattern=r"^[a-f0-9]{64}$")]
Nonempty = Annotated[str, Field(min_length=1, max_length=10000)]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)


class MediaData(StrictModel):
    usage_id: Identifier
    alt: Nonempty
    width: int = Field(gt=0, le=50000)
    height: int = Field(gt=0, le=50000)
    caption: str | None = None


class DiagramData(MediaData):
    purpose: Nonempty
    accessible_description: Nonempty
    pointers: list[DiagramPointer] = Field(min_length=1)


class ImageBlock(StrictModel):
    type: Literal["image"]
    data: MediaData


class DiagramBlock(StrictModel):
    type: Literal["diagram"]
    data: DiagramData


class AttachmentData(StrictModel):
    usage_id: Identifier


class AttachmentBlock(StrictModel):
    type: Literal["attachment"]
    data: AttachmentData


class InlineSpan(StrictModel):
    kind: Literal["text", "code", "formula"]
    text: Annotated[str, Field(min_length=1, max_length=10000)]


class RichTextData(StrictModel):
    spans: list[InlineSpan] = Field(min_length=1, max_length=200)


class RichTextBlock(StrictModel):
    type: Literal["rich_text"]
    data: RichTextData


class CodeVariant(StrictModel):
    label: Annotated[str, Field(min_length=1, max_length=40)]
    language: Literal["python", "text"]
    code: Nonempty


class CodeVariantsData(StrictModel):
    variants: list[CodeVariant] = Field(min_length=2, max_length=8)

    @model_validator(mode="after")
    def unique_labels(self) -> Self:
        if len({v.label.casefold() for v in self.variants}) != len(self.variants):
            raise ValueError("code variant labels must be distinct")
        return self


class CodeVariantsBlock(StrictModel):
    type: Literal["code_variants"]
    data: CodeVariantsData


Block = Annotated[
    TextBlock
    | ListBlock
    | CodeExampleBlock
    | TableBlock
    | WorkedExampleBlock
    | CalloutBlock
    | ImageBlock
    | DiagramBlock
    | AttachmentBlock
    | RichTextBlock
    | CodeVariantsBlock,
    Field(discriminator="type"),
]


class Checker(StrictModel):
    checker_type: Literal["exact_match", "numeric_tolerance"]
    answer_variants: list[Nonempty] = Field(min_length=1, max_length=100)
    numeric_tolerance: float | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def valid_numbers(self) -> Self:
        if self.checker_type == "numeric_tolerance":
            if self.numeric_tolerance is None:
                raise ValueError("numeric checker requires explicit tolerance")
            if any(not math.isfinite(float(v.replace(",", "."))) for v in self.answer_variants):
                raise ValueError("numeric answers must be finite")
        elif self.numeric_tolerance is not None:
            raise ValueError("exact checker has no tolerance")
        return self


class Source(StrictModel):
    kind: Literal["bank", "original", "adaptation", "unknown"]
    role: Literal["original", "copy"]
    primary: bool
    title: Nonempty | None
    author: Nonempty | None
    original_id: Nonempty | None
    url: Annotated[str, Field(pattern=r"^https?://[^\s]+$")] | None
    year: int | None = Field(ge=1, le=9999)
    adaptation: Nonempty | None


class OperatorSource(Source):
    is_public: bool = True


class Membership(StrictModel):
    material_id: Identifier
    position: int = Field(ge=0)


class TheoryLink(StrictModel):
    material_id: Identifier
    section: Identifier | None = None
    label: Nonempty


class FileUsage(StrictModel):
    id: Identifier
    checksum: Checksum
    purpose: Literal["image", "attachment"]
    filename: Annotated[str, Field(min_length=1, max_length=180, pattern=r"^[^/\\\x00-\x1f\x7f]+$")]
    description: Nonempty
    attribution: Nonempty | None = None


class TaskContent(StrictModel):
    id: Identifier
    title: Nonempty
    short_description: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    explanation_kind: Literal["unclassified", "method", "worked_solution"] = "unclassified"
    difficulty: Literal[1, 2, 3]
    estimated_minutes: int | None = Field(default=None, gt=0)
    answer_instruction: Nonempty
    interaction_type: Literal["production", "recognition"] = "production"
    content_schema_version: Literal[1, 2] = 1
    statement: list[Block] = Field(min_length=1, max_length=1000)
    hint: list[Block] = Field(max_length=1000)
    explanation: list[Block] = Field(min_length=1, max_length=1000)
    skills: list[Identifier] = Field(default_factory=list, max_length=100)
    exam_numbers: list[Annotated[int, Field(ge=1, le=27)]] = Field(default_factory=list)
    files: list[FileUsage] = Field(default_factory=list, max_length=100)
    lessons: list[Membership] = Field(default_factory=list, max_length=100)
    theory_links: list[TheoryLink] = Field(default_factory=list, max_length=100)
    catalog_visible: bool = True
    archived: bool = False

    @model_validator(mode="after")
    def consistent(self) -> Self:
        if self.content_schema_version == 1 and any(
            isinstance(block, RichTextBlock | CodeVariantsBlock)
            for block in self.statement + self.hint + self.explanation
        ):
            raise ValueError("presentation blocks require content schema version 2")
        for values in (
            self.skills,
            self.exam_numbers,
            [f.id for f in self.files],
            [link.material_id for link in self.lessons],
        ):
            if len(values) != len(set(values)):
                raise ValueError("duplicate classification, membership or file usage")
        if self.archived and (self.catalog_visible or self.lessons):
            raise ValueError("archived tasks must be hidden and unlinked")
        usages = {usage.id: usage for usage in self.files}
        referenced = set()
        for block in self.statement + self.hint + self.explanation:
            if isinstance(block, ImageBlock | DiagramBlock | AttachmentBlock):
                usage = usages.get(block.data.usage_id)
                purpose = "attachment" if isinstance(block, AttachmentBlock) else "image"
                if usage is None or usage.purpose != purpose:
                    raise ValueError("missing or incompatible file usage")
                referenced.add(usage.id)
        if referenced != set(usages):
            raise ValueError("file usages must be referenced by content")
        return self


class PublicTaskContent(TaskContent):
    sources: list[Source] = Field(max_length=100)


class TaskData(TaskContent):
    sources: list[OperatorSource] = Field(min_length=1, max_length=100)
    checker: Checker

    @model_validator(mode="after")
    def primary_source(self) -> Self:
        if sum(source.primary for source in self.sources) != 1:
            raise ValueError("exactly one primary source required")
        return self


class MaterialDefinition(StrictModel):
    id: Identifier
    sections: list[Identifier]
    kind: Literal["topic", "course"] = "topic"
    status: Literal["draft", "review", "published"] = "draft"
    course_id: Identifier | None = None


class CourseDefinition(StrictModel):
    id: Identifier
    status: Literal["draft", "review", "published"]
    lesson_ids: list[Identifier]


class Registry(StrictModel):
    format: Literal[1]
    materials: list[MaterialDefinition]
    courses: list[CourseDefinition] = Field(default_factory=list)

    @model_validator(mode="after")
    def unique(self) -> Self:
        if len({m.id for m in self.materials}) != len(self.materials):
            raise ValueError("duplicate material")
        if any(len(m.sections) != len(set(m.sections)) for m in self.materials):
            raise ValueError("duplicate section")
        return self


class PublicTask(StrictModel):
    id: str
    revision: int
    solution_revision: int
    content: PublicTaskContent
    deliveries: list["FileDelivery"] = Field(default_factory=list)


class FileDelivery(StrictModel):
    usage_id: str
    url: str
    mime_type: str
    size_bytes: int


class BankTask(StrictModel):
    task: TaskData
    solution_revision: int = Field(default=1, ge=1)


class BankFile(StrictModel):
    checksum: Checksum
    storage_key: Checksum
    format: str
    mime_type: str
    size_bytes: int = Field(gt=0)


class Bank(StrictModel):
    format: Literal[1] = 1
    tasks: list[BankTask]
    files: list[BankFile] = Field(default_factory=list)
    materials: list[MaterialDefinition] = Field(default_factory=list)
    courses: list[CourseDefinition] = Field(default_factory=list)

    def validate_references(self) -> None:
        """Check a complete import's references; exports attach registry metadata later."""
        materials = {item.id: item for item in self.materials}
        courses = {item.id: item for item in self.courses}
        if len(materials) != len(self.materials) or len(courses) != len(self.courses):
            raise ValueError("duplicate publication metadata")
        if len({entry.task.id for entry in self.tasks}) != len(self.tasks):
            raise ValueError("duplicate task ID")
        if len({item.checksum for item in self.files}) != len(self.files):
            raise ValueError("duplicate file checksum")
        for material in self.materials:
            if len(set(material.sections)) != len(material.sections):
                raise ValueError("duplicate section")
            if material.kind == "course":
                course = courses.get(material.course_id or "")
                if course is None or material.id not in course.lesson_ids:
                    raise ValueError("unknown course membership")
            elif material.course_id is not None:
                raise ValueError("topic cannot belong to a course")
        positions: set[tuple[str, int]] = set()
        for entry in self.tasks:
            for link in entry.task.lessons:
                if link.material_id not in materials:
                    raise ValueError("unknown lesson")
                position = (link.material_id, link.position)
                if position in positions:
                    raise ValueError("duplicate lesson position")
                positions.add(position)
            for link in entry.task.theory_links:
                material = materials.get(link.material_id)
                if material is None:
                    raise ValueError(f"{entry.task.id}: unknown theory material")
                if link.section is not None and link.section not in material.sections:
                    raise ValueError(f"{entry.task.id}: unknown theory section")
