import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiServiceService } from './api-service.service';

@Module({
  imports: [HttpModule],
  providers: [ApiServiceService],
  exports: [ApiServiceService],
})
export class ApiServiceModule {}
