export class DatabaseException extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = 'DatabaseException';
  }
}

export class UniqueConstraintViolationException extends DatabaseException {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'UniqueConstraintViolationException';
  }
}

export class ForeignKeyViolationException extends DatabaseException {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'ForeignKeyViolationException';
  }
}

export class DatabaseConnectionException extends DatabaseException {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'DatabaseConnectionException';
  }
}
