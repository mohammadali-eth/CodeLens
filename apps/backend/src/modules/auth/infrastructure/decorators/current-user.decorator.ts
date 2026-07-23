import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser Decorator
 * Purpose: Extract authenticated user context.
 * Responsibilities: Extracts request.user payload from JWT execution context.
 * Dependencies: NestJS ExecutionContext.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
