'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    // Check if user has seen disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('haqooq-disclaimer-seen');
    if (hasSeenDisclaimer) {
      setShowDisclaimer(false);
    }
  }, []);

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    localStorage.setItem('haqooq-disclaimer-seen', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Disclaimer Banner */}
      {showDisclaimer && (
        <DisclaimerBanner onClose={handleDisclaimerClose} />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-teal-600">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Background_Image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-white/90 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              AI-Powered Legal Assistant
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
              <span className="urdu-text block mb-4 text-4xl md:text-5xl lg:text-6xl">حقوق النسوان</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">
                Empowering Women Through Law
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get instant, reliable answers about Pakistani women's rights from our comprehensive 
              legal database. Ask questions in English or Urdu and receive accurate, 
              source-backed responses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🌐</span>
                  </div>
                  <span className="font-semibold">Multilingual Support</span>
                </div>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">English</span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium urdu-text">اردو</span>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⚖️</span>
                  </div>
                  <span className="font-semibold">Legal Database</span>
                </div>
                <div className="text-sm text-white/80">5+ Legal Documents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Interactive Legal Assistant
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ask Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Legal Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get instant, accurate answers about women's rights, property laws, marriage laws, 
              and protection acts from our comprehensive legal database powered by AI.
            </p>
          </div>
          
          <div>
            <ChatInterface />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-teal-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering Women Through <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI technology with comprehensive legal knowledge 
              to provide accurate, reliable, and accessible information about women's rights in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Comprehensive Database</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Access to official legal documents, court judgments, and women's rights legislation 
                from Pakistan's legal system.
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">AI-Powered Search</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Advanced RAG technology provides accurate, context-aware answers to your legal questions 
                with source citations.
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Multilingual Support</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Ask questions in English or Urdu and receive responses in your preferred language 
                with cultural context.
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Instant Responses</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Get immediate answers to your legal questions without waiting for appointments 
                or consultations.
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Privacy & Security</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Your conversations are private and secure. We don't store personal information 
                or share your queries.
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Mobile Friendly</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Access legal information anywhere, anytime with our responsive design 
                that works on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who have found answers to their legal questions 
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Asking Questions
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
