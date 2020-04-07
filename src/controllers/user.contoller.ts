import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import  UserService from '../services/user.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import ValidationPipes from '../pipes/validation.pipe';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UserEntity } from '../entities/user.entity';
import { LoginAuthCredentialSchema } from '../schemas/login-authCredentials.schema';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserSchema } from '../schemas/create-user.schema';

@Controller('user')
export default class UserController {

  constructor(private readonly userService:UserService) {}


  @Post('signUp')
  signUp(@Body(new ValidationPipes(CreateUserSchema))
          createUserDto:CreateUserDto):Promise<string>{
    return this.userService.signUp(createUserDto)
  }


  @Post('login')
  login(@Body(new ValidationPipes(LoginAuthCredentialSchema))
          authCredentialsDto:AuthCredentialsDto):Promise<any>{

    return this.userService.login(authCredentialsDto);
  }



  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('/getAllUser')
  getAllUser(@Query('page') page:number):Promise<UserEntity[]> {
    return this.userService.getAllUsers(page)
  }

  @Get('/searchUser')
  searchUser(@Query() filterUserDto: FilterUserDto) {
    return this.userService.searchUser(filterUserDto);
  }


  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/delete')
  deleteUser(@Query('username') username:string):Promise<any>{
    return this.userService.deleteUser(username)
  }


}