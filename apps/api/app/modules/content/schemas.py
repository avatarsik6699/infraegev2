"""Task content schema — mirrors docs/SPEC.md §3.

The backend only needs the subset of the content-as-code schema required to check an
answer (SPEC.md §4/§11.1). Everything else (Topic/Course/CourseLesson) is frontend-only.
"""

from __future__ import annotations

from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, JsonValue, model_validator

CheckerType = Literal["exact_match", "numeric_tolerance"]
InteractionType = Literal["production", "recognition"]


class StrictContentModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TextBlockData(StrictContentModel):
    markdown: str


class LearningVisualAsset(StrictContentModel):
    src: str
    width: int = Field(gt=0)
    height: int = Field(gt=0)


class StructuredLearningVisual(StrictContentModel):
    kind: str = Field(min_length=1, max_length=64, pattern=r"^[a-z][a-z0-9_]*$")
    data: dict[str, JsonValue] = Field(min_length=1)


class RasterLearningVisualData(StrictContentModel):
    representation: Literal["raster"]
    purpose: str
    accessible_description: str
    caption: str
    asset: LearningVisualAsset


class StructuredLearningVisualData(StrictContentModel):
    representation: Literal["structured"]
    purpose: str
    accessible_description: str
    caption: str
    visual: StructuredLearningVisual


class HybridLearningVisualData(StrictContentModel):
    representation: Literal["hybrid"]
    purpose: str
    accessible_description: str
    caption: str
    asset: LearningVisualAsset
    visual: StructuredLearningVisual


LearningVisualData = Annotated[
    RasterLearningVisualData | StructuredLearningVisualData | HybridLearningVisualData,
    Field(discriminator="representation"),
]


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


class LearningVisualBlock(StrictContentModel):
    type: Literal["learning_visual"]
    data: LearningVisualData


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
    | LearningVisualBlock
    | CodeExampleBlock
    | WorkedExampleBlock
    | CalloutBlock
    | VideoEmbedBlock,
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
    statement: str
    hint: str
    theory_links: list[TheoryLink] = Field(default_factory=list)
    checker_type: CheckerType
    answer_variants: list[str]
    numeric_tolerance: float | None = None
    interaction_type: InteractionType
    explanation: list[ContentBlock] = Field(default_factory=list)
    difficulty: Literal[1, 2, 3]
    is_interleaving_eligible: bool = True

    @model_validator(mode="after")
    def validate_content_owner(self) -> Self:
        if not self.topic_ids and not self.course_lesson_ids:
            raise ValueError("task must belong to a topic or course lesson")
        if self.topic_ids and self.course_lesson_ids:
            raise ValueError("task cannot bridge topic and course lesson ownership")
        return self
