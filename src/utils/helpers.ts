/**
 * Helper utilities
 */

/**
 * Generate a random UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Format address (truncate middle)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Convertwei to ether
 */
export function weiToEther(wei: string | number): string {
  const weiBigInt = BigInt(wei);
  const etherBigInt = weiBigInt / BigInt(1e18);
  return etherBigInt.toString();
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string | number): string {
  const etherNum = typeof ether === 'string' ? parseFloat(ether) : ether;
  const weiBigInt = BigInt(Math.floor(etherNum * 1e18));
  return weiBigInt.toString();
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = 18
): string {
  const amountBigInt = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = amountBigInt / divisor;
  const fractionalPart = amountBigInt % divisor;
  return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0')}`;
}
