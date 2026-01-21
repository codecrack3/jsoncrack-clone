import { MAX_SIZE_BYTES, WARNING_SIZE_BYTES } from '../types';

/**
 * Check if JSON size exceeds hard limit
 */
export function checkSizeLimit(jsonString: string): boolean {
  const sizeBytes = new Blob([jsonString]).size;
  return sizeBytes <= MAX_SIZE_BYTES;
}

/**
 * Check if JSON size exceeds warning threshold
 */
export function shouldShowWarning(jsonString: string): boolean {
  const sizeBytes = new Blob([jsonString]).size;
  return sizeBytes > WARNING_SIZE_BYTES;
}

/**
 * Get size category for performance tuning
 */
export function getSizeCategory(jsonString: string): 'small' | 'medium' | 'large' | 'very-large' {
  const sizeBytes = new Blob([jsonString]).size;
  const kb = sizeBytes / 1024;

  if (kb < 100) return 'small';
  if (kb < 500) return 'medium';
  if (kb < 2000) return 'large';
  return 'very-large';
}

/**
 * Get human-readable size string
 */
export function formatSize(bytes: number): string {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)}KB`;
}
