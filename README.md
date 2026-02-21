# LLM Share SDK

TypeScript SDK for LLM Share Network - Interact with AI models and manage blockchain transactions.

## Features

- **Chat API**: Send messages to LLM models and receive responses
- **Streaming**: Support for streaming responses
- **Model Management**: List and select available models
- **Usage Statistics**: Track API usage and costs
- **Wallet Integration**: Connect Ethereum wallets and manage transactions
- **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install llm-share-sdk
```

## Quick Start

```typescript
import { LLMShareClient } from 'llm-share-sdk';

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

  console.log(response.choices[0].message.content);
}

main().catch(console.error);
```

## API Documentation

For detailed API documentation, see [docs/API.md](docs/API.md).

## Examples

See the [examples](examples/) directory for more usage examples:

- [Basic Usage](examples/basic-usage.ts)
- [Chat Example](examples/chat-example.ts)
- [Wallet Example](examples/wallet-example.ts)

## Requirements

- Node.js >= 18.0.0

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## License

MIT License - see [LICENSE](LICENSE) for details.
