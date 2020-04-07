import EMealStatus from '../enums/mealStatus.enum';

export class UpdateMealDto {
  date: string;
  time: string;
  title: string;
  calorie: number;
  status:EMealStatus
}