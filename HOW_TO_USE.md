# 🚀 HOW TO USE - Code Content Generator

## ⚠️ IMPORTANT: LeetCode URL Issue (FIXED!)

### The Problem You Saw:
LeetCode blocks automated scraping with **403 Forbidden** errors. This is a common anti-bot protection.

### ✅ THE SOLUTION (2 Options):

---

## Option 1: Use "Paste Text" Mode (RECOMMENDED) ⭐

This is the **easiest and most reliable** method:

### Steps:
1. Go to LeetCode problem page (e.g., https://leetcode.com/problems/swim-in-rising-water/)
2. **Copy the entire problem description** (Ctrl+A, then Ctrl+C on the problem text)
3. Open: http://localhost:3000
4. Click the **"📝 Paste Text"** button at the top
5. **Paste** the problem description in the text area
6. Click **"Generate Explanation ⚡"**
7. Wait 30-60 seconds
8. **Enjoy your AI-generated explanation!** 🎉

### What to Copy from LeetCode:
```
Include:
✅ Problem title
✅ Problem description
✅ Input/Output examples
✅ Constraints
✅ Follow-up questions (if any)

Skip:
❌ Comments/Discussion section
❌ Solutions section
❌ Navigation elements
```

---

## Option 2: Try URL Mode (May Work Sometimes) 🔗

The app **will try** to access LeetCode URLs, but it may fail due to blocking.

### Steps:
1. Open: http://localhost:3000
2. Make sure **"🔗 URL"** button is selected (default)
3. Paste LeetCode URL in the input field
4. Click **"Generate Explanation ⚡"**

### If You See Error:
```
"🚫 LeetCode is blocking URL access."
```

**Just switch to "Paste Text" mode** and follow Option 1 above!

---

## 📋 What to Expect

### Generation Time:
- **30-60 seconds** for complete analysis
- Progress indicator shows 3 stages:
  1. 🧠 Extracting concepts...
  2. 💡 Generating solutions...
  3. 🚨 Finding pitfalls...

### Output Includes:
✅ Problem overview with difficulty analysis  
✅ Key concepts identified  
✅ Naive approach with complexity  
✅ Optimal approach with insights  
✅ Worked example with step-by-step  
✅ Common pitfalls  
✅ Edge cases to test  
✅ Related problems  

---

## 💡 Pro Tips

### For Best Results:

1. **Use Complete Problem Text**
   - Include all examples and constraints
   - More context = better AI analysis

2. **Test Different Problems**
   - Array problems: Two Sum, Maximum Subarray
   - Graph problems: Course Schedule, Number of Islands
   - Dynamic Programming: Climbing Stairs, House Robber

3. **First Generation Takes Longer**
   - Model loads on first use (2-3 minutes)
   - Subsequent generations are 30-60 seconds

4. **Competition/Demo Tips**
   - Pre-generate 2-3 examples beforehand
   - Have them ready to show
   - Use "Paste Text" for reliability

---

## 🔍 Example: How to Get Problem Text

### From LeetCode:
1. Open problem: https://leetcode.com/problems/two-sum/
2. Select and copy this text:

```
1. Two Sum
Easy

Given an array of integers nums and an integer target, return indices 
of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and 
you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.
```

3. Paste into the app's text area
4. Generate!

---

## 🐛 Troubleshooting

### Error: "LeetCode is blocking URL access"
**Solution:** Use "Paste Text" mode instead of URL mode

### Error: "Problem text is too short"
**Solution:** Make sure you copied the complete problem description with examples

### Backend Not Responding
**Solution:** 
```powershell
# Check if containers are running
docker ps

# Restart if needed
docker-compose -f docker-compose.cpu.yml restart
```

### Slow Generation (>2 minutes)
- **First time:** Normal (model loading)
- **After first time:** Check docker logs:
  ```powershell
  docker-compose -f docker-compose.cpu.yml logs backend
  ```

---

## 🎯 Quick Start Checklist

- [ ] Containers running: `docker ps` shows both containers
- [ ] Frontend accessible: http://localhost:3000
- [ ] Backend healthy: http://localhost:8000/api/health
- [ ] Problem text copied from LeetCode
- [ ] "Paste Text" button clicked
- [ ] Problem pasted in text area
- [ ] "Generate Explanation" clicked
- [ ] Waiting 30-60 seconds... ☕
- [ ] **Success!** 🎉

---

## 🏆 For Your Competition

### What Makes This Stand Out:

1. **Self-Hosted AI** ✨
   - Not using OpenAI API
   - Uses HuggingFace model
   - Runs locally with Docker

2. **Code-Specific Model** 🎯
   - Trained for algorithm problems
   - Better than general LLMs
   - Optimized parameters

3. **Beautiful UI** 🎨
   - Dark cyberpunk theme
   - Smooth animations
   - Professional look

4. **Comprehensive Analysis** 📚
   - Multiple approaches
   - Complexity analysis
   - Pitfalls and edge cases

### Demo Strategy:

1. **Prepare 3 examples:**
   - Easy: Two Sum
   - Medium: Course Schedule
   - Hard: Swim in Rising Water

2. **Pre-generate them** (to avoid waiting)

3. **Show different features:**
   - Naive vs Optimal approach
   - Worked examples
   - Edge cases section

4. **Highlight advantages:**
   - "Self-hosted HuggingFace AI"
   - "Optimized for coding problems"
   - "Complete dockerized solution"

---

## 📞 Need Help?

Check documentation:
- **FINAL_STATUS.md** - Complete system status
- **MODEL_OPTIONS.md** - Model alternatives
- **UPGRADE_MODEL.md** - How to upgrade model
- **THIS FILE** - Usage guide

**Good luck!** 🚀🏆
