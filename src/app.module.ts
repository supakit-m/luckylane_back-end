import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from './infrastructure/database/luckylane.database.module';


import { AccountsController } from './controllers/accounts/accounts.controller';


import { AccountsService } from './services/accounts/accounts.service';

import { AuthModule } from './auth/auth.module';
import { GoogleAuthService } from 'src/util/services/google-auth.service';
import { HealthModule } from '@app/util/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    HttpModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AccountsController,],
  providers: [AccountsService, GoogleAuthService],
})
export class AppModule {}
