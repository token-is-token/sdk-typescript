import { APIService } from '../api/APIService';
import { BlockchainClient } from '../blockchain/BlockchainClient';
import { WalletManager } from '../wallet/WalletManager';
import {
  ClientConfig,
  ChatParams,
  ChatResponse,
  ChatChunk,
  Model,
  UsageParams,
  UsageStats,
} from './types';
import { validateApiKey, validateRequired } from '../utils/validators';
import { APIConfig } from '../api/types';
import { BlockchainConfig } from '../blockchain/types';
import { WalletConfig } from '../wallet/types';

const DEFAULT_BASE_URL = 'https://api.llm-share.network/v1';

export class LLMShareClient {
  private apiService: APIService;
  private blockchainClient: BlockchainClient | null = null;
  private walletManager: WalletManager | null = null;
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    validateApiKey(config.apiKey);

    this.config = {
      ...config,
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
      network: config.network || 'mainnet',
      timeout: config.timeout || 30000,
    };

    const apiConfig: APIConfig = {
      baseUrl: this.config.baseUrl!,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    };

    this.apiService = new APIService(apiConfig);

    const blockchainConfig: BlockchainConfig = {
      network: this.config.network!,
    };
    this.blockchainClient = new BlockchainClient(blockchainConfig);

    const walletConfig: WalletConfig = {
      network: this.config.network!,
    };
    this.walletManager = new WalletManager(walletConfig);
  }

  async chat(params: ChatParams): Promise<ChatResponse> {
    validateRequired(params.model, 'model');
    validateRequired(params.messages, 'messages');

    return this.apiService.chat(params);
  }

  async *streamChat(params: ChatParams): AsyncGenerator<ChatChunk> {
    validateRequired(params.model, 'model');
    validateRequired(params.messages, 'messages');

    yield* this.apiService.streamChat(params);
  }

  async getModels(): Promise<Model[]> {
    return this.apiService.getModels();
  }

  async getUsage(params: UsageParams): Promise<UsageStats> {
    validateRequired(params.startDate, 'startDate');
    validateRequired(params.endDate, 'endDate');

    return this.apiService.getUsage(params);
  }

  async connectWallet(): Promise<string> {
    if (!this.walletManager) {
      throw new Error('Wallet manager not initialized');
    }
    return this.walletManager.connect();
  }

  async getBalance(): Promise<string> {
    if (!this.walletManager) {
      throw new Error('Wallet manager not initialized');
    }
    return this.walletManager.getBalance();
  }

  getWalletState() {
    return this.walletManager?.getState();
  }

  isWalletConnected(): boolean {
    return this.walletManager?.isConnected() || false;
  }

  onWalletAccountsChanged(callback: (accounts: string[]) => void): () => void {
    return this.walletManager?.onAccountsChanged(callback) || (() => {});
  }

  onWalletChainChanged(callback: (chainId: number) => void): () => void {
    return this.walletManager?.onChainChanged(callback) || (() => {});
  }

  getConfig(): Readonly<ClientConfig> {
    return { ...this.config };
  }

  getBlockchainClient(): BlockchainClient | null {
    return this.blockchainClient;
  }
}
