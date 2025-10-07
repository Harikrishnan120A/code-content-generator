# 🧪 Testing Guide - Code Content Generator

## Pre-Flight Checklist

Before running the application, verify:

### 1. Prerequisites Installed
```powershell
# Check Docker
docker --version
# Expected: Docker version 20.x or higher

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 2.x or higher

# Check NVIDIA GPU
nvidia-smi
# Should show your RTX 3050 with ~8GB memory

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
# Should display GPU info inside container
```

### 2. Environment Configuration
```powershell
# Verify .env file exists
Test-Path .env
# Should return: True

# Check if HF_TOKEN is set
Get-Content .env | Select-String "HF_TOKEN"
# Should show your token (not the placeholder)
```

### 3. File Structure
```powershell
# Verify all files exist
tree /F /A
# Should show 31+ files in proper structure
```

---

## 🚀 Running the Application

### Step 1: Build and Start
```powershell
# Navigate to project directory
cd "c:\Users\Hari\OneDrive\Desktop\My workspace\120"

# Build and start containers
docker-compose up --build
```

**Expected Output:**
```
Building backend...
Building frontend...
✅ code-gen-backend started
✅ code-gen-frontend started
🚀 Starting Code Content Generator API...
✅ API is ready to accept requests
```

### Step 2: Verify Services

Open separate PowerShell terminals:

**Terminal 1 - Check Backend:**
```powershell
# Test backend health
curl http://localhost:8000/api/health

# Expected response:
# {"status":"healthy","model":"deepseek-coder-6.7b-awq","device":"cuda"}
```

**Terminal 2 - Check Frontend:**
```powershell
# Test frontend
curl http://localhost:3000

# Expected: HTML content of index.html
```

**Terminal 3 - Monitor GPU:**
```powershell
# Watch GPU usage (refresh every 2 seconds)
while ($true) { Clear-Host; nvidia-smi; Start-Sleep -Seconds 2 }

# Expected: Should show GPU usage when generating
```

---

## 🧪 Test Cases

### Test 1: Simple LeetCode Problem (Two Sum)

**Input:**
1. Open: http://localhost:3000
2. Select "URL" tab
3. Paste: `https://leetcode.com/problems/two-sum/`
4. Click "Generate Explanation"

**Expected Behavior:**
- ⏱️ Loading spinner appears
- 🔄 Progress steps animate (Concepts → Solutions → Pitfalls)
- ⏱️ Generation takes 45-60 seconds
- ✅ 8 sections display:
  1. Problem Overview
  2. Key Concepts (Hash Table, Array)
  3. Naive Approach (Brute Force - O(n²))
  4. Optimal Approach (Hash Map - O(n))
  5. Worked Example
  6. Common Pitfalls (3+ items)
  7. Edge Cases (5+ items)
  8. Related Problems (3+ items)

**GPU Usage:**
- VRAM: ~4GB during generation
- GPU Utilization: 50-90%

---

### Test 2: Direct Text Input

**Input:**
```
Given an array of integers and a target value, find two numbers 
that add up to the target. Return their indices.

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
```

**Expected:**
- Similar output to Test 1
- Concepts extracted correctly
- Both approaches explained

---

### Test 3: Complex Problem (Valid Parentheses)

**Input:**
```
https://leetcode.com/problems/valid-parentheses/
```

**Expected:**
- Concepts: Stack, String Matching
- Naive: Check each pair (O(n²))
- Optimal: Stack-based (O(n))
- Pitfalls: Not handling empty string, wrong bracket types

---

### Test 4: Error Handling - Invalid URL

**Input:**
```
https://invalid-url.com/problem
```

**Expected:**
- ❌ Error notification appears
- Message: "Failed to parse problem from URL"
- App remains responsive

---

### Test 5: Error Handling - Empty Input

**Input:**
- Leave input field empty
- Click "Generate Explanation"

**Expected:**
- ⚠️ Alert: "Please provide a problem URL or text"
- No API call made

---

### Test 6: UI Interactions

**Test Collapsible Sections:**
1. Generate any explanation
2. Click section headers
3. Expected: Sections collapse/expand smoothly

**Test Copy Buttons:**
1. Find a code block
2. Click "📋 Copy" button
3. Expected: "Copied to clipboard! ✓" toast appears

**Test Animations:**
1. Watch loading spinner
2. Observe section fade-ins
3. Hover over buttons
4. Expected: Smooth red glow effects

---

## 📊 Performance Benchmarks

### First Generation (Includes Model Download)
- Model Download: 60-120 seconds (~3-4GB)
- Total First Time: 90-150 seconds

### Subsequent Generations
- Stage 1 (Concepts): 15-20s
- Stage 2 (Solutions): 15-20s
- Stage 3 (Pitfalls): 15-20s
- **Total: 45-60 seconds**

