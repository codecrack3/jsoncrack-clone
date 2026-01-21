import { MAX_SIZE_BYTES } from '../types';

/**
 * Check if JSON size exceeds limit
 */
export function checkSizeLimit(jsonString: string): boolean {
  const sizeBytes = new Blob([jsonString]).size;
  return sizeBytes <= MAX_SIZE_BYTES;
}

/**
 * Get human-readable size string
 */
export function formatSize(bytes: number): string {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)}KB`;
}
