import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class MealEntity extends BaseEntity{

   @Column({name: 'userId', nullable: false})
   public userId: number;

  @PrimaryGeneratedColumn({name:'id'})
  id: number;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'time' })
  time: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'calorie' })
  calorie: number;

  @Column({name:'status'})
  status:string

  @ManyToOne(type => UserEntity,user=>user.meals,{eager:false,onDelete:'CASCADE'})
  @JoinColumn({name:'userId'})
  user:UserEntity

}