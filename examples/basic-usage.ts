import { LLMShareClient } from '../src';

const client = new LLMShareClient({
  apiKey: 'your-api-key',
  network: 'testnet',
});

async function main() {
  const response = await client.chat({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
  });

  console.log('Response:', response);
}

main().catch(console.error);
