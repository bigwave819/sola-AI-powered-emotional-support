import { Module } from '@nestjs/common';
import { GeminiProvider } from './gemini.provider';

@Module({
  providers: [{ provide: 'AiProvider', useClass: GeminiProvider }],
  exports: ['AiProvider'],
})
export class AiModule {}