import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AuthService from '../services/auth.service';


@Injectable()
export default class AuthenticationGuard implements CanActivate{
  constructor(private readonly authService:AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.jwttoken;

    const user = await this.authService.validateToken(token)
    if (user) {
      request.user=user;
      return true
    }
    return false

  }

}