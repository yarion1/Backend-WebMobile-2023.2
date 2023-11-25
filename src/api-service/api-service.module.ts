import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiServiceService } from './api-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ApiServiceService],
  exports: [ApiServiceService],
})
export class ApiServiceModule {}
