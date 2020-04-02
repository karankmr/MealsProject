// import {createParamDecorator} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
//
// export const GetUser = createParamDecorator((data, req): UserEntity=> {
// console.log(req.headers);
//
//   return req.user
//
//
//
// });
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);