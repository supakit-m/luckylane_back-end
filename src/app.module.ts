import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from './infrastructure/database/luckylane.database.module';


import { AccountsController } from './controllers/accounts/accounts.controller';


import { AccountsService } from './services/accounts/accounts.service';

import { GoogleAuthService } from 'src/util/services/google-auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    HttpModule,
  ],
  controllers: [AccountsController,],
  providers: [AccountsService, GoogleAuthService],
})
export class AppModule {}
