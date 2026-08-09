export const APP_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  FILE_SIZE_LIMIT_MB: 5,
};

export const REGEX_PATTERNS = {
  PHONE: /^\+?[1-9]\d{1,14}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  YOUTUBE_URL: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
};

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'An unexpected error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  VALIDATION_ERROR: 'Validation failed',
};
