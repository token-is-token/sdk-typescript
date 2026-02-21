import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { APIConfig } from './types';
import {
  ChatParams,
  ChatResponse,
  ChatChunk,
  Model,
  UsageParams,
  UsageStats,
} from '../client/types';
import { NetworkError, RateLimitError, AuthenticationError } from '../utils/errors';

export class APIService {
  private client: AxiosInstance;

  constructor(config: APIConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            throw new AuthenticationError('Invalid API key');
          }
          if (status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            throw new RateLimitError(
              'Rate limit exceeded',
              retryAfter ? parseInt(retryAfter, 10) : undefined
            );
          }
          throw new NetworkError(
            error.response.data?.message || error.message,
            status
          );
        }
        throw new NetworkError(error.message);
      }
    );
  }

  async chat(params: ChatParams): Promise<ChatResponse> {
    const response = await this.client.post<ChatResponse>('/chat/completions', params);
    return response.data;
  }

  async *streamChat(params: ChatParams): AsyncGenerator<ChatChunk> {
    const config: AxiosRequestConfig = {
      responseType: 'stream',
    };

    const response = await this.client.post(
      '/chat/completions',
      { ...params, stream: true },
      config
    );

    const reader = response.data;

    for await (const chunk of reader) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          yield JSON.parse(data) as ChatChunk;
        }
      }
    }
  }

  async getModels(): Promise<Model[]> {
    const response = await this.client.get<Model[]>('/models');
    return response.data;
  }

  async getUsage(params: UsageParams): Promise<UsageStats> {
    const response = await this.client.get<UsageStats>('/usage', { params });
    return response.data;
  }
}
