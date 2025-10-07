# Code Content Generator

Dark cyberpunk UI for AI-powered coding explanations using HuggingFace models.

## 🔥 Features

- **Dark Red Cyberpunk UI**: Glowing red accents with smooth animations
- **HuggingFace Integration**: Uses deepseek-coder-6.7b-awq (4-bit quantized)
- **Docker Containerized**: Easy deployment with GPU support
- **3-Stage Generation**: Concepts → Solutions → Pitfalls
- **Problem Parser**: Supports LeetCode/HackerRank URLs or direct text input
- **Optimized for RTX 3050**: 8GB VRAM + 24GB RAM configuration

## 📋 Requirements

- Docker + Docker Compose
- NVIDIA GPU with 8GB+ VRAM (RTX 3050 or better)
- NVIDIA Container Toolkit ([Installation Guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html))
- 24GB+ System RAM
- HuggingFace account and API token

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
cd code-content-generator
```

### 2. Set Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your HuggingFace token:
```
HF_TOKEN=hf_your_actual_token_here
```

Get your token from: https://huggingface.co/settings/tokens

### 3. Build and Run
```bash
docker-compose up --build
```

First build takes ~5-10 minutes. Model download happens on first generation (~3-4GB).

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 💻 Usage

### Using Problem URLs
1. Select "URL" tab
2. Paste LeetCode/HackerRank problem URL
3. Click "Generate Explanation"

### Using Direct Text
1. Select "Paste Text" tab
2. Paste problem description
3. Click "Generate Explanation"

### Demo Problems
- **LeetCode Two Sum**: `https://leetcode.com/problems/two-sum/`
- **LeetCode Valid Parentheses**: `https://leetcode.com/problems/valid-parentheses/`
- **HackerRank**: Copy any problem text directly

## ⚙️ Hardware Optimization

### Model Configuration
- **Model**: deepseek-ai/deepseek-coder-6.7b-instruct-awq
- **Quantization**: 4-bit (NF4 with double quantization)
- **VRAM Usage**: ~4GB
- **Batch Size**: 1
- **Max Tokens**: 2048

### Performance
- **First Generation**: ~30-45 seconds (includes model loading)
- **Subsequent Generations**: ~15-20 seconds per stage
- **Total Per Problem**: ~45-60 seconds (3 stages)

### Fallback Model
If deepseek-coder doesn't work, edit `.env`:
```
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
```

## 🐛 Troubleshooting

### CUDA/GPU Not Detected
```bash
# Check NVIDIA driver
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

### Out of Memory Errors
Reduce max tokens in `.env`:
```
MAX_LENGTH=1024
```

### Slow Generation
Verify GPU is being used:
```bash
# In another terminal while generating
nvidia-smi
```

Should show `code-gen-backend` process using GPU.

### Model Download Fails
Pre-download model manually:
```bash
docker-compose exec backend python -c "from services.hf_pipeline import get_pipeline; get_pipeline()"
```

### Port Already in Use
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "8001:8000"  # Backend
```

## 📁 Project Structure

```
code-content-generator/
├── docker-compose.yml
├── .env.example
├── .dockerignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── models.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── parser.py
│   │   ├── hf_pipeline.py
│   │   └── prompts.py
│   └── config/
│       ├── __init__.py
│       └── settings.py
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── css/
│   │   ├── styles.css
│   │   └── animations.css
│   └── js/
│       ├── app.js
│       ├── renderer.js
│       └── utils.js
│
└── scripts/
    └── download-model.sh
```

## 🎨 UI Features

- **Glowing Buttons**: Red pulse animation
- **Input Focus Effects**: Red glow on textarea/input focus
- **Hover Effects**: Card borders glow on hover
- **Loading States**: Animated spinner with progress steps
- **Collapsible Sections**: Click headers to expand/collapse
- **Syntax Highlighting**: Code blocks with cyberpunk theme
- **Smooth Scrolling**: Auto-scroll to results
- **Responsive Design**: Works on desktop and tablet

## 🔧 Advanced Configuration

### Custom Model
Edit `.env`:
```
HF_MODEL=your-model-name
HF_TOKEN=your_token
```

### Adjust Generation Parameters
```
TEMPERATURE=0.7      # Creativity (0.1-1.0)
MAX_LENGTH=2048      # Max tokens per stage
```

### Development Mode
For hot-reload during development:
```bash
# Backend (add volume mount in docker-compose.yml)
volumes:
  - ./backend:/app

# Frontend (already mounted)
```

## 📝 API Documentation

### POST /api/generate
Generate explanation for coding problem.

**Request Body:**
```json
{
  "input_type": "url",
  "content": "https://leetcode.com/problems/two-sum/"
}
```

**Response:**
```json
{
  "overview": "Problem description...",
  "concepts": {
    "concepts": ["Hash Table", "Array"],
    "prerequisites": ["Basic loops", "Hash map operations"],
    "difficulty": "Easy",
    "difficulty_reason": "...",
    "analogy": "..."
  },
  "naive_approach": { ... },
  "optimal_approach": { ... },
  "worked_example": { ... },
  "pitfalls": [ ... ],
  "edge_cases": [ ... ],
  "related_problems": [ ... ]
}
```

### GET /api/health
Check backend status.

**Response:**
```json
{
  "status": "healthy",
  "model": "deepseek-coder-6.7b-awq"
}
```

## 🛑 Stopping the Application

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (clears model cache)
docker-compose down -v
```

## 📦 Model Cache

Models are cached in Docker volume `hf-cache` (~4GB). To clear:
```bash
docker volume rm 120_hf-cache
```

## 🤝 Contributing

Feel free to customize the UI colors, add new features, or optimize prompts!

## 📄 License

MIT License - Use freely for personal or commercial projects.

---

**Enjoy generating comprehensive coding explanations with style!** 🔥💻
