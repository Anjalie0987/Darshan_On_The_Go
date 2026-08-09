import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SwaggerExamples } from './swagger.examples';

export function ApiValidation() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation failed',
      content: {
        'application/json': {
          example: SwaggerExamples.ValidationError.value,
        },
      },
    }),
  );
}

export function ApiUnauthorized() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      content: {
        'application/json': {
          example: SwaggerExamples.Unauthorized.value,
        },
      },
    }),
  );
}

export function ApiForbidden() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Forbidden access',
      content: {
        'application/json': {
          example: SwaggerExamples.Forbidden.value,
        },
      },
    }),
  );
}

export function ApiNotFound() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'Resource not found',
      content: {
        'application/json': {
          example: SwaggerExamples.NotFound.value,
        },
      },
    }),
  );
}

export function ApiConflict() {
  return applyDecorators(
    ApiConflictResponse({
      description: 'Resource conflict',
      content: {
        'application/json': {
          example: SwaggerExamples.Conflict.value,
        },
      },
    }),
  );
}

export function ApiGlobalResponse<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              timestamp: { type: 'string', format: 'date-time' },
              requestId: { type: 'string', format: 'uuid' },
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiPaginatedResponse<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              timestamp: { type: 'string', format: 'date-time' },
              requestId: { type: 'string', format: 'uuid' },
              data: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      itemCount: { type: 'number', example: 10 },
                      totalItems: { type: 'number', example: 100 },
                      itemsPerPage: { type: 'number', example: 10 },
                      totalPages: { type: 'number', example: 10 },
                      currentPage: { type: 'number', example: 1 },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}
