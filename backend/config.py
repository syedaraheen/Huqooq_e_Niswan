import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCYh_UO-Ftuw_vGeT7isQU-irJak4942ww")

# Model Configuration
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")

# Paths
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vector_db")
DATASET_PATH = os.getenv("DATASET_PATH", "../Dataset")

# Gemini Configuration
GEMINI_MODEL = "gemini-2.0-flash-exp"