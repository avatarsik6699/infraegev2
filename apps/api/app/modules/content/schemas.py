"""Shared content-block DTOs consumed by canonical practice-bank schemas."""

from __future__ import annotations

from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


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
