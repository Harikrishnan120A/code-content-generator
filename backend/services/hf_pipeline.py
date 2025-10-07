from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch
from config.settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HFPipeline:
    def __init__(self):
        self.device = settings.DEVICE
        self.model_name = settings.HF_MODEL
        
        logger.info(f"Loading model: {self.model_name}")
        logger.info(f"Device: {self.device}")
        
        # Check if CUDA is available
        if self.device == "cuda" and not torch.cuda.is_available():
            logger.warning("CUDA requested but not available. Falling back to CPU.")
            self.device = "cpu"
        
        # 4-bit quantization config (only for CUDA)
        quantization_config = None
        if settings.QUANTIZATION == "4bit" and self.device == "cuda":
            try:
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
                logger.info("Using 4-bit quantization")
            except Exception as e:
                logger.warning(f"Cannot use quantization: {e}")
        
        # Load tokenizer
        logger.info("Loading tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            token=settings.HF_TOKEN,
            trust_remote_code=True
        )
        
        # Set pad token if not set
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Load model
        logger.info("Loading model (this may take a few minutes on first run)...")
        model_kwargs = {
            "token": settings.HF_TOKEN,
            "trust_remote_code": True,
            "low_cpu_mem_usage": True  # Enable memory-efficient loading
        }
        
        if quantization_config and self.device == "cuda":
            model_kwargs["quantization_config"] = quantization_config
            model_kwargs["device_map"] = "auto"
            model_kwargs["torch_dtype"] = torch.float16
        else:
            # CPU mode - use bfloat16 for better performance and stability
            model_kwargs["torch_dtype"] = torch.bfloat16
            
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            **model_kwargs
        )
        
        if self.device == "cpu":
            self.model = self.model.to("cpu")
        
        logger.info("Model loaded successfully!")
    
    def generate(self, prompt: str, max_new_tokens: int = 1024) -> str:
        """Generate text from prompt with enhanced parameters."""
        try:
            # Format prompt properly based on model type
            if "microsoft/phi" in self.model_name.lower():
                # Phi-2 instruction format
                formatted_prompt = f"Instruct: {prompt}\nOutput:"
            elif "tinyllama" in self.model_name.lower() or "llama" in self.model_name.lower():
                # TinyLlama/Llama chat format
                formatted_prompt = f"<|system|>\nYou are a helpful AI assistant specialized in programming and code explanation.</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n"
            else:
                formatted_prompt = prompt
            
            inputs = self.tokenizer(
                formatted_prompt, 
                return_tensors="pt",
                truncation=True,
                max_length=settings.MAX_LENGTH,
                padding=False
            ).to(self.device)
            
            # Enhanced generation parameters for better quality
            generation_config = {
                "max_new_tokens": max_new_tokens,
                "temperature": max(settings.TEMPERATURE, 0.1),  # Prevent zero temp
                "do_sample": True,
                "top_p": 0.95,  # Nucleus sampling for diversity
                "top_k": 50,    # Limit vocabulary for coherence
                "repetition_penalty": 1.15,  # Reduce repetition
                "length_penalty": 1.0,      # Balanced length
                "no_repeat_ngram_size": 3,  # Prevent exact phrase repetition
                "pad_token_id": self.tokenizer.pad_token_id if self.tokenizer.pad_token_id else self.tokenizer.eos_token_id,
                "eos_token_id": self.tokenizer.eos_token_id
            }
            
            logger.info(f"Generating with temperature={generation_config['temperature']}")
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    **generation_config
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the generated part (remove input prompt)
            if "tinyllama" in self.model_name.lower() or "llama" in self.model_name.lower():
                # Remove the chat template formatting
                if "<|assistant|>" in response:
                    response = response.split("<|assistant|>", 1)[1].strip()
            elif "microsoft/phi" in self.model_name.lower():
                # Remove the instruction formatting
                if "Output:" in response:
                    response = response.split("Output:", 1)[1].strip()
            elif formatted_prompt in response:
                response = response[len(formatted_prompt):].strip()
            
            return response
        
        except Exception as e:
            logger.error(f"Generation error: {str(e)}")
            raise

# Global instance (load once)
hf_pipeline = None

def get_pipeline():
    """Get or create global pipeline instance."""
    global hf_pipeline
    if hf_pipeline is None:
        hf_pipeline = HFPipeline()
    return hf_pipeline
