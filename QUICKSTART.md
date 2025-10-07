# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Prerequisites Check

**Required:**
- Docker Desktop (with WSL2 on Windows)
- NVIDIA GPU (RTX 3050 or better, 8GB+ VRAM)
- NVIDIA Container Toolkit
- 24GB+ System RAM
- HuggingFace Account (free)

**Verify Docker & GPU:**
```powershell
# Check Docker
docker --version

# Check NVIDIA GPU
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

### Step 2: Setup Environment

1. **Get HuggingFace Token:**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token (read access is enough)
   - Copy the token

2. **Configure Environment:**
   ```powershell
   # Copy example environment file
   Copy-Item .env.example .env
   
   # Edit .env and replace with your token
   notepad .env
   ```
   
   Replace `your_huggingface_token_here` with your actual token.

### Step 3: Launch Application

```powershell
# Build and start containers
docker-compose up --build
```

**First launch takes ~5-10 minutes:**
- Building Docker images
- Installing Python packages
- Downloading model (~3-4GB) on first generation

**Access the application:**
- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## 📖 Usage Examples

### Example 1: LeetCode URL
1. Select "URL" tab
2. Paste: `https://leetcode.com/problems/two-sum/`
3. Click "Generate Explanation"
4. Wait ~45-60 seconds

### Example 2: Direct Text
1. Select "Paste Text" tab
2. Paste problem description
3. Click "Generate Explanation"

---

## 🛠️ Troubleshooting

### Issue: "CUDA not available"
**Solution:**
```powershell
# Install NVIDIA Container Toolkit
# Follow: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html
```

### Issue: "Out of memory"
**Solution:** Edit `.env`:
```
MAX_LENGTH=1024
```

### Issue: "Model download fails"
**Solution:** Pre-download model:
```powershell
docker-compose exec backend python -c "from services.hf_pipeline import get_pipeline; get_pipeline()"
```

### Issue: "Port already in use"
**Solution:** Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "8001:8000"  # Backend
```

---

## 🔧 Advanced Configuration

### Use Different Model
Edit `.env`:
```
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
```

### Adjust Generation Quality
Edit `.env`:
```
TEMPERATURE=0.7      # Lower = more focused, Higher = more creative
MAX_LENGTH=2048      # Token limit
```

### Development Mode
```powershell
# Hot reload backend
docker-compose up

# Rebuild after changes
docker-compose up --build
```

---

## 📊 Performance Metrics

### RTX 3050 (8GB VRAM)
- Model Load Time: 20-30s (first time)
- Per Stage: 15-20s
- Total Generation: 45-60s
- VRAM Usage: ~4GB
- RAM Usage: ~6-8GB

### Optimization Tips
1. Keep MAX_LENGTH ≤ 2048
2. Use 4-bit quantization (default)
3. Close other GPU applications
4. Ensure good cooling

---

## 🎨 UI Customization

### Change Accent Color
Edit `frontend/css/styles.css`:
```css
:root {
  --accent-red: #ff0033;      /* Change to your color */
  --accent-dark-red: #cc0022;
}
```

### Disable Animations
Edit `frontend/css/animations.css`:
```css
/* Comment out unwanted animations */
```

---

## 📝 Tips for Best Results

### Problem Input
- Include complete problem description
- Add constraints and examples
- Specify input/output format

### For URLs
- Use direct problem URLs
- Avoid URLs with extra parameters
- LeetCode and HackerRank work best

### Expected Output
- Concepts and prerequisites
- Naive and optimal approaches
- Worked example with steps
- Common pitfalls
- Edge cases
- Related problems

---

## 🔄 Updating

```powershell
# Stop containers
docker-compose down

# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose up --build
```

---

## 🧹 Cleanup

```powershell
# Stop containers
docker-compose down

# Remove volumes (clears model cache)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

---

## 📚 Resources

- [HuggingFace Models](https://huggingface.co/models)
- [Docker Documentation](https://docs.docker.com/)
- [NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-docker)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

**Happy Coding! 🔥**
