import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessRuleException extends HttpException {
  constructor(message: string, code: number = HttpStatus.UNPROCESSABLE_ENTITY) {
    super(message, code);
  }
}
