/**
 * Validation utilities
 */

import { ValidationError } from './errors';

/**
 * Validate that a string is not empty
 */
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (min !== undefined && value.length < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min} characters`
    );
  }
  if (max !== undefined && value.length > max) {
    throw new ValidationError(
      `${fieldName} must be at most ${max} characters`
    );
  }
}

/**
 * Validate that a value is a valid URL
 */
export function validateUrl(value: string, fieldName: string): void {
  try {
    new URL(value);
  } catch {
    throw new ValidationError(`${fieldName} must be a valid URL`);
  }
}

/**
 * Validate Ethereum address format
 */
export function validateEthAddress(address: string): void {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new ValidationError('Invalid Ethereum address format');
  }
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): void {
  validateRequired(apiKey, 'API key');
  validateLength(apiKey, 'API key', 32, 128);
}
