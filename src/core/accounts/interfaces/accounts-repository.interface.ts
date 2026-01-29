import { AccountsEntity } from "../entities/accounts.entity";

export interface IAccountsRepository {
    findAll(): Promise<AccountsEntity[] | []>;
  }