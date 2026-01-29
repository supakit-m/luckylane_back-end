// src/infrastructure/database/luckylane.database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountsEntity } from '@app/core/accounts/entities/accounts.entity';

import { AccountsRepository } from '@app/infrastructure/repositories/accounts.repository';



@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure this is called to load the .env file
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'luckylane_db_Connection',
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('LL_DB_HOST'),
        port: parseInt(configService.get<string>('LL_DB_PORT', '3306'), 10),
        username: configService.get<string>('LL_DB_USERNAME'),
        password: configService.get<string>('LL_DB_PASSWORD'),
        database: configService.get<string>('LL_DB_DATABASE'),
        entities: [
          AccountsEntity,
        ],
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature(
      [
        AccountsEntity,
      ],
      'luckylane_db_Connection',
    ),
  ],
  providers: [
    AccountsRepository,
    {
      provide: 'IAccountsRepository',
      useClass: AccountsRepository,
    },
  ],
  exports: [
    AccountsRepository,
    {
      provide: 'IAccountsRepository',
      useClass: AccountsRepository,
    },
  ],
})
export class DatabaseModule {}
