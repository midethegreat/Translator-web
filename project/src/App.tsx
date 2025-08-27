import React, { useState } from 'react';
import { Languages, Sparkles } from 'lucide-react';
import { TranslateForm } from './components/TranslateForm';
import { TranslationHistory } from './components/TranslationHistory';
import { Translation } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [translations, setTranslations] = useLocalStorage<Translation[]>('translation-history', []);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | undefined>();

  const handleTranslationComplete = (translation: Translation) => {
    setTranslations(prev => [translation, ...prev.slice(0, 49)]); // Keep only 50 recent translations
    setSelectedTranslation(undefined);
  };

  const handleClearHistory = () => {
    setTranslations([]);
  };

  const handleTranslationSelect = (translation: Translation) => {
    setSelectedTranslation(translation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <Languages className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Translator
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Translate text instantly between over 100 languages with our advanced AI-powered translation service.
            Fast, accurate, and completely free.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span>Powered by advanced machine learning</span>
          </div>
        </div>

        {/* Main Translation Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <TranslateForm
              onTranslationComplete={handleTranslationComplete}
              initialTranslation={selectedTranslation}
            />
          </div>
          
          <div className="xl:col-span-1">
            <TranslationHistory
              translations={translations}
              onClearHistory={handleClearHistory}
              onTranslationSelect={handleTranslationSelect}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Languages className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100+ Languages</h3>
            <p className="text-gray-600 text-sm">
              Support for all major world languages with high accuracy and natural-sounding translations.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Translation</h3>
            <p className="text-gray-600 text-sm">
              Real-time translation as you type with automatic language detection for seamless experience.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 text-orange-600 font-bold text-sm flex items-center justify-center">
                🔒
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">
              Your translations are processed securely and stored locally. We never share your data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 AI Translator. Made with ❤️ for global communication.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;