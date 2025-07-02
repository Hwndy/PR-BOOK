/**
 * Utility functions to suppress specific React warnings
 * This is useful for third-party libraries that haven't been updated yet
 */

type WarningSuppressionConfig = {
  patterns: string[];
  originalConsoleError?: typeof console.error;
};

const warningSuppressions: Map<string, WarningSuppressionConfig> = new Map();

/**
 * Suppress specific console.error warnings by pattern matching
 * @param suppressionId - Unique identifier for this suppression
 * @param patterns - Array of string patterns to match against error messages
 */
export const suppressWarnings = (suppressionId: string, patterns: string[]) => {
  if (warningSuppressions.has(suppressionId)) {
    return; // Already suppressed
  }

  const originalError = console.error;
  
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      const shouldSuppress = patterns.some(pattern => message.includes(pattern));
      if (shouldSuppress) {
        return; // Suppress this warning
      }
    }
    originalError.apply(console, args);
  };

  warningSuppressions.set(suppressionId, {
    patterns,
    originalConsoleError: originalError
  });
};

/**
 * Restore console.error for a specific suppression
 * @param suppressionId - The suppression to restore
 */
export const restoreWarnings = (suppressionId: string) => {
  const suppression = warningSuppressions.get(suppressionId);
  if (suppression && suppression.originalConsoleError) {
    console.error = suppression.originalConsoleError;
    warningSuppressions.delete(suppressionId);
  }
};

/**
 * Restore all warning suppressions
 */
export const restoreAllWarnings = () => {
  // Find the original console.error from the first suppression
  const firstSuppression = Array.from(warningSuppressions.values())[0];
  if (firstSuppression?.originalConsoleError) {
    console.error = firstSuppression.originalConsoleError;
  }
  warningSuppressions.clear();
};

/**
 * Hook to suppress ReactQuill findDOMNode warnings
 */
export const suppressReactQuillWarnings = () => {
  suppressWarnings('react-quill', [
    'findDOMNode is deprecated',
    'Warning: findDOMNode'
  ]);
};

/**
 * Hook to restore ReactQuill warning suppression
 */
export const restoreReactQuillWarnings = () => {
  restoreWarnings('react-quill');
};
