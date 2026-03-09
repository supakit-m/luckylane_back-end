import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../src/auth/auth.module';
import { HealthModule } from '@app/util/health/health.module';
import { GoogleAuthService } from '../src/util/services/google-auth.service';
import { AccountsController } from '../src/controllers/accounts/accounts.controller';
import { AccountsService } from '../src/services/accounts/accounts.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    HttpModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, GoogleAuthService],
})
class TestAppModule {}

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) - should return "ok" status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
