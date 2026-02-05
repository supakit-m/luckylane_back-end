import {
  Injectable,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IAccountsRepository } from '@app/core/accounts/interfaces/accounts-repository.interface';
import { GoogleAuthService } from 'src/util/services/google-auth.service';
import { AccountsEntity } from '@app/core/accounts/entities/accounts.entity';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
    private readonly googleAuthService: GoogleAuthService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<any[]> {
    const users = await this.accountsRepository.findAll();
    return users;
  }

  async googleLogin(idToken: string): Promise<{ token: string; user: any }> {
    try {
      const googleUser = await this.googleAuthService.verifyGoogleIdToken(
        idToken,
      );

      if (!googleUser.email) {
        throw new BadRequestException(
          'Email not provided by Google. Cannot process login.',
        );
      }

      let user: AccountsEntity | null =
        await this.accountsRepository.findByGoogleId(googleUser.sub);

      if (!user) {
        // If no user with google_id, check if a user with this email already exists
        const existingUserByEmail = await this.accountsRepository.findByEmail(
          googleUser.email,
        );

        const userDetails = {
          full_name: googleUser.name,
          name: googleUser.given_name,
          surname: googleUser.family_name,
          email: googleUser.email,
          google_id: googleUser.sub,
          picture: googleUser.picture,
          update_date: new Date(),
          update_by: 'system',
        };

        if (existingUserByEmail) {
          // User with this email exists, link the Google account to it
          this.logger.log(
            `Linking Google account for existing user: ${googleUser.email}`,
          );
          user = await this.accountsRepository.updateAccount(
            existingUserByEmail.accounts_id,
            userDetails,
          );
        } else {
          // No user found, create a new one
          this.logger.log(`Creating new user for: ${googleUser.email}`);
          user = await this.accountsRepository.createAccount({
            ...userDetails,
            create_date: new Date(),
            create_by: 'system',
          });
        }
      } else {
        // User found by google_id, update their info
        this.logger.log(`Updating existing user: ${googleUser.email}`);
        user = await this.accountsRepository.updateAccount(user.accounts_id, {
          full_name: googleUser.name,
          name: googleUser.given_name,
          surname: googleUser.family_name,
          picture: googleUser.picture,
          update_date: new Date(),
          update_by: 'system',
        });
      }

      const jwtPayload = {
        sub: user.accounts_id,
        email: user.email,
        role: user.role,
      };
      const token = this.jwtService.sign(jwtPayload);

      return {
        token,
        user: {
          sub: user.google_id,
          email: user.email,
          full_name: user.full_name,
          name: user.name,
          surname: user.surname,
          picture: user.picture,
        },
      };
    } catch (error) {
      this.logger.error(`Google login failed: ${error.message}`, error.stack);
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during login.');
    }
  }
}

