import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES } from '../utils/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  excludeAuto?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  excludeAuto = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableLanguages = excludeAuto 
    ? LANGUAGES.filter(lang => lang.code !== 'auto')
    : LANGUAGES;

  const filteredLanguages = availableLanguages.filter(
    language =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLang = LANGUAGES.find(lang => lang.code === selectedLanguage);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="text-gray-900 font-medium">
          {selectedLang?.name || 'Select Language'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                  selectedLanguage === language.code
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{language.name}</div>
                <div className="text-sm text-gray-500">{language.nativeName}</div>
              </button>
            ))}
            
            {filteredLanguages.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-center">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};