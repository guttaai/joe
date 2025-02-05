import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap()
{
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    await app.listen(port);
    console.log(`Server running on port ${port}`);
}
bootstrap(); 