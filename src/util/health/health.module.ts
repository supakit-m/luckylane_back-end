import { Module } from '@nestjs/common';
import { HealthController } from '@app/controllers/health.controller';
import { HealthService } from '@app/services/health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
