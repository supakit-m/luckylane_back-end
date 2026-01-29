import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import type { IAccountsRepository } from 'src/core/accounts/interfaces/accounts-repository.interface';
import {
  AccountResponseDto,
  GoogleLoginDto,
} from '@app/core/accounts/dto/accounts.dto';
import { GoogleAuthService } from 'src/util/services/google-auth.service';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async findAll(): Promise<any[]> {
    let users = await this.accountsRepository.findAll();
    return users;
  }

  async googleLogin(idToken: string): Promise<any> {
    const userData = this.googleAuthService.verifyGoogleIdToken(idToken);
    return userData;
  }
}
