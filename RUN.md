# 🚀 HOW TO RUN

## 1️⃣ Add Your HuggingFace Token

Open `.env` file and add your token:
```
HF_TOKEN=hf_your_token_here
```

Get token: https://huggingface.co/settings/tokens

## 2️⃣ Start the Application

**CPU Mode (Recommended for first run):**
```powershell
docker-compose -f docker-compose.cpu.yml up --build
```

**GPU Mode (Requires NVIDIA setup):**
```powershell
docker-compose up --build
```

## 3️⃣ Open Application

http://localhost:3000

---

## Troubleshooting

**GPU not working?** → Use CPU mode (works great!)

**Need GPU setup?** → See QUICKSTART.md for detailed instructions

**First run slow?** → Normal! Model downloads once (3-4 GB)
