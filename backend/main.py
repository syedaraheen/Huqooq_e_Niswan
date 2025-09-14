from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from simple_rag import SimpleRAGPipeline
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(title="Haqooq-e-Niswan RAG API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline
rag_pipeline = None

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[dict]
    conversation_id: str

class HealthResponse(BaseModel):
    status: str
    message: str

@app.on_event("startup")
async def startup_event():
    global rag_pipeline
    try:
        rag_pipeline = SimpleRAGPipeline()
        await rag_pipeline.initialize()
        print("RAG Pipeline initialized successfully")
    except Exception as e:
        print(f"Error initializing RAG pipeline: {e}")
        raise e

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="Haqooq-e-Niswan API is running"
    )

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    if not rag_pipeline:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    
    try:
        response, sources, conversation_id = await rag_pipeline.process_query(
            chat_message.message, 
            chat_message.conversation_id
        )
        
        return ChatResponse(
            response=response,
            sources=sources,
            conversation_id=conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/memory/stats")
async def get_memory_stats():
    """Get memory usage statistics"""
    if not rag_pipeline:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    
    return rag_pipeline.get_memory_stats()

@app.delete("/memory/conversation/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear a specific conversation"""
    if not rag_pipeline:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    
    rag_pipeline.clear_conversation(conversation_id)
    return {"message": f"Conversation {conversation_id} cleared"}

@app.get("/memory/conversation/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Get conversation history for a specific conversation"""
    if not rag_pipeline:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    
    history = rag_pipeline.get_conversation_history(conversation_id)
    return {"conversation_id": conversation_id, "history": history}

@app.get("/memory/conversations")
async def get_all_conversations():
    """Get all conversations (admin endpoint)"""
    if not rag_pipeline:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    
    return rag_pipeline.get_all_conversations()

@app.get("/")
async def root():
    return {"message": "Haqooq-e-Niswan RAG API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)