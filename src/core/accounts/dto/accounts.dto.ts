import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  IsNumber,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class AccountResponseDto {
  account_id!: number;
  full_name!: string;
  name!: string;
  email!: string;
  role!: string;
}

export class GoogleLoginDto {
  idToken!: string;
}
