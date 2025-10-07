from pydantic import BaseModel, Field
from typing import List, Dict, Any, Literal

class ProblemInput(BaseModel):
    input_type: Literal["url", "text"] = Field(..., description="Type of input: 'url' or 'text'")
    content: str = Field(..., description="Problem URL or text content")

class ConceptsData(BaseModel):
    concepts: List[str]
    prerequisites: List[str]
    difficulty: str
    difficulty_reason: str
    analogy: str

class ApproachData(BaseModel):
    name: str
    intuition: str = ""
    key_insight: str = ""
    pseudocode: str
    time_complexity: str
    space_complexity: str
    limitation: str = ""
    why_optimal: str = ""

class WorkedExample(BaseModel):
    input: str
    steps: List[str]
    output: str

class Pitfall(BaseModel):
    mistake: str
    why_fails: str
    fix: str

class RelatedProblem(BaseModel):
    name: str
    platform: str
    difficulty: str
    similarity: str
    difference: str

class ExplanationOutput(BaseModel):
    overview: str
    concepts: ConceptsData
    naive_approach: ApproachData
    optimal_approach: ApproachData
    worked_example: WorkedExample
    pitfalls: List[Pitfall]
    edge_cases: List[str]
    related_problems: List[RelatedProblem]
