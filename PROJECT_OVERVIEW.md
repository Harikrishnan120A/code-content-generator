# Code Content Generator - Project Overview

## 🎯 Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Port 3000)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Dark Red Cyberpunk UI (Nginx + Static Files)          │ │
│  │  - URL/Text Input Toggle                               │ │
│  │  - Loading States with Progress                        │ │
│  │  - Collapsible Output Sections                         │ │
│  │  - Smooth Animations & Glowing Effects                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/HTTPS
                    /api/* → Backend
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API (Port 8000)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  FastAPI Application                                    │ │
│  │  ├─ POST /api/generate  (Main endpoint)                │ │
│  │  └─ GET  /api/health    (Health check)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services Layer                                         │ │
│  │  ├─ Problem Parser (LeetCode/HackerRank scraper)       │ │
│  │  ├─ HF Pipeline (Model loader & inference)             │ │
│  │  └─ Prompts (3-stage generation templates)             │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  HuggingFace Model (deepseek-coder-6.7b-awq)          │ │
│  │  - 4-bit Quantization (NF4)                            │ │
│  │  - GPU Accelerated (CUDA 11.8)                         │ │
│  │  - ~4GB VRAM Usage                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Complete File Structure

```
code-content-generator/
│
├── 📄 docker-compose.yml          # Orchestrates frontend + backend containers
├── 📄 .env.example                # Environment template with HF config
├── 📄 .env                        # Your actual environment (create this!)
├── 📄 .dockerignore               # Exclude files from Docker build
├── 📄 .gitignore                  # Exclude files from Git
├── 📄 README.md                   # Full documentation
├── 📄 QUICKSTART.md               # Quick start guide
├── 📄 PROJECT_OVERVIEW.md         # This file
│
├── 📁 backend/                    # Python FastAPI application
│   ├── 📄 Dockerfile              # Backend container config (CUDA + Python)
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 main.py                 # FastAPI app entry point
│   │
│   ├── 📁 api/                    # API layer
│   │   ├── 📄 __init__.py
│   │   ├── 📄 routes.py           # API endpoints (/generate, /health)
│   │   └── 📄 models.py           # Pydantic data models
│   │
│   ├── 📁 services/               # Business logic
│   │   ├── 📄 __init__.py
│   │   ├── 📄 parser.py           # URL scraper (BeautifulSoup)
│   │   ├── 📄 hf_pipeline.py      # HuggingFace model wrapper
│   │   └── 📄 prompts.py          # 3-stage prompt templates
│   │
│   └── 📁 config/                 # Configuration
│       ├── 📄 __init__.py
│       └── 📄 settings.py         # Environment settings (Pydantic)
│
├── 📁 frontend/                   # Static web application
│   ├── 📄 Dockerfile              # Frontend container config (Nginx)
│   ├── 📄 nginx.conf              # Reverse proxy config
│   ├── 📄 index.html              # Main HTML structure
│   │
│   ├── 📁 css/                    # Stylesheets
│   │   ├── 📄 styles.css          # Dark red cyberpunk theme
│   │   └── 📄 animations.css      # Pulse, glow, fade animations
│   │
│   └── 📁 js/                     # JavaScript modules
│       ├── 📄 app.js              # Main app logic & API calls
│       ├── 📄 renderer.js         # Output rendering functions
│       └── 📄 utils.js            # Helper utilities
│
└── 📁 scripts/                    # Utility scripts
    ├── 📄 download-model.sh       # Pre-download model (Linux/Mac)
    ├── 📄 download-model.ps1      # Pre-download model (Windows)
    └── 📄 setup.ps1               # Setup validation script (Windows)
```

---

## 🔄 Request Flow

### User Journey
```
1. User opens http://localhost:3000
   └─→ Nginx serves index.html + CSS + JS

2. User inputs problem (URL or text)
   └─→ JavaScript validates input
   └─→ Shows loading animation

3. Frontend POSTs to /api/generate
   └─→ Nginx proxies to backend:8000

4. Backend receives request
   ├─→ If URL: parser.py scrapes problem
   └─→ If text: uses directly

5. HF Pipeline runs 3 stages:
   ├─→ Stage 1: Extract concepts (512 tokens)
   ├─→ Stage 2: Generate solutions (1024 tokens)
   └─→ Stage 3: Find pitfalls (1024 tokens)

6. Backend returns JSON response

7. Frontend renderer.js displays:
   ├─→ Overview
   ├─→ Concepts & Prerequisites
   ├─→ Naive Approach
   ├─→ Optimal Approach
   ├─→ Worked Example
   ├─→ Pitfalls
   ├─→ Edge Cases
   └─→ Related Problems
```

---

## 🎨 UI Features

### Design System
- **Primary Color**: `#ff0033` (Red)
- **Background**: Black gradient (`#0a0a0a` → `#1a0a0a`)
- **Glow Effect**: `box-shadow: 0 0 20px rgba(255, 0, 51, 0.6)`
- **Fonts**: Inter (UI), Fira Code (code blocks)

### Interactive Elements
- ✅ Toggle buttons (URL/Text)
- ✅ Glowing input fields on focus
- ✅ Pulsing generate button
- ✅ Animated loading spinner with progress steps
- ✅ Collapsible output sections
- ✅ Hover effects on cards
- ✅ Smooth scroll to results
- ✅ Custom error notifications

---

## ⚙️ Configuration Options

### Environment Variables (.env)
```env
HF_MODEL=deepseek-ai/deepseek-coder-6.7b-instruct-awq
HF_TOKEN=hf_your_token_here
DEVICE=cuda
QUANTIZATION=4bit
MAX_LENGTH=2048
TEMPERATURE=0.7
```

### Model Alternatives
```
deepseek-ai/deepseek-coder-6.7b-instruct-awq  (Recommended)
codellama/CodeLlama-7b-Instruct-hf            (Fallback)
bigcode/starcoder                             (Alternative)
```

---

## 🚀 Deployment Checklist

- [ ] Install Docker Desktop
- [ ] Install NVIDIA drivers (latest)
- [ ] Install NVIDIA Container Toolkit
- [ ] Create HuggingFace account
- [ ] Get HuggingFace API token
- [ ] Copy `.env.example` to `.env`
- [ ] Update `HF_TOKEN` in `.env`
- [ ] Run `docker-compose up --build`
- [ ] Wait for first model download (~3-4GB)
- [ ] Access http://localhost:3000
- [ ] Test with sample problem

---

## 📊 Performance Metrics

### Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| GPU       | RTX 3050 (8GB) | RTX 3060+ (12GB) |
| RAM       | 24GB | 32GB+ |
| Storage   | 20GB free | 50GB+ |
| CPU       | 4 cores | 8+ cores |

### Timing (RTX 3050)
| Operation | Duration |
|-----------|----------|
| Model Load | 20-30s (first time) |
| Stage 1 (Concepts) | 15-20s |
| Stage 2 (Solutions) | 15-20s |
| Stage 3 (Pitfalls) | 15-20s |
| **Total** | **45-60s** |

### Resource Usage
| Resource | Usage |
|----------|-------|
| VRAM     | ~4GB |
| RAM      | ~6-8GB |
| CPU      | 20-30% |
| Disk     | ~5GB (with cache) |

---

## 🔧 Customization Guide

### Change UI Color Scheme
Edit `frontend/css/styles.css`:
```css
:root {
  --accent-red: #00ff00;        /* Green theme */
  --accent-dark-red: #00cc00;
}
```

### Adjust Generation Speed
Edit `.env`:
```env
MAX_LENGTH=1024      # Faster, shorter responses
TEMPERATURE=0.5      # More focused outputs
```

### Add New Prompt Stage
1. Add prompt to `backend/services/prompts.py`
2. Update `backend/api/routes.py` to call new stage
3. Update `frontend/js/renderer.js` to display results

### Support New Platform (e.g., Codeforces)
1. Add parser function to `backend/services/parser.py`
2. Add platform detection logic
3. Test with sample URLs

---

## 🐛 Common Issues & Solutions

### Issue: Model won't load
**Symptoms**: Timeout, memory errors
**Solutions**:
- Reduce `MAX_LENGTH` to 1024
- Try fallback model (CodeLlama)
- Ensure 8GB+ VRAM available
- Close other GPU apps

### Issue: Slow generation
**Symptoms**: Takes >2 minutes per stage
**Solutions**:
- Check GPU usage: `nvidia-smi`
- Verify CUDA is enabled
- Reduce `MAX_LENGTH`
- Check CPU/RAM availability

### Issue: Parser fails
**Symptoms**: "Could not extract problem"
**Solutions**:
- Use direct text input instead
- Check URL is accessible
- Verify internet connection
- Try different problem URL

### Issue: JSON parsing error
**Symptoms**: "Could not extract valid JSON"
**Solutions**:
- Increase `TEMPERATURE` slightly
- Try simpler problem first
- Check model is fully downloaded
- Restart containers

---

## 📈 Future Enhancements

### Potential Features
- [ ] Multiple language support (Python, Java, C++, etc.)
- [ ] Save/export explanations as PDF
- [ ] User accounts & history
- [ ] Vote on explanation quality
- [ ] Custom prompt templates
- [ ] Streaming responses (SSE)
- [ ] Code execution sandbox
- [ ] Video explanations (text-to-speech)
- [ ] Mobile-responsive design
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Problem difficulty predictor

### Optimization Ideas
- [ ] Model caching for repeated problems
- [ ] Parallel stage execution
- [ ] Response caching with Redis
- [ ] Load balancing for multiple GPUs
- [ ] Fine-tuned model on coding problems
- [ ] Smaller model for faster prototyping

---

## 📚 Technology Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **ML Library**: Transformers 4.36.2
- **Quantization**: bitsandbytes 0.41.3
- **GPU**: PyTorch + CUDA 11.8
- **Scraping**: BeautifulSoup4 4.12.2

### Frontend
- **Server**: Nginx (Alpine)
- **HTML5**: Semantic structure
- **CSS3**: Custom variables, animations
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Fonts**: Google Fonts (Inter, Fira Code)

### DevOps
- **Containerization**: Docker + Docker Compose
- **GPU Support**: NVIDIA Container Toolkit
- **Proxy**: Nginx reverse proxy
- **Volumes**: Model cache persistence

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally with Docker
5. Submit pull request

### Code Style
- **Python**: PEP 8, type hints
- **JavaScript**: ESLint-compatible
- **CSS**: BEM naming convention
- **Comments**: Docstrings for functions

---

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🎓 Learning Resources

- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)
- [Docker Compose](https://docs.docker.com/compose/)
- [CUDA Programming](https://docs.nvidia.com/cuda/)
- [Prompt Engineering](https://www.promptingguide.ai/)

---

**Built with ❤️ and 🔥**
