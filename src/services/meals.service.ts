import { Injectable, NotFoundException } from '@nestjs/common';


import { MealRepository } from '../repositories/meal.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MealEntity } from '../entities/meal.entity';
import { CreateMealDto } from '../dto/create-meal.dto';
import { FilterMealDto } from '../dto/filter-meal.dto';
import { UserEntity } from '../entities/user.entity';
import { Between } from 'typeorm';



@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealRepository)
    private mealRepository:MealRepository) {
  }


  async getFilteredMeals(  filterMealDto:FilterMealDto,user:UserEntity):Promise<MealEntity[]>{   //filtered meals
    const {search,fromDate,toDate,fromTime,toTime}=filterMealDto;
    const query=MealEntity.createQueryBuilder('meal')
    // query.where('meal.userId = :userId',{userId:user.id})
    if(fromDate&&toDate){
      const meals=MealEntity.find({
        date: Between(fromDate,toDate )
      });
      if(meals)
      return meals
      else
        throw NotFoundException
    }

    if(fromTime&&toTime){
      const meals=MealEntity.find({
        time: Between(fromTime,toTime )
      });
      if(meals)
        return meals
      else
        throw NotFoundException
    }

    if(search){

         query.andWhere(('meal.title LIKE:search' +
        ' OR meal.date LIKE:search ' +
        'OR meal.time LIKE :search' +
        ' OR meal.calorie LIKE :search'),{search:`%${search}%`})

    }
    return await query.getMany();
  }



  async getAllMeals(page:number,currentUser:UserEntity):Promise<MealEntity[]>{     //pagination
    if(currentUser.iAm==='admin')
    {
      const meals=await MealEntity.find({select:['id', 'date', 'time', 'title', 'calorie','userId'],
      take:5,
      skip:5*(page-1)})
      console.log("inGetAllMealsService",meals)
    return meals
    }

    if(currentUser.iAm==='user')
    {
      const meals=await MealEntity.find({select:['id', 'date', 'time', 'title', 'calorie','userId'],
        take:5,
        skip:5*(page-1),where:{userId:currentUser.id}})
      if(meals.length>0)
      return meals
      else throw new NotFoundException("No meals available")
    }
    }




  async getMealsByUserId(userId:number):Promise<MealEntity[]>{
    const user =await UserEntity.findOne({relations:['meals'],
      where:{id:userId}})
    if(user)
      return user.meals
    else
      throw new NotFoundException('Meal with id not found')
  }



  async createMeal(meal:CreateMealDto):Promise<MealEntity>{
    const Meal=new MealEntity();
    const {date,time,title,calorie,userId} = meal
    Meal.date=date;
    Meal.calorie=calorie;
    Meal.time=time;
    Meal.title=title;
    Meal.userId=userId;
    await Meal.save();
    return Meal;
  }


  async deleteMeal(id:number,title:string):Promise<any> {
    const result = await MealEntity.findOne({ userId:id ,title})
    const page=1
    if (result) {
      await MealEntity.remove(result)
      const meals = await MealEntity.find({
        select: ['id', 'date', 'time', 'title', 'calorie', 'userId'],
        take: 5,
        skip: 5 * (page - 1), where: { userId: id }
      })
      return {meals,deleted:true}
    } else
      throw new NotFoundException("User not found")
  }
  // async deleteMeal(id:number,user:UserEntity):Promise<string>{
  //   const result=await MealEntity.findOne({id,userId:user.id})
  //   if(result) {
  //     await MealEntity.remove(result)
  //     return "Deleted"
  //   }
  //   else
  //     throw new NotFoundException("User not found")
  // }


}