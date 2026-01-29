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
    return await this.repository.find({ where: { is_active: true } }) || [];
  }

  
}
