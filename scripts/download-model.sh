#!/bin/bash
# Download HuggingFace model to cache

echo "🔥 Code Content Generator - Model Download Script"
echo "=================================================="
echo ""

# Check if HF_TOKEN is set
if [ -z "$HF_TOKEN" ]; then
    echo "⚠️  Warning: HF_TOKEN not set. You may need authentication for some models."
    echo "   Set it with: export HF_TOKEN=your_token_here"
    echo ""
fi

# Model to download
MODEL=${HF_MODEL:-"deepseek-ai/deepseek-coder-6.7b-instruct-awq"}

echo "📦 Downloading model: $MODEL"
echo "   This may take several minutes (~3-4GB)..."
echo ""

# Download using Python
python3 -c "
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

model_name = os.environ.get('HF_MODEL', 'deepseek-ai/deepseek-coder-6.7b-instruct-awq')
token = os.environ.get('HF_TOKEN')

print(f'Downloading tokenizer for {model_name}...')
tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    token=token,
    trust_remote_code=True
)

print(f'Downloading model {model_name}...')
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    token=token,
    trust_remote_code=True,
    low_cpu_mem_usage=True
)

print('✅ Model downloaded successfully!')
print(f'   Cached at: ~/.cache/huggingface/')
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Model download complete!"
    echo "   You can now run: docker-compose up"
else
    echo ""
    echo "❌ Model download failed!"
    echo "   Please check your internet connection and HF_TOKEN"
    exit 1
fi
