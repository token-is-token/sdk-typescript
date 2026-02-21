import { LLMShareClient } from '../src';

const client = new LLMShareClient({
  apiKey: 'your-api-key',
});

async function main() {
  console.log('Connecting wallet...');
  
  try {
    const address = await client.connectWallet();
    console.log('Connected:', address);

    const balance = await client.getBalance();
    console.log('Balance (wei):', balance);

    const state = client.getWalletState();
    console.log('Wallet state:', state);
  } catch (error) {
    console.error('Wallet connection failed:', error);
  }

  const unsubscribe = client.onWalletAccountsChanged((accounts) => {
    console.log('Accounts changed:', accounts);
  });

  setTimeout(() => {
    unsubscribe();
    console.log('Unsubscribed from account changes');
  }, 10000);
}

main().catch(console.error);
