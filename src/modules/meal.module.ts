import { Global, Module } from '@nestjs/common';
import { MealService} from '../services/meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealController } from '../controllers/meal.controller';
import { MealRepository } from '../repositories/meal.repository';
import { MealEntity } from '../entities/meal.entity';
import AuthService from '../services/auth.service';

@Global()
@Module({
  imports:[TypeOrmModule.forFeature([MealRepository,MealEntity],)],
  controllers:[MealController],
  providers:[ MealService,AuthService],
})
export class MealModule{}
