import { LLMShareClient } from '../src';

const client = new LLMShareClient({
  apiKey: 'your-api-key',
});

async function main() {
  const models = await client.getModels();
  console.log('Available models:', models);

  const response = await client.chat({
    model: models[0].id,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' },
    ],
    temperature: 0.7,
    maxTokens: 500,
  });

  console.log('Chat response:', response.choices[0].message.content);

  console.log('Usage:', response.usage);
}

main().catch(console.error);
