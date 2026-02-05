import { AccountsEntity } from '../entities/accounts.entity';

export interface IAccountsRepository {
  findAll(): Promise<AccountsEntity[] | []>;
  findByGoogleId(googleId: string): Promise<AccountsEntity | null>;
  findByEmail(email: string): Promise<AccountsEntity | null>;
  createAccount(
    accountData: Partial<AccountsEntity>,
  ): Promise<AccountsEntity>;
  updateAccount(
    id: number,
    accountData: Partial<AccountsEntity>,
  ): Promise<AccountsEntity>;
}
