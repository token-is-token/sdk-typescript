# LLM Share SDK - API Documentation

## Installation

```bash
npm install llm-share-sdk
```

## Client Configuration

```typescript
import { LLMShareClient } from 'llm-share-sdk';

const client = new LLMShareClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.llm-share.network/v1', // optional
  network: 'mainnet', // 'mainnet' | 'testnet' | 'devnet'
  timeout: 30000, // optional, default 30000ms
});
```

## Chat API

### Send Chat Message

```typescript
const response = await client.chat({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ],
  temperature: 0.7,
  maxTokens: 500,
});

console.log(response.choices[0].message.content);
```

### Stream Chat

```typescript
for await (const chunk of client.streamChat({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Tell me a story' }],
})) {
  console.log(chunk.choices[0].delta.content);
}
```

## Model Management

### List Available Models

```typescript
const models = await client.getModels();
console.log(models);
```

## Usage Statistics

### Get Usage

```typescript
const usage = await client.getUsage({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  modelId: 'gpt-4', // optional
});

console.log(usage.totalTokens);
console.log(usage.cost);
```

## Wallet Integration

### Connect Wallet

```typescript
const address = await client.connectWallet();
console.log('Connected:', address);
```

### Get Balance

```typescript
const balance = await client.getBalance();
console.log('Balance (wei):', balance);
```

### Wallet Events

```typescript
const unsubscribe = client.onWalletAccountsChanged((accounts) => {
  console.log('Accounts changed:', accounts);
});

const unsubscribeChain = client.onWalletChainChanged((chainId) => {
  console.log('Chain changed:', chainId);
});
```

## Error Handling

```typescript
import { ValidationError, NetworkError, AuthenticationError } from 'llm-share-sdk';

try {
  await client.chat({ /* ... */ });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message, error.statusCode);
  } else if (error instanceof AuthenticationError) {
    console.error('Auth error:', error.message);
  }
}
```

## Types

### ClientConfig

```typescript
interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  network?: 'mainnet' | 'testnet' | 'devnet';
  timeout?: number;
}
```

### ChatParams

```typescript
interface ChatParams {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### ChatResponse

```typescript
interface ChatResponse {
  id: string;
  model: string;
  choices: ChatChoice[];
  usage?: UsageStats;
  created: number;
}
```
