import { Between, EntityRepository, Repository } from 'typeorm';
import { MealEntity } from '../entities/meal.entity';
import { CreateMealDto } from '../dto/create-meal.dto';
import { FilterMealDto } from '../dto/filter-meal.dto';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { take } from 'rxjs/operators';

@EntityRepository(MealEntity)
export class MealRepository extends Repository<MealEntity>{
  // async createMeal(meal:CreateMealDto):Promise<MealEntity>{
  //   const Meal=new MealEntity();
  //   const {Date,time,title,calorie,userId} = meal
  //   Meal.date=Date;
  //   Meal.calorie=calorie;
  //   Meal.time=time;
  //   Meal.title=title;
  //   Meal.userId=userId;
  //   await Meal.save();
  //   return Meal;
  // }

  // async getFilteredMeals(filterMealDto:FilterMealDto,user:UserEntity):Promise<MealEntity[]>{
  //   const {search,fromDate,toDate,fromTime,toTime}=filterMealDto;
  //
  //   const query=this.createQueryBuilder('meal')
  //   // query.where('meal.userId = :userId',{userId:user.id})
  //
  //   if(fromDate&&toDate){
  //     const meals=MealEntity.find({
  //       date: Between(fromDate,toDate )
  //     });
  //     if(meals)
  //       return meals
  //     else
  //       throw NotFoundException
  //   }
  //
  //   if(fromTime&&toTime){
  //     const meals=MealEntity.find({
  //       time: Between(fromTime,toTime )
  //     });
  //     if(meals)
  //       return meals
  //     else
  //       throw NotFoundException
  //   }
  //
  //   if(search){
  //     query.andWhere(('meal.title LIKE:search' +
  //       ' OR meal.date LIKE:search ' +
  //       'OR meal.time LIKE :search' +
  //       ' OR meal.calorie LIKE :search'),{search:`%${search}%`})
  //
  //   }
  //   return await query.getMany();
  //}






}