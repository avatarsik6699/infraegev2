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


Block = Annotated[
    TextBlock
    | ListBlock
    | CodeExampleBlock
    | TableBlock
    | WorkedExampleBlock
    | CalloutBlock
    | ImageBlock
    | DiagramBlock
    | AttachmentBlock,
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


class Membership(StrictModel):
    material_id: Identifier
    position: int = Field(ge=0)


class TheoryLink(StrictModel):
    material_id: Identifier
    section: Identifier
    label: Nonempty


class FileUsage(StrictModel):
    id: Identifier
    checksum: Checksum
    purpose: Literal["image", "attachment"]
    filename: Annotated[str, Field(min_length=1, max_length=180, pattern=r"^[^/\\\x00-\x1f\x7f]+$")]
    description: Nonempty
    attribution: Nonempty | None = None


class PublicTaskContent(StrictModel):
    id: Identifier
    title: Nonempty
    difficulty: Literal[1, 2, 3]
    estimated_minutes: int | None = Field(default=None, gt=0)
    answer_instruction: Nonempty
    interaction_type: Literal["production", "recognition"] = "production"
    content_schema_version: Literal[1] = 1
    statement: list[Block] = Field(min_length=1, max_length=1000)
    hint: list[Block] = Field(max_length=1000)
    explanation: list[Block] = Field(min_length=1, max_length=1000)
    skills: list[Identifier] = Field(default_factory=list, max_length=100)
    exam_numbers: list[Annotated[int, Field(ge=1, le=27)]] = Field(default_factory=list)
    sources: list[Source] = Field(min_length=1, max_length=100)
    files: list[FileUsage] = Field(default_factory=list, max_length=100)
    lessons: list[Membership] = Field(default_factory=list, max_length=100)
    theory_links: list[TheoryLink] = Field(default_factory=list, max_length=100)
    catalog_visible: bool = True
    archived: bool = False

    @model_validator(mode="after")
    def consistent(self) -> Self:
        for values in (
            self.skills,
            self.exam_numbers,
            [f.id for f in self.files],
            [link.material_id for link in self.lessons],
        ):
            if len(values) != len(set(values)):
                raise ValueError("duplicate classification, membership or file usage")
        if sum(source.primary for source in self.sources) != 1:
            raise ValueError("exactly one primary source required")
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


class TaskData(PublicTaskContent):
    checker: Checker


class TaskEdit(StrictModel):
    task: TaskData
    expected_revision: int = Field(ge=0)
    mode: Literal["normal", "editorial"] = "normal"
    reason: Nonempty


class PackageFile(StrictModel):
    path: str
    checksum: Checksum
    size_bytes: int = Field(gt=0, le=20 * 1024 * 1024)
    format: Literal[
        "png",
        "jpg",
        "jpeg",
        "webp",
        "avif",
        "txt",
        "csv",
        "json",
        "py",
        "zip",
        "xlsx",
        "ods",
        "pdf",
        "docx",
        "odt",
    ]


class TaskEntry(StrictModel):
    path: str
    checksum: Checksum


class Manifest(StrictModel):
    format: Literal[1]
    package_id: Identifier
    tasks: list[TaskEntry] = Field(min_length=1, max_length=1000)
    files: list[PackageFile] = Field(default_factory=list, max_length=10000)


class MaterialDefinition(StrictModel):
    id: Identifier
    sections: list[Identifier]


class Registry(StrictModel):
    format: Literal[1]
    materials: list[MaterialDefinition]

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
