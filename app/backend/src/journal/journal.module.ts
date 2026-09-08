import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { AiModule } from '../ai/ai.module';
import { SafetyModule } from '../safety/safety.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [AiModule, SafetyModule, SubscriptionsModule],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}