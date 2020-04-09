import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import  UserService from '../services/user.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import ValidationPipes from '../pipes/validation.pipe';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UserEntity } from '../entities/user.entity';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateMealSchema } from '../schemas/update-meal.schema';
import { UpdateMealDto } from '../dto/update-meal.dto';
import { CreateUserSchema, LoginAuthCredentialSchema, UpdateUserSchema } from '../schemas/userValidation.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import AuthenticationGuard from '../guards/authentication.guard';

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

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('/searchUser')
  searchUser(@Query() filterUserDto: FilterUserDto) {
    return this.userService.searchUser(filterUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  getUserById(@Query('id') id:number):Promise<any> {
    return this.userService.getUserById(id)
  }


  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/delete')
  deleteUser(@Query('username') username:string):Promise<any>{
    return this.userService.deleteUser(username)
  }

  @UseGuards(AuthenticationGuard)
  @Put()
  updateUser(@Query('userId') userId: number,
             @Body(new ValidationPipes(UpdateUserSchema)) updateUserDto: UpdateUserDto):Promise<any> {
    return this.userService.updateUser(userId,updateUserDto)
  }


}