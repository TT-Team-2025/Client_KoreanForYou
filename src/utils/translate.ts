// utils/translate.ts

/**
 * nationality 코드를 언어 코드로 변환
 */
const nationalityToLanguageCode = (nationality: string): string => {
  const mapping: Record<string, string> = {
    'VIETNAM': 'vi',
    'ENGLISH': 'en',
    'CHINA': 'zh-CN',
    'JAPAN': 'ja',
    'USA': 'en',
    'UK': 'en',
    // 필요한 다른 국가 코드 추가
  };

  return mapping[nationality.toUpperCase()] || 'en';
};

/**
 * MyMemory Translation API를 사용한 번역
 * 무료, 브라우저에서 직접 작동
 * @param text - 번역할 텍스트 (한국어)
 * @param targetNationality - 목표 nationality (예: 'VIETNAM', 'ENGLISH')
 * @returns 번역된 텍스트
 */
export const translateText = async (
  text: string,
  targetNationality: string
): Promise<string> => {
  try {
    const targetLang = nationalityToLanguageCode(targetNationality);

    // MyMemory Translation API 호출
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=ko|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    }

    console.warn('번역 응답 오류:', data);
    return text; // 번역 실패 시 원본 반환
  } catch (error) {
    console.error('번역 오류:', error);
    // 번역 실패 시 원본 텍스트 반환
    return text;
  }
};
