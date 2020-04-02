import EUserIAm from '../enums/user-role.enum';

export interface UserInterface {
  id:number
  name:string
  username:string
  password:string
  iAm: EUserIAm
}