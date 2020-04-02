import EUserIAm from '../enums/user-role.enum';

export class AuthCredentialsDto{
  name:string;
  userName: string;
  password: string;
  iAm:EUserIAm
}