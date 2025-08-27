import React from 'react';
import { Clock, Copy, Trash2 } from 'lucide-react';
import { Translation } from '../types';
import { getLanguageName } from '../utils/languages';
import { copyToClipboard } from '../utils/clipboard';

interface TranslationHistoryProps {
  translations: Translation[];
  onClearHistory: () => void;
  onTranslationSelect: (translation: Translation) => void;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  translations,
  onClearHistory,
  onTranslationSelect
}) => {
  const handleCopy = async (text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const success = await copyToClipboard(text);
    if (success) {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (translations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Translations</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No translations yet</p>
          <p className="text-sm">Start translating to see your history here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Translations</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {translations.map((translation) => (
          <div
            key={translation.id}
            onClick={() => onTranslationSelect(translation)}
            className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs text-gray-500 font-medium">
                {getLanguageName(translation.sourceLang)} → {getLanguageName(translation.targetLang)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">
                  {formatTime(translation.timestamp)}
                </span>
                <button
                  onClick={(e) => handleCopy(translation.translatedText, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                  title="Copy translation"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600 line-clamp-2">
                {translation.sourceText}
              </p>
              <p className="text-sm text-gray-900 font-medium line-clamp-2">
                {translation.translatedText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};