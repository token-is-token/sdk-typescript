export interface BlockchainConfig {
  network: string;
  rpcUrl?: string;
  contractAddress?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TokenBalance {
  address: string;
  balance: string;
  decimals: number;
}
