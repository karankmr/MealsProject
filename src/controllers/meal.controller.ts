import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MealService } from '../services/meals.service';
import { CreateMealsSchema } from '../schemas/create-meal.schema';
import ValidationPipes  from '../pipes/validation.pipe';
import { MealEntity } from '../entities/meal.entity';
import { CreateMealDto } from '../dto/create-meal.dto';
import { FilterMealDto } from '../dto/filter-meal.dto';
import { UserEntity } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import AuthenticationGuard from '../guards/authentication.guard';


@Controller('meal')
@UseGuards(AuthenticationGuard)
export class MealController {
  constructor(private readonly mealService: MealService) {}


  @Get('getFilteredMeals')
  getFilteredMeals(
    @Query() filterMealDto:FilterMealDto,
    @GetUser() user):Promise<MealEntity[]>{

    return this.mealService.getFilteredMeals(filterMealDto,user);
  }


  @Get('getAllMeals')
  getAllMeals(@Query('page') page:number
  ,@GetUser() currentUser:UserEntity):Promise<MealEntity[]>{
    return this.mealService.getAllMeals(page,currentUser)
  }


  @Get('getMealsByUserId')
  getMealsByUserId(@Query('userId') userId:number):Promise<MealEntity[]>{
    return this.mealService.getMealsByUserId(userId);
  }


  @Roles('admin')
  @Post('createMeal')
  createMeal(
    @Body(new ValidationPipes(CreateMealsSchema))
      meal:CreateMealDto):Promise<MealEntity>{
    return this.mealService.createMeal(meal);
  }


  @Roles('admin')
  @Delete('/deleteMeal')
  deleteMeal(@Query('id') id:number
              ,@Query('title') title:string):Promise<any>{
    return this.mealService.deleteMeal(id,title)
  }

}