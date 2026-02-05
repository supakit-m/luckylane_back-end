import { IAccountsRepository } from '@app/core/accounts/interfaces/accounts-repository.interface';
import { AccountsEntity } from '@app/core/accounts/entities/accounts.entity';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  private readonly logger = new Logger(AccountsRepository.name);

  constructor(
    @InjectRepository(AccountsEntity, 'luckylane_db_Connection')
    private readonly repository: Repository<AccountsEntity>,
  ) {}

  async findAll(): Promise<AccountsEntity[] | []> {
    return (await this.repository.find({ where: { is_active: true } })) || [];
  }

  async findByGoogleId(googleId: string): Promise<AccountsEntity | null> {
    return await this.repository.findOne({ where: { google_id: googleId } });
  }

  async findByEmail(email: string): Promise<AccountsEntity | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async createAccount(
    accountData: Partial<AccountsEntity>,
  ): Promise<AccountsEntity> {
    try {
      const newAccount = this.repository.create(accountData);
      return await this.repository.save(newAccount);
    } catch (error) {
      this.logger.error(`Failed to create account: ${error.message}`);
      throw new InternalServerErrorException('Error creating account');
    }
  }

  async updateAccount(
    id: number,
    accountData: Partial<AccountsEntity>,
  ): Promise<AccountsEntity> {
    try {
      await this.repository.update(id, accountData);
      const updatedAccount = await this.repository.findOneBy({ accounts_id: id });
      if (!updatedAccount) {
        throw new NotFoundException(`Account with ID ${id} not found after update`);
      }
      return updatedAccount;
    } catch (error) {
      this.logger.error(
        `Failed to update account with ID ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException('Error updating account');
    }
  }

  
}
