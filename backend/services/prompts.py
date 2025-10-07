STAGE_1_CONCEPTS = """You are a CS educator. Analyze this coding problem and respond ONLY with valid JSON.

Problem:
{problem_text}

Respond with this exact JSON structure:
{{
  "concepts": ["concept1", "concept2", "concept3"],
  "prerequisites": ["prereq1", "prereq2"],
  "difficulty": "Medium",
  "difficulty_reason": "Requires understanding of hash tables and array traversal",
  "analogy": "Like finding matching puzzle pieces in a box"
}}

JSON response:"""

STAGE_2_SOLUTIONS = """You are a coding interview expert. Provide solution strategies for this problem as valid JSON.

Problem:
{problem_text}

Key Concepts:
{concepts}

Respond with this exact JSON structure:
{{
  "naive_approach": {{
    "name": "Brute Force",
    "intuition": "Check every pair of elements",
    "pseudocode": "for i in range(n):\\n  for j in range(i+1, n):\\n    if nums[i] + nums[j] == target:\\n      return [i, j]",
    "time_complexity": "O(n²)",
    "space_complexity": "O(1)",
    "limitation": "Too slow for large inputs"
  }},
  "optimal_approach": {{
    "name": "Hash Map",
    "key_insight": "Store complements in hash map for O(1) lookup",
    "pseudocode": "seen = {{}}\\nfor i, num in enumerate(nums):\\n  complement = target - num\\n  if complement in seen:\\n    return [seen[complement], i]\\n  seen[num] = i",
    "time_complexity": "O(n)",
    "space_complexity": "O(n)",
    "why_optimal": "Single pass with constant-time lookups"
  }},
  "worked_example": {{
    "input": "nums = [2, 7, 11, 15], target = 9",
    "steps": [
      "i=0, num=2: complement=7, seen={{}}, add 2->0",
      "i=1, num=7: complement=2, found in seen, return [0,1]"
    ],
    "output": "[0, 1]"
  }}
}}

JSON response:"""

STAGE_3_PITFALLS = """You are a TA analyzing student mistakes. Provide pitfalls and related problems as valid JSON.

Problem:
{problem_text}

Solution:
{solution}

Respond with this exact JSON structure:
{{
  "pitfalls": [
    {{"mistake": "Not checking if complement exists before accessing", "why_fails": "KeyError on first iteration", "fix": "Use 'if complement in seen' check"}},
    {{"mistake": "Returning same index twice", "why_fails": "Using nums[i] + nums[i]", "fix": "Ensure i != j in logic"}},
    {{"mistake": "Not handling duplicates", "why_fails": "Overwrites previous index", "fix": "Check seen before adding"}}
  ],
  "edge_cases": [
    "Empty array",
    "Array with one element",
    "No valid solution exists",
    "Multiple valid pairs",
    "Negative numbers",
    "Target is zero"
  ],
  "related_problems": [
    {{"name": "3Sum", "platform": "LeetCode", "difficulty": "Medium", "similarity": "Extension to three numbers", "difference": "Requires sorting and two pointers"}},
    {{"name": "Two Sum II - Sorted Array", "platform": "LeetCode", "difficulty": "Easy", "similarity": "Same goal", "difference": "Input is sorted, use two pointers instead"}},
    {{"name": "4Sum", "platform": "LeetCode", "difficulty": "Medium", "similarity": "Extension to four numbers", "difference": "More complex with nested loops"}}
  ]
}}

JSON response:"""
