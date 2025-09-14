import os
import uuid
import json
import numpy as np
from typing import List, Dict, Tuple, Optional
import faiss
# from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
import PyPDF2
import tiktoken
from config import OPENAI_API_KEY, GEMINI_API_KEY, EMBEDDING_MODEL, LLM_MODEL, VECTOR_DB_PATH, DATASET_PATH, GEMINI_MODEL

class RAGPipeline:
    def __init__(self):
        self.openai_api_key = OPENAI_API_KEY
        self.gemini_api_key = GEMINI_API_KEY
        self.embedding_model = EMBEDDING_MODEL
        self.llm_model = LLM_MODEL
        self.vector_db_path = VECTOR_DB_PATH
        self.dataset_path = DATASET_PATH
        
        # Initialize Gemini
        genai.configure(api_key=self.gemini_api_key)
        self.gemini_model = genai.GenerativeModel(GEMINI_MODEL)
        
        # Initialize components
        self.embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        self.llm = OpenAI(openai_api_key=self.openai_api_key, model_name=self.llm_model)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # Storage for conversations
        self.conversations = {}
        
        # Vector store
        self.vectorstore = None
        self.documents = []

    async def initialize(self):
        """Initialize the RAG pipeline by loading and processing PDFs"""
        print("Initializing RAG pipeline...")
        
        # Create vector DB directory if it doesn't exist
        os.makedirs(self.vector_db_path, exist_ok=True)
        
        # Check if vector store already exists
        if os.path.exists(os.path.join(self.vector_db_path, "index.faiss")):
            print("Loading existing vector store...")
            self.vectorstore = FAISS.load_local(
                self.vector_db_path, 
                self.embeddings,
                allow_dangerous_deserialization=True
            )
        else:
            print("Creating new vector store from PDFs...")
            await self._process_pdfs()
            await self._create_vector_store()
        
        print("RAG pipeline initialized successfully!")

    async def _process_pdfs(self):
        """Process all PDFs in the dataset folder"""
        pdf_files = [f for f in os.listdir(self.dataset_path) if f.endswith('.pdf')]
        
        for pdf_file in pdf_files:
            print(f"Processing {pdf_file}...")
            try:
                pdf_path = os.path.join(self.dataset_path, pdf_file)
                
                # Load PDF using PyPDF2
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    text = ""
                    
                    for page_num, page in enumerate(pdf_reader.pages):
                        page_text = page.extract_text()
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                
                # Split text into chunks
                chunks = self.text_splitter.split_text(text)
                
                # Create documents with metadata
                for i, chunk in enumerate(chunks):
                    doc = {
                        "content": chunk,
                        "source": pdf_file,
                        "chunk_id": i,
                        "page": self._extract_page_number(chunk)
                    }
                    self.documents.append(doc)
                    
            except Exception as e:
                print(f"Error processing {pdf_file}: {e}")
                continue
        
        print(f"Processed {len(self.documents)} chunks from {len(pdf_files)} PDFs")

    def _extract_page_number(self, chunk: str) -> int:
        """Extract page number from chunk text"""
        try:
            if "--- Page" in chunk:
                page_line = chunk.split("\n")[0]
                page_num = int(page_line.split("Page ")[1].split(" ---")[0])
                return page_num
        except:
            pass
        return 1

    async def _create_vector_store(self):
        """Create FAISS vector store from processed documents"""
        if not self.documents:
            raise ValueError("No documents to create vector store")
        
        # Prepare texts and metadata
        texts = [doc["content"] for doc in self.documents]
        metadatas = [{"source": doc["source"], "chunk_id": doc["chunk_id"], "page": doc["page"]} 
                    for doc in self.documents]
        
        # Create FAISS vector store
        self.vectorstore = FAISS.from_texts(
            texts=texts,
            embedding=self.embeddings,
            metadatas=metadatas
        )
        
        # Save vector store
        self.vectorstore.save_local(self.vector_db_path)
        print("Vector store created and saved!")

    async def process_query(self, query: str, conversation_id: Optional[str] = None) -> Tuple[str, List[Dict], str]:
        """Process a user query and return response with sources"""
        
        # Generate or use existing conversation ID
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        
        # Initialize conversation if new
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        
        # Add user message to conversation
        self.conversations[conversation_id].append({"role": "user", "content": query})
        
        # Retrieve relevant documents
        relevant_docs = self.vectorstore.similarity_search_with_score(query, k=5)
        
        # Prepare context from retrieved documents
        context = "\n\n".join([doc.page_content for doc, score in relevant_docs])
        
        # Prepare sources for response
        sources = []
        for doc, score in relevant_docs:
            source_info = {
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", 1),
                "chunk_id": doc.metadata.get("chunk_id", 0),
                "relevance_score": float(score)
            }
            sources.append(source_info)
        
        # Create prompt for LLM
        prompt = f"""
        You are a legal assistant specializing in Pakistani women's rights and laws. 
        Answer the user's question based on the provided legal documents context.
        
        Context from legal documents:
        {context}
        
        User Question: {query}
        
        Instructions:
        1. Provide a clear, accurate answer based on the legal documents
        2. If the answer is from women-specific laws or constitution, mention this
        3. Be helpful and informative
        4. If you cannot find relevant information, say so clearly
        5. Always cite the source document when possible
        
        Answer:
        """
        
        try:
            # Get response from Gemini
            response = self.gemini_model.generate_content(
                f"You are a legal assistant for Pakistani women's rights. {prompt}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=1000,
                    temperature=0.3,
                )
            )
            
            answer = response.text.strip()
            
            # Add assistant response to conversation
            self.conversations[conversation_id].append({"role": "assistant", "content": answer})
            
            return answer, sources, conversation_id
            
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            self.conversations[conversation_id].append({"role": "assistant", "content": error_msg})
            return error_msg, sources, conversation_id

    def get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Get conversation history for a given conversation ID"""
        return self.conversations.get(conversation_id, [])