/**
 * SDK Error Types
 */

export class SDKError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

export class ValidationError extends SDKError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NetworkError extends SDKError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
  }
}

export class WalletError extends SDKError {
  constructor(message: string) {
    super(message, 'WALLET_ERROR');
    this.name = 'WalletError';
  }
}

export class BlockchainError extends SDKError {
  constructor(message: string) {
    super(message, 'BLOCKCHAIN_ERROR');
    this.name = 'BlockchainError';
  }
}

export class AuthenticationError extends SDKError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends SDKError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}
