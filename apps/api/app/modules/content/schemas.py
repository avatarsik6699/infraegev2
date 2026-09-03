"""Task content schema — mirrors docs/SPEC.md §3.

The backend only needs the subset of the content-as-code schema required to check an
answer (SPEC.md §4/§11.1). Everything else (Topic/Course/CourseLesson) is frontend-only.
"""

from __future__ import annotations

from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

CheckerType = Literal["exact_match", "numeric_tolerance"]
InteractionType = Literal["production", "recognition"]


class StrictContentModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TextBlockData(StrictContentModel):
    markdown: str = Field(min_length=1)


class ListBlockData(StrictContentModel):
    style: Literal["ordered", "unordered"]
    items: list[str] = Field(min_length=1)


class CodeExampleBlockData(StrictContentModel):
    language: Literal["python", "text"]
    code: str = Field(min_length=1)
    caption: str | None = None


class TableBlockData(StrictContentModel):
    headers: list[str] = Field(min_length=1)
    rows: list[list[str]] = Field(min_length=1)
    caption: str | None = None

    @model_validator(mode="after")
    def validate_row_width(self) -> Self:
        if any(len(row) != len(self.headers) for row in self.rows):
            raise ValueError("every table row must match the header width")
        return self


class ImageBlockData(StrictContentModel):
    src: str
    alt: str = Field(min_length=1)
    caption: str = Field(min_length=1)
    width: int = Field(gt=0)
    height: int = Field(gt=0)


class DiagramPointer(StrictContentModel):
    label: str = Field(min_length=1)
    description: str = Field(min_length=1)


class DiagramBlockData(ImageBlockData):
    purpose: str = Field(min_length=1)
    accessible_description: str = Field(min_length=1)
    pointers: list[DiagramPointer] = Field(min_length=1)


AttachmentMimeType = Literal[
    "text/plain",
    "text/csv",
    "application/json",
    "text/x-python",
    "application/zip",
]


class AttachmentBlockData(StrictContentModel):
    src: str
    label: str = Field(min_length=1)
    description: str = Field(min_length=1)
    mime_type: AttachmentMimeType
    size_bytes: int = Field(gt=0, le=5 * 1024 * 1024)


class WorkedExampleBlockData(StrictContentModel):
    prompt: str = Field(min_length=1)
    steps: list[str] = Field(min_length=1)


class CalloutBlockData(StrictContentModel):
    tone: Literal["info", "warning"]
    markdown: str = Field(min_length=1)


class TextBlock(StrictContentModel):
    type: Literal["text"]
    data: TextBlockData


class ListBlock(StrictContentModel):
    type: Literal["list"]
    data: ListBlockData


class CodeExampleBlock(StrictContentModel):
    type: Literal["code_example"]
    data: CodeExampleBlockData


class TableBlock(StrictContentModel):
    type: Literal["table"]
    data: TableBlockData


class ImageBlock(StrictContentModel):
    type: Literal["image"]
    data: ImageBlockData


class DiagramBlock(StrictContentModel):
    type: Literal["diagram"]
    data: DiagramBlockData


class AttachmentBlock(StrictContentModel):
    type: Literal["attachment"]
    data: AttachmentBlockData


class WorkedExampleBlock(StrictContentModel):
    type: Literal["worked_example", "completion_exercise", "productive_failure_prompt"]
    data: WorkedExampleBlockData


class CalloutBlock(StrictContentModel):
    type: Literal["callout"]
    data: CalloutBlockData


ContentBlock = Annotated[
    TextBlock
    | ListBlock
    | CodeExampleBlock
    | TableBlock
    | ImageBlock
    | DiagramBlock
    | AttachmentBlock
    | WorkedExampleBlock
    | CalloutBlock,
    Field(discriminator="type"),
]


class TheoryLink(StrictContentModel):
    hash: str = Field(min_length=1, pattern=r"^[a-z][a-z0-9-]*$")
    label: str = Field(min_length=1)


class Task(StrictContentModel):
    id: str
    topic_ids: list[str] = Field(default_factory=list)
    course_lesson_ids: list[str] = Field(default_factory=list)
    title: str
    statement: list[ContentBlock] = Field(min_length=1)
    hint: list[ContentBlock] = Field(min_length=1)
    theory_links: list[TheoryLink] = Field(default_factory=list)
    checker_type: CheckerType
    answer_variants: list[str]
    numeric_tolerance: float | None = None
    interaction_type: InteractionType
    explanation: list[ContentBlock] = Field(min_length=1)
    difficulty: Literal[1, 2, 3]
    is_interleaving_eligible: bool = True

    @model_validator(mode="after")
    def validate_content_owner(self) -> Self:
        if not self.topic_ids and not self.course_lesson_ids:
            raise ValueError("task must belong to a topic or course lesson")
        if self.topic_ids and self.course_lesson_ids:
            raise ValueError("task cannot bridge topic and course lesson ownership")
        return self
