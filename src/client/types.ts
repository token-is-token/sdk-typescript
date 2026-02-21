export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  network?: Network;
  timeout?: number;
}

export type Network = 'mainnet' | 'testnet' | 'devnet';

export interface ChatParams {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  model: string;
  choices: ChatChoice[];
  usage?: UsageStats;
  created: number;
}

export interface ChatChoice {
  index: number;
  message: ChatMessage;
  finishReason: string;
}

export interface ChatChunk {
  id: string;
  choices: StreamChoice[];
}

export interface StreamChoice {
  index: number;
  delta: Partial<ChatMessage>;
  finishReason?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: ModelPricing;
}

export interface ModelPricing {
  input: number;
  output: number;
  currency: string;
}

export interface UsageParams {
  startDate: string;
  endDate: string;
  modelId?: string;
}

export interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}
