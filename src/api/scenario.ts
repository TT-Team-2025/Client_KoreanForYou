// api/scenario.ts
// 시나리오 AI 대화 관련 API
import apiClient from "./client";
import {
  StartScenarioRequest,
  StartScenarioResponse,
  SendMessageRequest,
  SendMessageResponse,
  SendVoiceMessageResponse,
  EndScenarioRequest,
  EndScenarioResponse,
} from "@/types/scenario";


export const startScenarioSession = async (
  data: StartScenarioRequest
): Promise<StartScenarioResponse> => {
  const response = await apiClient.post<StartScenarioResponse>(
    '/scenarios/start',
    data
  );
  console.log(response.data)
  return response.data;
};


export const sendMessage = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await apiClient.post<SendMessageResponse>(
    '/scenarios/message',
    data
  );
  console.log(data, response.data)
  return response.data;
};


export const sendVoiceMessage = async (
  threadId: string,
  audioFile: File
): Promise<SendVoiceMessageResponse> => {
  const formData = new FormData();
  // 파일 업로드는 formdata를 사용해야한다
  // 음성 파일 같은 바이너리 데이터를 서버로 전송할 때는 multipart/form-data의 형식을 사용해야 한다.
  // 일반 json형태로는 파일 전송이 안됨
  formData.append('thread_id', threadId);
  formData.append('file', audioFile);

  const response = await apiClient.post<SendVoiceMessageResponse>(
    '/scenarios/message/voice',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  console.log(response.data)
  return response.data;
};



export const endScenarioSession = async (
  data: EndScenarioRequest
): Promise<EndScenarioResponse> => {
  const response = await apiClient.post<EndScenarioResponse>(
    '/scenarios/end',
    data
  );
  console.log(response.data)
  return response.data;
};


export const getAudioFile = async (filename: string): Promise<Blob> => {
  const response = await apiClient.get(`/scenarios/audio/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * TTS 오디오 파일 URL 생성
 */
export const getAudioFileUrl = (filename: string): string => {
  const baseUrl = apiClient.defaults.baseURL || '';
  return `${baseUrl}/scenarios/audio/${filename}`;
};
