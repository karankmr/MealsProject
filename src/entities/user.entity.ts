import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { MealEntity } from './meal.entity';
@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({name:'id'})
  id: number;

  @Column()
  name: string;

  @Column({})
  username: string;

  @Column({})
  age:number

  @Column()
  password: string;

  @Column({name: 'i_am'})
  public iAm: string;

  @Column({name:'maxCalorie'})
  maxCalorie: number;

  @Column()
  salt: string

  @OneToMany(type => MealEntity,meal=>meal.user,{eager:true})
  meals:MealEntity[]

  async validatePassword(password: string):Promise<boolean>{
    const hash=await bcrypt.hash(password,this.salt)
    return hash===this.password
  }
}
