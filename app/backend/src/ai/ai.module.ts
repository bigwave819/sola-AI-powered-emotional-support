import { Module } from '@nestjs/common';
import { GeminiProvider } from './gemini.provider';
import { FakeAiProvider } from './fake.provider';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  providers: [
    {
      provide: 'AiProvider',
      useClass: isTest ? FakeAiProvider : GeminiProvider,
    },
  ],
  exports: ['AiProvider'],
})
export class AiModule {}