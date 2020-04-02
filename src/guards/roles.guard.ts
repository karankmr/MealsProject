import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import AuthService from '../services/auth.service';


@Injectable()
export class RolesGuard {
  constructor(private reflector:Reflector,
              private authService:AuthService) {
  }
  public async canActivate(context:ExecutionContext):Promise<boolean>{
    const roles =this.reflector.getAllAndOverride<string[]>('roles',
                                                        [context.getHandler(),
                                                                 context.getClass()])
    if(!roles){
      return true
    }
    const request=context.switchToHttp().getRequest();
    const token = request.headers.jwttoken;

    const user = await this.authService.validateToken(token)

    if(user.iAm===roles[0])
    {request.user=user
      return true
  }
  return false
  }

}