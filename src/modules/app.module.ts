import { Global, Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MealModule } from './meal.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { MealEntity } from '../entities/meal.entity';
import { UserEntity } from '../entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [MealEntity,UserEntity],
      synchronize: true,
    }),
    MealModule,UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
