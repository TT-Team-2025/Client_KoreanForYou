// api/external.ts
// 외부 API 서비스 관련 엔드포인트 (TTS/STT/LLM)
import apiClient from "./client";
import {
  TTSRequest,
  TTSFileResponse,
  STTFileResponse,
  STTTranscribeResultResponse,
  LLMRequest,
  LLMGenerateResponse,
  AudioFileExtension,
} from "@/types/external";

// tts
export const textToSpeech = async (data: TTSRequest): Promise<Blob> => {
  const response = await apiClient.post<Blob>("/external/tts", data, {
    responseType: "blob",
  });
  console.log("TTS 오디오 생성 완료:", data);
  return response.data;
};

// save tts 
export const textToSpeechFile = async (
  data: TTSRequest
): Promise<TTSFileResponse> => {
  // FormData로 변환
  const formData = new FormData();
  formData.append("text", data.text);
  if (data.speaker) formData.append("speaker", data.speaker);
  if (data.speed !== undefined) formData.append("speed", data.speed.toString());
  if (data.volume !== undefined)
    formData.append("volume", data.volume.toString());
  if (data.pitch !== undefined) formData.append("pitch", data.pitch.toString());
  if (data.emotion) formData.append("emotion", data.emotion);
  if (data.format) formData.append("format", data.format);

  const response = await apiClient.post<TTSFileResponse>(
    "/external/tts/file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("TTS 파일 생성 완료:", response.data);
  return response.data;
};

// stt
export const transcribeFile = async (
  audioFile: File
): Promise<STTFileResponse> => {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await apiClient.post<STTFileResponse>(
    "/external/stt/file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("STT 전사 요청 완료:", response.data);
  return response.data;
};


export const getTranscribeResult = async (
  transcribeId: string
): Promise<STTTranscribeResultResponse> => {
  const response = await apiClient.get<STTTranscribeResultResponse>(
    `/external/stt/file/${transcribeId}`
  );
  console.log("STT 전사 결과 조회 완료:", response.data);
  return response.data;
};


// llm
export const generateTextWithLLM = async (
  data: LLMRequest
): Promise<LLMGenerateResponse> => {
  const response = await apiClient.post<LLMGenerateResponse>(
    "/external/llm/generate",
    data
  );
  console.log("LLM 텍스트 생성 완료:", response.data);
  return response.data;
};


export const createAudioUrl = (blob: Blob): string => {
  console.log("createAudioUrl 호출됨 - Blob 정보:", {
    size: blob.size,
    type: blob.type,
  });
  const url = URL.createObjectURL(blob);
  console.log("생성된 Audio URL:", url);
  return url;
};


export const isValidAudioExtension = (filename: string): boolean => {
  const allowedExtensions: AudioFileExtension[] = [".mp4", ".m4a", ".mp3", ".amr", ".flac", ".wav"];
  const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  return allowedExtensions.includes(extension as AudioFileExtension);
};
