// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config module available globally across the app
      envFilePath: '.env', // Path to your environment file
    }),
  ],
  providers: [ConfigService], // Register ConfigService as a provider
  exports: [ConfigService], // Export ConfigService so it can be injected elsewhere
})
export class ConfigAppModule {}
