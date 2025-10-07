import httpx
from bs4 import BeautifulSoup
from typing import Optional
import re

def parse_problem(url: str) -> str:
    """
    Parse coding problem from supported platforms (LeetCode, HackerRank).
    Returns the problem description text.
    """
    try:
        # Normalize URL
        url = url.strip()
        
        # Detect platform
        if "leetcode.com" in url:
            return parse_leetcode(url)
        elif "hackerrank.com" in url:
            return parse_hackerrank(url)
        else:
            raise ValueError("Unsupported platform. Please use LeetCode or HackerRank URLs, or paste text directly.")
    
    except Exception as e:
        raise ValueError(f"Failed to parse problem from URL: {str(e)}")

def parse_leetcode(url: str) -> str:
    """Parse LeetCode problem description."""
    try:
        # Enhanced headers to avoid 403 blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://leetcode.com/',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        }
        
        with httpx.Client(timeout=30.0, follow_redirects=True) as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Try multiple selectors for LeetCode's dynamic content
        description = None
        
        # Method 1: Look for problem description div
        desc_div = soup.find('div', class_=re.compile(r'_1l1MA|elfjS|content__'))
        if desc_div:
            description = desc_div.get_text(separator='\n', strip=True)
        
        # Method 2: Look for meta description
        if not description:
            meta_desc = soup.find('meta', property='og:description')
            if meta_desc:
                description = meta_desc.get('content', '')
        
        # Method 3: Extract from title and any visible text
        if not description:
            title = soup.find('title')
            if title:
                description = title.get_text(strip=True)
        
        if description and len(description) > 20:
            return clean_text(description)
        else:
            raise ValueError("Could not extract problem description from LeetCode URL. LeetCode may be blocking automated requests. Please paste the problem text directly instead.")
    
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            raise ValueError("LeetCode is blocking automated requests (403 Forbidden). Please copy and paste the problem text directly using the 'Paste Text' option instead.")
        raise ValueError(f"HTTP error accessing LeetCode ({e.response.status_code}): {str(e)}")
    except httpx.HTTPError as e:
        raise ValueError(f"Network error accessing LeetCode: {str(e)}. Please check your internet connection or paste the problem text directly.")

def parse_hackerrank(url: str) -> str:
    """Parse HackerRank problem description."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        with httpx.Client(timeout=30.0, follow_redirects=True) as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Try to find problem statement
        problem_statement = soup.find('div', class_=re.compile(r'problem-statement|challenge-body-html'))
        
        if problem_statement:
            description = problem_statement.get_text(separator='\n', strip=True)
            return clean_text(description)
        else:
            raise ValueError("Could not extract problem description from HackerRank URL")
    
    except httpx.HTTPError as e:
        raise ValueError(f"HTTP error accessing HackerRank: {str(e)}")

def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove common noise
    text = re.sub(r'(Sign in|Register|Subscribe|Premium|Discuss|Solutions?|Submissions?)', '', text, flags=re.IGNORECASE)
    # Trim
    text = text.strip()
    return text
