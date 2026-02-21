import {
  generateUUID,
  weiToEther,
  etherToWei,
  formatAddress,
  formatTokenAmount,
} from '../../src/utils/helpers';

describe('Helpers', () => {
  describe('generateUUID', () => {
    it('should generate valid UUID', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('weiToEther', () => {
    it('should convert wei to ether correctly', () => {
      expect(weiToEther('1000000000000000000')).toBe('1');
    });

    it('should handle zero', () => {
      expect(weiToEther('0')).toBe('0');
    });
  });

  describe('etherToWei', () => {
    it('should convert ether to wei correctly', () => {
      expect(etherToWei('1')).toBe('1000000000000000000');
    });
  });

  describe('formatAddress', () => {
    it('should truncate long address', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0eB1';
      const formatted = formatAddress(address, 4);
      expect(formatted).toBe('0x742...eB1');
    });

    it('should not truncate short address', () => {
      const address = '0x742d';
      expect(formatAddress(address)).toBe('0x742d');
    });
  });

  describe('formatTokenAmount', () => {
    it('should format with default decimals', () => {
      expect(formatTokenAmount('1000000000000000000')).toBe('1.000000000000000000');
    });

    it('should format with custom decimals', () => {
      expect(formatTokenAmount('1000', 2)).toBe('10.00');
    });
  });
});
