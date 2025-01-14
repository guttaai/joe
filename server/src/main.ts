import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap()
{
    const port = process.env.PORT || 2049;
    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    console.log(`Server running on port ${port}`);
}
bootstrap(); 