import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HomeModule } from './home/home.module';
import { MoodModule } from './mood/mood.module';
import { ExercisesModule } from './exercises/exercises.module';
import { InsightsModule } from './insights/insights.module';
import { AiModule } from './ai/ai.module';
import { JournalModule } from './journal/journal.module';
import { SafetyModule } from './safety/safety.module';
import { PrivacyModule } from './privacy/privacy.module';

@Module({
  imports: [AuthModule, UsersModule, HomeModule, MoodModule, ExercisesModule, InsightsModule, AiModule, JournalModule, SafetyModule, PrivacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
