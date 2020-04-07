import { Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import AuthService from './auth.service';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import {Like} from "typeorm";

@Controller()
export default class UserService {

  constructor(
    private readonly authService: AuthService) {
  }

  async signUp(createUserDto: CreateUserDto): Promise<string> {

    const { name, userName, password } = createUserDto

    const user = new UserEntity()
    user.username = userName;
    user.name = name;
    user.salt= await bcrypt.genSalt();
    user.password=  await bcrypt.hash(password,user.salt);
    user.iAm='user';
    await user.save();
    return `Hey ${name}! You can login now`
  }


  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { userName, password } = authCredentialsDto

    const user = await UserEntity.findOne({ where: { username: userName } })

    if (user && await user.validatePassword(password)) {
      const token= await this.authService.generateJWTToken(user);
      const info={token,"iAm":user.iAm,loggedIn:true}
      return info
    } else
      throw new UnauthorizedException('Invalid Credentials')
  }


  async searchUser(filterUserDto: FilterUserDto) {
    const { search } = filterUserDto

    const users = await UserEntity.find({where:[
        {name: Like(`%${search}%`)},
        {username:Like(`%${search}%`)}]
    });
    if(users.length>0)
    {return users;}
    else
      throw new NotFoundException('User does not exist')

  }

  async getAllUsers(page=1):Promise<UserEntity[]>{
    const Users=await UserEntity.find({select:['id', 'name', 'username','iAm'],where: { iAm:'user'},
      take:5,
      skip:5*(page-1)},
    )
    return Users
  }


  async deleteUser(username: string): Promise<any> {
    const result=await UserEntity.findOne({where:{username}})
    const page=1;
    if(result) {
      await UserEntity.remove(result)
      const users = await UserEntity.find({select:['id', 'name', 'username','iAm'],
        take:5,
        skip:5*(page-1),}
      )
      return  {users,deleted:true}
    }
    else
      throw new NotFoundException("User not found")
  }
}

