import { Injectable, NotFoundException } from '@nestjs/common';
import { MealRepository } from '../repositories/meal.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MealEntity } from '../entities/meal.entity';
import { CreateMealDto } from '../dto/create-meal.dto';
import { FilterMealDto } from '../dto/filter-meal.dto';
import { UserEntity } from '../entities/user.entity';
import { Between, Like } from 'typeorm';
import { UpdateMealDto } from '../dto/update-meal.dto';
import ReturnVal from '../lib/returnVal';
import * as moment from 'moment';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealRepository)
    private mealRepository:MealRepository) {
  }


  async getFilteredMeals(  filterMealDto:FilterMealDto,user:UserEntity):Promise<any> {   //filtered meals
    const { search, fromDate, toDate, fromTime, toTime } = filterMealDto;
    const query = MealEntity.createQueryBuilder('meal')


    if (fromDate && toDate) {
      if (!moment(fromDate, 'DD/MM/YYYY').isValid()) {
        return ReturnVal.error('fromDate is not valid', "", 400);
      }
      if (!moment(toDate, 'DD/MM/YYYY').isValid()) {
        return ReturnVal.error('toDate is not valid', "", 400);
      }
      const FromDate = moment(fromDate, 'DD/MM/YYYY').format('DD/MM/YYYY')
      const ToDate = moment(toDate, 'DD/MM/YYYY').format('DD/MM/YYYY')

      const meals = MealEntity.find({
        date: Between(FromDate, ToDate)
      });
      if (meals)
        return meals
      else
        throw NotFoundException
    }

    if (fromTime && toTime) {
      if (!moment(fromTime, 'hh:mm').isValid()) {
        return ReturnVal.error('fromTime is not valid', "", 400);
      }
      if (!moment(toTime, 'hh:mm').isValid()) {
        return ReturnVal.error('toTime is not valid', "", 400);
      }
      const FromTime = moment(fromTime, 'hh:mm').format('HH:mm')
      const ToTime = moment(toTime, 'hh:mm').format('HH:mm')
      const meals = MealEntity.find({
        time: Between(FromTime, ToTime)
      });
      if (meals)
        return meals
      else
        throw new NotFoundException('no meals available')
    }

    if (search) {
      const meals = await MealEntity.find({where:[
          {title: Like(`%${search}%`)},
          {date: Like(`%${search}%`)},
          {time: Like(`%${search}%`)},
          {calorie:Like(`%${search}`)}]
      });
      if(meals.length>0)
      {return meals}
      else
        throw new NotFoundException('meal does not exist')
    }

  }

  async getAllMeals(page:number,currentUser:UserEntity):Promise<MealEntity[]>{     //pagination
    if(currentUser.iAm==='admin')
    {
      const meals=await MealEntity.find({select:['id', 'date', 'time', 'title', 'calorie','userId','status'],
        take:5,
        skip:5*(page-1)})
      return meals
    }

    if(currentUser.iAm==='user')
    {
      const meals=await MealEntity.find({select:['id', 'date', 'time', 'title', 'calorie','userId','status'],
        take:5,
        skip:5*(page-1),where:{userId:currentUser.id}})
      if(meals.length>0)
        return meals
      else throw new NotFoundException("No meals available")
    }
  }


  async getMealsByUserId(userId:number):Promise<MealEntity[]>{
    const user =await UserEntity.find({relations:['meals'],where:{id:userId}})
    if(user)
      return user[0].meals
    else
      throw new NotFoundException('Meal with id not found')
  }



  async createMeal(meal:CreateMealDto):Promise<any>{
    const Meal=new MealEntity();
    const {date,time,title,calorie,userId} = meal
    if (!moment(date, 'DD/MM/YYYY').isValid()) {
      return ReturnVal.error('date is not valid',"",400);
    }
    else {
      Meal.date = date;
    }

    if (!moment(time, 'hh:mm').isValid()) {
      return ReturnVal.error('time is not valid',"",400);
    }
    else{
      Meal.time=time
    }

    Meal.calorie=calorie;
    Meal.title=title;
    Meal.userId=userId;
    Meal.status='notConsumed';
    await Meal.save();
    return Meal;
  }


  async updateMeal(id:number,userId:number,updateMealDTO:UpdateMealDto):Promise<any>{
    const {date,time, title, calorie,status}=updateMealDTO
    const meal=await MealEntity.findOne({id,userId});
    if(meal)
    {if(status)
    {meal.status=status
      await meal.save();
      return {meal,updated:true}}

    if(date)
    {
      meal.date=date
      await meal.save()
      return {meal,updated:true}
    }

    if(time)
    {
      meal.time=time
      await meal.save()
      return {meal,updated:true}
    }
    if(calorie)
    {
      meal.calorie=calorie
      await meal.save()
      return {meal,updated:true}
    }

    if(title)
    {
      meal.title=title
      await meal.save()
      return {meal,updated:true}
    }}
    else throw new NotFoundException("meal not found")
  }

  async updateMealStatus(id:number,userId:number,status:string):Promise<any>{
    const meal=await MealEntity.findOne({id,userId});
    {
      if (meal) {
        if (status) {
          meal.status = status
          await meal.save();
          const page = 1
          const meals = await MealEntity.find({
            select: ['id', 'date', 'time', 'title', 'calorie', 'userId', 'status'],
            take: 5,
            skip: 5 * (page - 1)
          })
          console.log(meals)
          return { meals, updated: true }
        }} else
          throw new NotFoundException('meal not found')
      }
    }

  async deleteMeal(userId:number,title:string):Promise<any> {
    if(userId&&title)
    {const result = await MealEntity.findOne({ userId,title})
    const page=1
    if (result) {
      await MealEntity.remove(result)
      const meals = await MealEntity.find({
        select: ['id', 'date', 'time', 'title', 'calorie', 'userId','status'],
        take: 5,
        skip: 5 * (page - 1), where: { userId }
      })
      return {meals,deleted:true}
    } else
      throw new NotFoundException("User not found")}
    else
      return ReturnVal.error('Invalid Input')
  }

}