export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}