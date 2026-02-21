import { ethers, BrowserProvider, Signer } from 'ethers';
import { WalletState, WalletConfig } from './types';
import { WalletError } from '../utils/errors';

export class WalletManager {
  private provider: BrowserProvider | null = null;
  private signer: Signer | null = null;
  private state: WalletState = {
    address: null,
    connected: false,
    chainId: null,
  };
  private config: WalletConfig;

  constructor(config: WalletConfig) {
    this.config = config;
  }

  async connect(): Promise<string> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new WalletError('No wallet provider available');
    }

    this.provider = new BrowserProvider((window as any).ethereum);

    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new WalletError('No accounts found');
      }

      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();

      this.state = {
        address,
        connected: true,
        chainId: Number(network.chainId),
      };

      return address;
    } catch (error) {
      throw new WalletError(
        error instanceof Error ? error.message : 'Failed to connect wallet'
      );
    }
  }

  async disconnect(): Promise<void> {
    this.signer = null;
    this.state = {
      address: null,
      connected: false,
      chainId: null,
    };
  }

  async getAddress(): Promise<string | null> {
    if (!this.state.connected || !this.signer) {
      return null;
    }
    return this.signer.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.signer) {
      throw new WalletError('Wallet not connected');
    }
    const address = await this.signer.getAddress();
    const balance = await this.provider!.getBalance(address);
    return balance.toString();
  }

  getSigner(): Signer | null {
    return this.signer;
  }

  getState(): WalletState {
    return { ...this.state };
  }

  isConnected(): boolean {
    return this.state.connected;
  }

  onAccountsChanged(callback: (accounts: string[]) => void): () => void {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return () => {};
    }

    const handler = (accounts: string[]) => {
      callback(accounts);
      if (accounts.length === 0) {
        this.disconnect();
      }
    };

    (window as any).ethereum.on('accountsChanged', handler);

    return () => {
      (window as any).ethereum.removeListener('accountsChanged', handler);
    };
  }

  onChainChanged(callback: (chainId: number) => void): () => void {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return () => {};
    }

    const handler = (chainId: string) => {
      callback(parseInt(chainId, 16));
    };

    (window as any).ethereum.on('chainChanged', handler);

    return () => {
      (window as any).ethereum.removeListener('chainChanged', handler);
    };
  }
}
