import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resourceName: string, identifier?: string) {
    const message = identifier 
      ? `${resourceName} with identifier '${identifier}' was not found.`
      : `${resourceName} was not found.`;
    super(message, HttpStatus.NOT_FOUND);
  }
}
