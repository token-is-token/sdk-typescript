import { validateRequired, validateLength, validateUrl, validateEthAddress } from '../../src/utils/validators';
import { ValidationError } from '../../src/utils/errors';

describe('Validators', () => {
  describe('validateRequired', () => {
    it('should throw ValidationError for undefined', () => {
      expect(() => validateRequired(undefined, 'test')).toThrow(ValidationError);
    });

    it('should throw ValidationError for null', () => {
      expect(() => validateRequired(null, 'test')).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty string', () => {
      expect(() => validateRequired('', 'test')).toThrow(ValidationError);
    });

    it('should not throw for valid value', () => {
      expect(() => validateRequired('value', 'test')).not.toThrow();
    });
  });

  describe('validateLength', () => {
    it('should throw if below min length', () => {
      expect(() => validateLength('ab', 'test', 3)).toThrow(ValidationError);
    });

    it('should throw if above max length', () => {
      expect(() => validateLength('abcdef', 'test', 0, 3)).toThrow(ValidationError);
    });

    it('should not throw for valid length', () => {
      expect(() => validateLength('abc', 'test', 1, 5)).not.toThrow();
    });
  });

  describe('validateUrl', () => {
    it('should throw for invalid URL', () => {
      expect(() => validateUrl('not-a-url', 'test')).toThrow(ValidationError);
    });

    it('should not throw for valid URL', () => {
      expect(() => validateUrl('https://example.com', 'test')).not.toThrow();
    });
  });

  describe('validateEthAddress', () => {
    it('should throw for invalid address', () => {
      expect(() => validateEthAddress('invalid')).toThrow(ValidationError);
    });

    it('should not throw for valid address', () => {
      expect(() => validateEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0eB1')).not.toThrow();
    });
  });
});
