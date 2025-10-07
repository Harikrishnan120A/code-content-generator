# 🤖 HuggingFace Model Options for Code Content Generator

## Currently Configured
**Model:** `deepseek-ai/deepseek-coder-6.7b-instruct-awq`
- **Size:** 6.7B parameters (4-bit quantized = ~4GB RAM)
- **Strength:** Code-specific training, fast inference
- **Best for:** Code explanations, algorithm walkthroughs
- **Status:** ✅ Already working!

---

## 🏆 RECOMMENDED UPGRADES (For Better Results)

### Option 1: CodeLlama (Meta) - Best for Code
```env
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
```
**Pros:**
- Meta's official code model
- Excellent at algorithm explanations
- Better at pseudocode generation
- More reliable JSON output

**Cons:**
- Larger (~7GB on CPU)
- Slightly slower than DeepSeek

### Option 2: Mistral 7B Instruct - Best All-Round
```env
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```
**Pros:**
- Superior reasoning abilities
- Better at explaining "why" behind algorithms
- Excellent instruction following
- Great for educational content

**Cons:**
- Not code-specific
- ~14GB RAM needed (or use quantized version)

### Option 3: DeepSeek Coder 33B (Best Quality)
```env
HF_MODEL=deepseek-ai/deepseek-coder-33b-instruct
```
**Pros:**
- **BEST code understanding**
- Most accurate explanations
- Handles complex algorithms perfectly
- Professional-grade output

**Cons:**
- Requires **GPU with 20GB+ VRAM** or 64GB+ RAM
- Much slower on CPU (~5 minutes per generation)

### Option 4: Phi-3 Mini (Fastest)
```env
HF_MODEL=microsoft/Phi-3-mini-4k-instruct
```
**Pros:**
- **Super fast** (10-15 seconds on CPU)
- Only 3.8B parameters (~2GB RAM)
- Surprisingly good quality
- Great for demos/testing

**Cons:**
- Less detailed explanations
- May miss edge cases

---

## 🎯 QUANTIZED VERSIONS (For Limited RAM)

If you have <16GB RAM, use these quantized versions:

### CodeLlama Quantized
```env
HF_MODEL=TheBloke/CodeLlama-7B-Instruct-AWQ
```

### Mistral Quantized
```env
HF_MODEL=TheBloke/Mistral-7B-Instruct-v0.2-AWQ
```

---

## 🚀 HOW TO SWITCH MODELS

1. **Stop containers:**
```powershell
docker-compose -f docker-compose.cpu.yml down
```

2. **Edit `.env` file:**
```env
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
# or any model from above
```

3. **Restart:**
```powershell
docker-compose -f docker-compose.cpu.yml up -d
```

4. **First generation will download new model** (~10-15 min)

---

## 💡 MY RECOMMENDATION FOR "WINNING"

### For **Best Quality** (if you have 16GB+ RAM):
```env
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
TEMPERATURE=0.3
MAX_LENGTH=4096
```

### For **Speed + Quality Balance** (current setup):
```env
HF_MODEL=deepseek-ai/deepseek-coder-6.7b-instruct-awq
TEMPERATURE=0.5
MAX_LENGTH=2048
```

### For **Maximum Speed** (demos):
```env
HF_MODEL=microsoft/Phi-3-mini-4k-instruct
TEMPERATURE=0.4
MAX_LENGTH=2048
```

---

## 🎮 ADVANCED: Use Multiple Models

You can configure fallback models for robustness:

**Edit `backend/services/hf_pipeline.py`** to try multiple models if one fails.

---

## 📊 Model Comparison

| Model | Size | Speed | Quality | RAM Needed |
|-------|------|-------|---------|------------|
| **DeepSeek 6.7B AWQ** (current) | 6.7B | ⚡⚡⚡ Fast | ⭐⭐⭐⭐ Great | 8GB |
| **CodeLlama 7B** | 7B | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best | 14GB |
| **Mistral 7B** | 7B | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best | 16GB |
| **Phi-3 Mini** | 3.8B | ⚡⚡⚡⚡ Fastest | ⭐⭐⭐ Good | 4GB |
| **DeepSeek 33B** | 33B | ⚡ Slow | ⭐⭐⭐⭐⭐ Perfect | 40GB+ |

---

## 🏆 FOR COMPETITION/DEMO

Use **CodeLlama 7B** - best balance of quality and performance:

```bash
# Update .env
HF_MODEL=codellama/CodeLlama-7b-Instruct-hf
TEMPERATURE=0.3  # More focused outputs
MAX_LENGTH=3072  # Longer explanations
```

This will give you:
✅ Better algorithm explanations
✅ More accurate complexity analysis
✅ Clearer step-by-step walkthroughs
✅ Professional-quality output
