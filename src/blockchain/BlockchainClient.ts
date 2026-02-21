import { ethers, BrowserProvider, Contract } from 'ethers';
import { BlockchainConfig, Transaction, TokenBalance } from './types';
import { BlockchainError } from '../utils/errors';
import { validateEthAddress } from '../utils/validators';
import { weiToEther } from '../utils/helpers';

const DEFAULT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export class BlockchainClient {
  private provider: BrowserProvider | ethers.JsonRpcProvider;
  private contract: Contract | null = null;
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    this.config = config;
    
    if (config.rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    } else if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new BrowserProvider((window as any).ethereum);
    } else {
      throw new BlockchainError('No Ethereum provider available');
    }

    if (config.contractAddress) {
      this.contract = new Contract(
        config.contractAddress,
        DEFAULT_ABI,
        this.provider
      );
    }
  }

  async getBalance(address: string): Promise<string> {
    validateEthAddress(address);
    const balance = await this.provider.getBalance(address);
    return weiToEther(balance.toString());
  }

  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<TokenBalance> {
    validateEthAddress(tokenAddress);
    validateEthAddress(ownerAddress);

    const tokenContract = new Contract(tokenAddress, DEFAULT_ABI, this.provider);
    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(ownerAddress),
      tokenContract.decimals(),
    ]);

    return {
      address: ownerAddress,
      balance: balance.toString(),
      decimals,
    };
  }

  async getTransaction(hash: string): Promise<Transaction> {
    const tx = await this.provider.getTransactionReceipt(hash);
    
    if (!tx) {
      return {
        hash,
        from: '',
        to: '',
        value: '0',
        status: 'pending',
      };
    }

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value.toString(),
      gasUsed: tx.gasUsed?.toString(),
      status: tx.status === 1 ? 'confirmed' : 'failed',
    };
  }

  async waitForTransaction(hash: string): Promise<Transaction> {
    const receipt = await this.provider.waitForTransaction(hash);
    
    return {
      hash: receipt.hash,
      from: receipt.from,
      to: receipt.to || '',
      value: receipt.value.toString(),
      gasUsed: receipt.gasUsed?.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
    };
  }

  getProvider(): ethers.Provider {
    return this.provider;
  }
}
