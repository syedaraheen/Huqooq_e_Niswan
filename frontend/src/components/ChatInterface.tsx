'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    source: string;
    page: number;
    chunk_id: number;
    relevance_score: number;
  }>;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  sources: Array<{
    source: string;
    page: number;
    chunk_id: number;
    relevance_score: number;
  }>;
  conversation_id: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatSourceName = (source: string) => {
    return source.replace('.pdf', '').replace(/_/g, ' ');
  };

  const isWomenRightsSource = (source: string) => {
    const womenRightsKeywords = ['women', 'protection', 'rights', 'marriage', 'property'];
    return womenRightsKeywords.some(keyword => 
      source.toLowerCase().includes(keyword)
    );
  };

  const exampleQuestions = [
    "What are my property rights as a woman in Pakistan?",
    "How can I file for khula?",
    "What is the minimum age for marriage?",
    "What protection do I have under the Women Protection Act?",
    "Can I inherit property from my father?",
    "What are my rights in case of domestic violence?"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Chat Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Legal Assistant</h3>
              <p className="text-white/80 text-sm">Ask me anything about women's rights in Pakistan</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                  <span className="text-white text-3xl">💬</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Haqooq-e-Niswan</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I'm here to help you understand your rights as a woman in Pakistan. 
                  Ask me anything about legal matters, and I'll provide accurate, 
                  source-backed answers.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Property Rights</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Marriage Laws</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">Protection Acts</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex gap-3 max-w-2xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <span className="text-white text-sm font-bold">
                        {message.role === 'user' ? 'U' : 'A'}
                      </span>
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white text-gray-900 shadow-soft border border-gray-100'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content.replace(/\*/g, '')}
                        </p>
                        
                        {/* Sources for assistant messages */}
                        {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sources</span>
                              <div className="flex-1 h-px bg-gray-200"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {message.sources.map((source, sourceIndex) => (
                                <div
                                  key={sourceIndex}
                                  className={`text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${
                                    isWomenRightsSource(source.source)
                                      ? 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{formatSourceName(source.source)}</span>
                                    <span className="text-gray-400">Page {source.page}</span>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Relevance: {Math.round(source.relevance_score * 100)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-400 mt-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-soft border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about women's rights, property laws, marriage laws, or any legal question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none pr-12"
                rows={3}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Questions */}
      {messages.length === 0 && (
        <div className="mt-8 animate-slide-up">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Try asking one of these questions:</h4>
            <p className="text-gray-600 text-sm">Click on any question to get started</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="group text-left p-4 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-200 hover:shadow-medium"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium leading-relaxed">
                    {question}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}