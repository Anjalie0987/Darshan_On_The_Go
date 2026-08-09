import { RESPONSE_MESSAGES } from '../common/constants/app.constants';

export const SwaggerExamples = {
  ValidationError: {
    value: {
      success: false,
      timestamp: '2026-07-18T10:00:00.000Z',
      requestId: 'uuid-1234',
      error: {
        code: 400,
        message: 'Validation failed',
        details: ['email must be an email', 'password is too short'],
      },
    },
    description: 'When payload validation fails.',
  },
  Unauthorized: {
    value: {
      success: false,
      timestamp: '2026-07-18T10:00:00.000Z',
      requestId: 'uuid-1234',
      error: {
        code: 401,
        message: RESPONSE_MESSAGES.UNAUTHORIZED,
      },
    },
    description: 'When authentication token is missing or invalid.',
  },
  Forbidden: {
    value: {
      success: false,
      timestamp: '2026-07-18T10:00:00.000Z',
      requestId: 'uuid-1234',
      error: {
        code: 403,
        message: RESPONSE_MESSAGES.FORBIDDEN,
      },
    },
    description: 'When user lacks required role/permission.',
  },
  NotFound: {
    value: {
      success: false,
      timestamp: '2026-07-18T10:00:00.000Z',
      requestId: 'uuid-1234',
      error: {
        code: 404,
        message: RESPONSE_MESSAGES.NOT_FOUND,
      },
    },
    description: 'When requested resource does not exist.',
  },
  Conflict: {
    value: {
      success: false,
      timestamp: '2026-07-18T10:00:00.000Z',
      requestId: 'uuid-1234',
      error: {
        code: 409,
        message: 'Resource already exists.',
      },
    },
    description: 'When a database constraint (like unique email) is violated.',
  },
};
