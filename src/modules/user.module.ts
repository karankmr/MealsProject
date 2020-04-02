import { Global, Module } from '@nestjs/common';
import UserController from '../controllers/user.contoller';
import UserService from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthService from '../services/auth.service';
import { UserEntity } from '../entities/user.entity';


@Global()
@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers:[UserController],
  providers:[UserService,AuthService]

})
export class UserModule {

}
