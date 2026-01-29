import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { AccountResponseDto } from '@app/core/accounts/dto/accounts.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('find-all')
  async findAll(): Promise<AccountResponseDto[]> {
    return await this.accountsService.findAll();
  }

  @Post('google-login')
  async googleLogin(@Body() body:{idToken: string}): Promise<any> {
    if (!body.idToken) {
      throw new BadRequestException('ID Token is requireddsdsdsd');
    }
    return await this.accountsService.googleLogin(body.idToken);
  }
}
