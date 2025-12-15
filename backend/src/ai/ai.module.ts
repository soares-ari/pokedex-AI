import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

/**
 * Módulo de IA
 * Responsável pela integração com OpenAI GPT-4
 */
@Module({
  providers: [AiService],
  exports: [AiService], // Exporta para uso em outros módulos
})
export class AiModule {}
