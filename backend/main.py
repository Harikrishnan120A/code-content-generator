from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Code Content Generator API",
    description="AI-powered coding problem explanations using HuggingFace models",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """
    Startup event to initialize the model.
    This pre-loads the model for faster first request.
    """
    logger.info("🚀 Starting Code Content Generator API...")
    logger.info("⏳ Model will be loaded on first generation request...")
    logger.info("✅ API is ready to accept requests")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("👋 Shutting down Code Content Generator API...")

@app.get("/")
async def root():
    return {
        "message": "Code Content Generator API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "generate": "/api/generate"
    }
