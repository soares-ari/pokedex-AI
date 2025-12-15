import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Função de inicialização da aplicação
 * Configura CORS, validação global e filtros de exceção
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar CORS para permitir requisições do frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Configurar prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Configurar validação global usando class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas do DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
      transform: true, // Transforma payloads para tipos DTO
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(`📚 API disponível em: http://localhost:${port}/api`);
}
bootstrap();
