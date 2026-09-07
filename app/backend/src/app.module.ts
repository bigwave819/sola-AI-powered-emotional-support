import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HomeModule } from './home/home.module';
import { MoodModule } from './mood/mood.module';
import { ExercisesModule } from './exercises/exercises.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [AuthModule, UsersModule, HomeModule, MoodModule, ExercisesModule, InsightsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
