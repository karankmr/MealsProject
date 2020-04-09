import { Body, Controller, Delete, Get,  Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { UpdateMealDto } from '../dto/update-meal.dto';
import { RolesGuard } from '../guards/roles.guard';
import { UpdateMealSchema } from '../schemas/update-meal.schema';


@Controller('meal')
@UseGuards(AuthenticationGuard)
export class MealController {

  constructor(private readonly mealService: MealService) {
  }


  @Get('getFilteredMeals')
  getFilteredMeals(
    @Query() filterMealDto: FilterMealDto,
    @GetUser() user): Promise<MealEntity[]> {

    return this.mealService.getFilteredMeals(filterMealDto, user);
  }


  @Get('getAllMeals')
  getAllMeals(@Query('page') page: number
    , @GetUser() currentUser: UserEntity): Promise<MealEntity[]> {
    return this.mealService.getAllMeals(page, currentUser)
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('getMealsByUserId')
  getMealsByUserId(@Query('userId') userId: number,
                   @Query('page') page:number): Promise<any> {
    return this.mealService.getMealsByUserId(userId,page);
  }


  @Roles('admin')
  @Post('createMeal')
  createMeal(
    @Body(new ValidationPipes(CreateMealsSchema))
      meal: CreateMealDto): Promise<MealEntity> {
    return this.mealService.createMeal(meal);
  }


  @Roles('admin')
  @Delete('/deleteMeal')
  deleteMeal(@Query('userId') userId: number
    , @Query('id') id: number): Promise<any> {
    return this.mealService.deleteMeal(userId, id)
  }

  @Put()
  updateMeal(@Query('id') id: number,
             @Query('userId') userId:number,
             @Body(new ValidationPipes(UpdateMealSchema)) updateMealDto: UpdateMealDto):Promise<any> {
    return this.mealService.updateMeal(id,userId,updateMealDto)
  }

  @Put('status')
  updateMealStatus(@Query('id') id: number,
             @Query('userId') userId:number,
             @Body('status') status: string):Promise<any> {

    return this.mealService.updateMealStatus(id,userId,status)
  }

}