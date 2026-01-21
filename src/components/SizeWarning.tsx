import { memo } from 'react';
import { formatSize } from '../utils/storage';
import { WARNING_SIZE_BYTES, MAX_SIZE_BYTES } from '../types';

interface SizeWarningProps {
  size: number;
}

export const SizeWarning = memo<SizeWarningProps>(({ size }) => {
  // Show warning for large files (>300KB)
  if (size <= WARNING_SIZE_BYTES) {
    return null;
  }

  // Show warning for files approaching or exceeding recommended size
  const isWarning = size <= MAX_SIZE_BYTES;
  const isHardLimit = size > MAX_SIZE_BYTES;

  if (!isWarning && !isHardLimit) {
    return null;
  }

  const bgColor = isHardLimit
    ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
    : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700';

  const textColor = isHardLimit
    ? 'text-red-800 dark:text-red-200'
    : 'text-yellow-800 dark:text-yellow-200';

  const iconColor = isHardLimit ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';

  const message = isHardLimit
    ? `JSON exceeds size limit (${formatSize(size)} / ${formatSize(MAX_SIZE_BYTES)}). Rendering disabled.`
    : `Large JSON file (${formatSize(size)}). Rendering may be slow. Consider collapsing nodes.`;

  return (
    <div className={`absolute top-0 left-0 right-0 z-10 border-b px-4 py-2 ${bgColor}`}>
      <div className={`flex items-center justify-center gap-2 ${textColor}`}>
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          {isHardLimit ? (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          )}
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
});

SizeWarning.displayName = 'SizeWarning';
