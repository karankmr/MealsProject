import { Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import AuthService from './auth.service';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';



@Controller()
export default class UserService {

  constructor(
    private readonly authService: AuthService) {
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {

    const { name, userName, password ,iAm} = authCredentialsDto

    const user = new UserEntity()
    user.username = userName;
    user.name = name;
    user.salt= await bcrypt.genSalt();
    user.password=  await bcrypt.hash(password,user.salt);
    user.iAm=iAm
    await user.save();
    return this.authService.generateJWTToken(user)
    // return `Hey ${name} You can login now`
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
    const {search}=filterUserDto

    const query = UserEntity.createQueryBuilder('user')
    if(search){
      query.andWhere(('user.name LIKE:search' +
        ' OR user.username LIKE:search ' ),{search:`%${search}%`})
    }
    return query.getMany()
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
      const deleted =true;
      const users = await UserEntity.find({select:['id', 'name', 'username','iAm'],
        take:5,
        skip:5*(page-1),}
      )
      console.log(users)
      const info= {users,deleted}
      return info
    }
    else
      throw new NotFoundException("User not found")
  }
}

