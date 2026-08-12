"""Task content schema — mirrors docs/SPEC.md §3.

The backend only needs the subset of the content-as-code schema required to check an
answer (SPEC.md §4/§11.1). Everything else (Topic/Course/CourseLesson) is frontend-only.
"""

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

CheckerType = Literal["exact_match", "numeric_tolerance"]
InteractionType = Literal["production", "recognition"]


class StrictContentModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TextBlockData(StrictContentModel):
    markdown: str


class FigureBlockData(StrictContentModel):
    src: str
    alt: str
    width: int = Field(gt=0)
    height: int = Field(gt=0)
    caption: str | None = None


class DiagramElement(StrictContentModel):
    kind: Literal["node", "edge", "arrow", "label", "highlight"]
    id: str
    x: float | None = None
    y: float | None = None
    from_: str | None = Field(default=None, alias="from")
    to: str | None = None
    text: str | None = None
    highlighted: bool | None = None


class GraphDiagramData(StrictContentModel):
    kind: Literal["graph", "automaton"]
    ariaLabel: str
    elements: list[DiagramElement]


class TableDiagramData(StrictContentModel):
    kind: Literal["bit-grid"]
    ariaLabel: str
    headers: list[str]
    rows: list[list[str]]
    highlightedCells: list[str] | None = None


DiagramData = Annotated[GraphDiagramData | TableDiagramData, Field(discriminator="kind")]


class CodeExampleBlockData(StrictContentModel):
    language: str
    code: str
    caption: str | None = None


class WorkedExampleBlockData(StrictContentModel):
    prompt: str
    steps: list[str]


class CalloutBlockData(StrictContentModel):
    tone: Literal["info", "warning"]
    markdown: str


class VideoEmbedBlockData(StrictContentModel):
    url: str
    title: str


class TextBlock(StrictContentModel):
    type: Literal["text"]
    data: TextBlockData


class FigureBlock(StrictContentModel):
    type: Literal["figure"]
    data: FigureBlockData


class DiagramBlock(StrictContentModel):
    type: Literal["diagram"]
    data: DiagramData


class CodeExampleBlock(StrictContentModel):
    type: Literal["code_example"]
    data: CodeExampleBlockData


class WorkedExampleBlock(StrictContentModel):
    type: Literal["worked_example", "completion_exercise", "productive_failure_prompt"]
    data: WorkedExampleBlockData


class CalloutBlock(StrictContentModel):
    type: Literal["callout"]
    data: CalloutBlockData


class VideoEmbedBlock(StrictContentModel):
    type: Literal["video_embed"]
    data: VideoEmbedBlockData


ContentBlock = Annotated[
    TextBlock
    | FigureBlock
    | DiagramBlock
    | CodeExampleBlock
    | WorkedExampleBlock
    | CalloutBlock
    | VideoEmbedBlock,
    Field(discriminator="type"),
]


class Task(BaseModel):
    id: str
    topic_ids: list[str] = Field(default_factory=list)
    statement: str
    checker_type: CheckerType
    answer_variants: list[str]
    numeric_tolerance: float | None = None
    interaction_type: InteractionType
    explanation: list[ContentBlock] = Field(default_factory=list)
    difficulty: Literal[1, 2, 3]
    is_interleaving_eligible: bool = True
