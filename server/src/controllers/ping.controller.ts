import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController
{
    @Get()
    ping()
    {
        return {
            time: new Date().toISOString(),
            timestamp: Date.now()
        };
    }
} 