/**
 * Form utilities to prevent common form issues like accidental submission and data loss
 */

// Prevent form submission on Enter key in input fields
export const preventFormSubmission = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();
  }
};

// Prevent default form submission behavior
export const preventDefaultSubmission = (event: React.FormEvent) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// Safe button click handler that prevents form submission
export const createSafeClickHandler = (handler: () => void) => {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  };
};

// Create a safe form submission handler
export const createSafeSubmitHandler = (handler: () => void | Promise<void>) => {
  return async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await handler();
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };
};

// Debounce function for auto-save functionality
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if form has unsaved changes
export const hasUnsavedChanges = (
  currentData: Record<string, any>,
  originalData: Record<string, any>
): boolean => {
  return JSON.stringify(currentData) !== JSON.stringify(originalData);
};

// Generate URL-friendly slug from text
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validate required fields
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return !value || (typeof value === 'string' && !value.trim());
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`
    };
  }

  return { isValid: true };
};

// Create a safe async handler that catches errors
export const createSafeAsyncHandler = <T extends any[]>(
  handler: (...args: T) => Promise<void>,
  errorHandler?: (error: Error) => void
) => {
  return async (...args: T) => {
    try {
      await handler(...args);
    } catch (error) {
      console.error('Async handler error:', error);
      if (errorHandler) {
        errorHandler(error instanceof Error ? error : new Error('Unknown error'));
      } else {
        // Default error handling
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        alert(`Error: ${message}`);
      }
    }
  };
};

// Setup beforeunload protection for unsaved changes
export const setupBeforeUnloadProtection = (
  hasChanges: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges) {
      e.preventDefault();
      e.returnValue = message;
      return message;
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Create a confirmation dialog for destructive actions
export const confirmAction = (
  message: string,
  title: string = 'Confirm Action'
): boolean => {
  return window.confirm(`${title}\n\n${message}`);
};

// Safe JSON parse with fallback
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Create a timeout promise for async operations
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
};