### Resource Usage
- **VRAM**: 4-5GB / 8GB (50-60% utilization)
- **RAM**: 6-8GB / 24GB (25-33% utilization)
- **CPU**: 20-30% (during generation)
- **Disk**: ~5GB (with model cache)

---

## 🔍 Debugging Tips

### Issue: Containers Won't Start

**Check Docker logs:**
```powershell
# Backend logs
docker logs code-gen-backend

# Frontend logs
docker logs code-gen-frontend
```

**Common Issues:**
- Missing .env file → Create from .env.example
- Invalid HF_TOKEN → Get new token from HuggingFace
- Port conflict → Change ports in docker-compose.yml

---

### Issue: Model Loading Fails

**Check backend logs:**
```powershell
docker logs code-gen-backend -f
```

**Look for:**
- Authentication errors → Check HF_TOKEN
- CUDA not available → Check nvidia-docker
- Out of memory → Reduce MAX_LENGTH in .env

**Manually test model download:**
```powershell
docker-compose exec backend python -c "from services.hf_pipeline import get_pipeline; get_pipeline()"
```

---

### Issue: Frontend Can't Connect to Backend

**Test connectivity:**
```powershell
# From host
curl http://localhost:8000/api/health

# From frontend container
docker-compose exec frontend curl http://backend:8000/api/health
```

**Check nginx logs:**
```powershell
docker logs code-gen-frontend
```

---

### Issue: Slow Generation

**Monitor GPU:**
```powershell
# Watch GPU in real-time
nvidia-smi -l 2
```

**Check:**
- GPU usage should be 50-90%
- If 0%, CUDA isn't being used
- If 100% for long periods, might be bottleneck

**Optimize:**
```env
# Edit .env
MAX_LENGTH=1024      # Reduce token limit
TEMPERATURE=0.5      # More focused output
```

---

## 🎯 Acceptance Criteria

Application is working correctly if:

- ✅ Both containers start without errors
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend health check returns "healthy"
- ✅ Can generate explanation for sample problem
- ✅ All 8 sections render properly
- ✅ UI animations work smoothly
- ✅ Copy buttons function
- ✅ Sections are collapsible
- ✅ Error handling works
- ✅ GPU is utilized during generation
- ✅ Generation completes in 45-60s (after first run)

---

## 📝 Sample Test Results Log

```
Test Run: 2025-10-06 15:30:00

✅ Docker Desktop Running: v24.0.6
✅ NVIDIA Driver: 545.84
✅ GPU Detected: RTX 3050 (8GB)
✅ .env Configured: HF_TOKEN set
✅ Containers Started: 2/2 healthy

Test 1 - Two Sum (URL):
✅ Input accepted
✅ Generation started
✅ Stage 1 completed: 18s
✅ Stage 2 completed: 16s
✅ Stage 3 completed: 19s
✅ Total time: 53s
✅ All sections rendered
✅ GPU used: 4.2GB VRAM

Test 2 - Direct Text:
✅ Input accepted
✅ Generation completed: 48s
✅ Output correct

Test 3 - Error Handling:
✅ Empty input caught
✅ Invalid URL handled
✅ Error notification displayed

Test 4 - UI Features:
✅ Collapsible sections work
✅ Copy buttons functional
✅ Animations smooth
✅ Responsive design working

VERDICT: ✅ ALL TESTS PASSED
```

---

## 🚨 Troubleshooting Flowchart

```
Problem?
    │
    ├─ Containers won't start
    │   └─ Check: docker logs, .env file, ports
    │
    ├─ CUDA not available
    │   └─ Check: nvidia-smi, nvidia-docker, GPU drivers
    │
    ├─ Model won't load
    │   └─ Check: HF_TOKEN, internet, disk space
    │
    ├─ Generation too slow
    │   └─ Check: GPU usage, MAX_LENGTH, other processes
    │
    ├─ Frontend can't connect
    │   └─ Check: backend health, nginx config, network
    │
    └─ Output incorrect/incomplete
        └─ Check: backend logs, TEMPERATURE, model version
```

---

## 🎓 Next Steps After Testing

Once all tests pass:

1. **Bookmark the app**: http://localhost:3000
2. **Keep Docker Desktop running** in background
3. **Try different problems**: LeetCode, custom, etc.
4. **Experiment with settings**: TEMPERATURE, MAX_LENGTH
5. **Customize UI**: Change colors in styles.css
6. **Share with friends**: They can use your setup

---

## 📞 Getting Help

If tests fail:

1. Check logs: `docker logs code-gen-backend`
2. Review README.md troubleshooting section
3. Run setup validator: `.\setup.ps1`
4. Verify GPU: `nvidia-smi`
5. Check disk space: At least 20GB free

---

**Happy Testing! 🔥**

*All tests should pass on first try if prerequisites are met*
