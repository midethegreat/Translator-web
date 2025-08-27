import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Copy, RotateCcw, Volume2, Loader2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Translation, TranslationRequest } from '../types';
import { translationService } from '../services/translationService';
import { copyToClipboard } from '../utils/clipboard';
import { getLanguageName } from '../utils/languages';

interface TranslateFormProps {
  onTranslationComplete: (translation: Translation) => void;
  initialTranslation?: Translation;
}

export const TranslateForm: React.FC<TranslateFormProps> = ({
  onTranslationComplete,
  initialTranslation
}) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  useEffect(() => {
    if (initialTranslation) {
      setSourceText(initialTranslation.sourceText);
      setTranslatedText(initialTranslation.translatedText);
      setSourceLang(initialTranslation.sourceLang);
      setTargetLang(initialTranslation.targetLang);
    }
  }, [initialTranslation]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setTranslatedText('');
    setDetectedLanguage('');

    try {
      const request: TranslationRequest = {
        text: sourceText.trim(),
        from: sourceLang,
        to: targetLang
      };

      const response = await translationService.translate(request);
      setTranslatedText(response.translatedText);
      
      if (response.detectedLanguage) {
        setDetectedLanguage(response.detectedLanguage);
      }

      const translation: Translation = {
        id: Date.now().toString(),
        sourceText: sourceText.trim(),
        translatedText: response.translatedText,
        sourceLang: response.detectedLanguage || sourceLang,
        targetLang,
        timestamp: Date.now()
      };

      onTranslationComplete(translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return;
    
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    }
  };

  const clearText = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLanguage('');
  };

  useEffect(() => {
    if (sourceText.trim()) {
      const debounceTimer = setTimeout(() => {
        handleTranslate();
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      setTranslatedText('');
      setDetectedLanguage('');
    }
  }, [sourceText, sourceLang, targetLang]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Language Selection Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <LanguageSelector
              selectedLanguage={sourceLang}
              onLanguageChange={setSourceLang}
            />
          </div>
          
          <button
            onClick={handleSwapLanguages}
            disabled={sourceLang === 'auto'}
            className={`p-2 rounded-lg transition-all ${
              sourceLang === 'auto'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Swap languages"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <LanguageSelector
              selectedLanguage={targetLang}
              onLanguageChange={setTargetLang}
              excludeAuto
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Source Text Input */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700">
              {detectedLanguage && sourceLang === 'auto' 
                ? `Detected: ${getLanguageName(detectedLanguage)}`
                : getLanguageName(sourceLang)
              }
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {sourceText.length}/5000
              </span>
              {sourceText && (
                <button
                  onClick={clearText}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-40 p-4 text-lg border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            maxLength={5000}
          />
          
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => handleCopy(sourceText)}
              disabled={!sourceText}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
            >
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </div>
        </div>

        {/* Translation Output */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700">
              {getLanguageName(targetLang)}
            </div>
            {isLoading && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </div>
            )}
          </div>
          
          <div className="w-full h-40 p-4 bg-white border border-gray-200 rounded-lg overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : translatedText ? (
              <p className="text-lg text-gray-900 leading-relaxed">
                {translatedText}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                Translation will appear here...
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => handleCopy(translatedText)}
              disabled={!translatedText || isLoading}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
            >
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};