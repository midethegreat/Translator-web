import { TranslationRequest, TranslationResponse } from '../types';

// Mock translation service - in production, this would call a real API
class TranslationService {
  private mockTranslations: Record<string, Record<string, string>> = {
    en: {
      es: 'Hola, ¿cómo estás?',
      fr: 'Bonjour, comment allez-vous?',
      de: 'Hallo, wie geht es dir?',
      it: 'Ciao, come stai?',
      pt: 'Olá, como você está?',
      ru: 'Привет, как дела?',
      ja: 'こんにちは、元気ですか？',
      ko: '안녕하세요, 어떻게 지내세요?',
      zh: '你好，你好吗？',
      ar: 'مرحبا، كيف حالك؟',
      hi: 'नमस्ते, आप कैसे हैं?',
    }
  };

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const { text, from, to } = request;

    // Handle auto-detection
    const detectedLang = from === 'auto' ? 'en' : from;

    // Simple mock translation logic
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      const translations = this.mockTranslations.en;
      if (translations[to]) {
        return {
          translatedText: translations[to],
          detectedLanguage: from === 'auto' ? detectedLang : undefined
        };
      }
    }

    // Generate a mock translation for demonstration
    const mockTranslations = [
      `[${to.toUpperCase()}] ${text}`,
      `Translated: ${text}`,
      `${text} (in ${to})`,
      `Mock translation of "${text}"`,
    ];

    const randomTranslation = mockTranslations[Math.floor(Math.random() * mockTranslations.length)];

    return {
      translatedText: randomTranslation,
      detectedLanguage: from === 'auto' ? detectedLang : undefined
    };
  }
}

export const translationService = new TranslationService();