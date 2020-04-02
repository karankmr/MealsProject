import EUserIAm from '../enums/user-role.enum';

export class CreateUserDto{
name: string;
username: string;
password: string;
iAm:EUserIAm
}