export interface WalletState {
  address: string | null;
  connected: boolean;
  chainId: number | null;
}

export interface WalletConfig {
  network: string;
}
