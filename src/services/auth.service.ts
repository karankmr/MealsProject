import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as JWT from 'jsonwebtoken'

@Injectable()
export default class AuthService {
 public async generateJWTToken(user:UserEntity):Promise<string>{
    const payload={
        userp:user
      }
      const token=JWT.sign(payload, 'freecityofbraavos',{expiresIn:'12h'})
     return token
   }

 public async validateToken(token:string):Promise<UserEntity>{
  const decode:any = await JWT.verify(token,'freecityofbraavos');

   const {userp}=decode;
   const {username}=userp;

   const user = await UserEntity.findOne({where:{username}});
    if(user)
       return user
    else
      throw UnauthorizedException

 }
}