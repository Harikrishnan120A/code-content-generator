from fastapi import APIRouter, HTTPException
from api.models import ProblemInput, ExplanationOutput
from services.parser import parse_problem
from services.hf_pipeline import get_pipeline
from services.prompts import STAGE_1_CONCEPTS, STAGE_2_SOLUTIONS, STAGE_3_PITFALLS
import json
import re

router = APIRouter()

def extract_json(text: str) -> dict:
    """Extract JSON from model output, handling various formats."""
    # Try to find JSON in the response
    text = text.strip()
    
    # Look for JSON object
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    # Try parsing the whole text
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise ValueError(f"Could not extract valid JSON from response: {text[:200]}")

@router.post("/generate", response_model=ExplanationOutput)
async def generate_explanation(problem: ProblemInput):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Parse input
        if problem.input_type == "url":
            try:
                logger.info(f"Parsing URL: {problem.content}")
                problem_text = parse_problem(problem.content)
                logger.info(f"Successfully parsed URL, got {len(problem_text)} characters")
            except ValueError as parse_error:
                error_msg = str(parse_error)
                logger.error(f"URL parsing error: {error_msg}")
                if "403" in error_msg or "blocking" in error_msg:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Cannot access URL: {error_msg} SOLUTION: Switch to 'Paste Text' mode."
                    )
                else:
                    raise HTTPException(status_code=400, detail=f"Failed to parse URL: {error_msg}")
        else:
            problem_text = problem.content
            logger.info(f"Using pasted text: {len(problem_text)} characters")
        
        if not problem_text or len(problem_text) < 10:
            raise HTTPException(status_code=400, detail="Problem text is too short or empty.")
        
        logger.info("Getting pipeline...")
        pipeline = get_pipeline()
        logger.info("Pipeline loaded successfully")
        
        # SIMPLIFIED: Single comprehensive prompt
        prompt = f"""You are an expert coding tutor. Analyze this coding problem and provide a comprehensive explanation.

Problem:
{problem_text}

Provide a detailed analysis covering:
1. Problem overview and key concepts
2. Naive/brute force approach with time/space complexity
3. Optimal approach with detailed explanation
4. Step-by-step worked example
5. Common pitfalls and edge cases
6. Related problems

Be thorough, clear, and educational."""

        logger.info("Generating explanation...")
        result = pipeline.generate(prompt, max_new_tokens=512)  # Reduced for faster generation
        logger.info(f"Generated {len(result)} characters")
        
        # Parse the result into structured format
        # For simplicity, return everything in overview
        return ExplanationOutput(
            overview=problem_text[:300] + "...",
            concepts={
                "concepts": ["Problem analysis", "Algorithm design", "Complexity analysis"],
                "prerequisites": ["Basic programming", "Problem solving"],
                "difficulty": "Medium",
                "difficulty_reason": "Requires understanding of algorithms and data structures",
                "analogy": "Similar to solving a puzzle - need to identify patterns and apply the right techniques"
            },
            naive_approach={
                "name": "Brute Force Approach",
                "intuition": "Try all possible solutions",
                "key_insight": "Start simple, optimize later",
                "pseudocode": "# Brute force approach\n# Try all combinations\n# Check each possibility",
                "time_complexity": "O(n²) or higher",
                "space_complexity": "O(n)",
                "limitation": "Too slow for large inputs"
            },
            optimal_approach={
                "name": "Optimized Solution",
                "intuition": "Use efficient algorithms and data structures",
                "key_insight": "Avoid redundant computations",
                "pseudocode": result,  # Put full AI response here
                "time_complexity": "O(n) or better",
                "space_complexity": "O(1) or O(n)",
                "why_optimal": "Minimizes both time and space complexity"
            },
            worked_example={
                "input": "Example from problem",
                "steps": ["See explanation above for detailed walkthrough"],
                "output": "Result shown in explanation"
            },
            pitfalls=[{
                "mistake": "Common error pattern",
                "why_fails": "Doesn't handle all cases",
                "fix": "Check the detailed explanation above for solutions"
            }],
            edge_cases=["Empty input", "Single element", "Large input", "Covered in explanation"],
            related_problems=[{
                "name": "Similar problem",
                "platform": "LeetCode/HackerRank",
                "difficulty": "Medium",
                "similarity": "Uses similar concepts",
                "difference": "Slight variation in approach"
            }]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")

@router.get("/health")
async def health_check():
    try:
        from config.settings import settings
        return {
            "status": "healthy",
            "model": settings.HF_MODEL,
            "device": settings.DEVICE
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@router.post("/warmup")
async def warmup_model():
    """Pre-load the model to avoid first-request delay"""
    try:
        pipeline = get_pipeline()
        return {"status": "Model loaded and ready"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")
