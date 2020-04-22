import { Controller, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import AuthService from './auth.service';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import {Like} from "typeorm";
import { UpdateUserDto } from '../dto/update-user.dto';
import returnVal from '../lib/returnVal';

@Controller()
export default class UserService {

  constructor(
    private readonly authService: AuthService) {
  }

  async signUp(createUserDto: CreateUserDto): Promise<string> {

    const { name, userName, password,age} = createUserDto;

    const nFound= await UserEntity.findOne({where:{username: userName}});
    if(nFound){
      throw new HttpException('User already exist',409)
    }

    const user = new UserEntity()
    user.username = userName;
    user.name = name;
    user.age=age;
    user.maxCalorie=0;
    user.salt= await bcrypt.genSalt();
    user.password=  await bcrypt.hash(password,user.salt);
    user.iAm='user';
    await user.save();
    return `Hey ${name}! You can login now`
  }


  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { userName, password } = authCredentialsDto

    const user = await UserEntity.findOne({ where: { username: userName } });

    if (user && await user.validatePassword(password)) {
      delete user.meals
      const token= await this.authService.generateJWTToken(user);
      if(user.iAm==='admin')
      return {token,"iAm":user.iAm,loggedIn:true};
      else
        return {token,"iAm":user.iAm,loggedIn:true,userId:user.id}

    } else
      throw new HttpException('User Invalid', 401);

  }


  async searchUser(filterUserDto: FilterUserDto) {
    const { search } = filterUserDto

    const users = await UserEntity.find({where:[
        {name: Like(`%${search}%`)},
        {username:Like(`%${search}%`)},
      ]
    });
    if(users.length>0)
    {return users;}
    else
      throw new HttpException('No such User', 404)

  }

  async getAllUsers(page=1):Promise<any>{
    const users=await UserEntity.find({select:['id', 'name', 'username','iAm','maxCalorie'],where: { iAm:'user'},
      take:5,
      skip:5*(page-1)},
    )
    if(users.length>0)
    return {users}

    else throw new HttpException('No users found', 401)
  }


  async getUserById(id:number):Promise<any>{
    const user=await UserEntity.findOne({select:['id', 'name', 'username','iAm','maxCalorie','age'],where: { id}})
    if(user)
      return {user};
    else
    throw new NotFoundException('user not found')
}



  async deleteUser(username: string): Promise<any> {
    const result=await UserEntity.findOne({where:{username}})
    const page=1;
    if(result) {
      await UserEntity.remove(result)
      const users = await this.getAllUsers()
      console.log(users)
      return  {...users,deleted:true}
    }
    else
      throw new NotFoundException("User not found")
  }


  async updateUser(userId,updateUserDTO:UpdateUserDto):Promise<any>{
    const {name,age,userName,password,maxCalorie}=updateUserDTO;

    const user=await UserEntity.findOne({where:{id:userId}})
    if(user){
      if(name){
        user.name=name
        await user.save()
        return {updated:true}
    }

    if(age){
      user.age=age
      await user.save()
      return {updated:true}
    }

    if(userName){
      user.username=userName
      await user.save()
      return {updated:true}
    }
      if(maxCalorie){
        console.log("inUserService")
        user.maxCalorie=maxCalorie
        await user.save()
        return {updated:true,maxCalorie:user.maxCalorie}
      }
    if(password){
      user.salt= await bcrypt.genSalt();
      user.password=  await bcrypt.hash(password,user.salt);
      await user.save()
      return {updated:true}
    }

  }
  else throw new NotFoundException('user not found')
  }
}

