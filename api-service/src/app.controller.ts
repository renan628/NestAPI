import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { StockService } from './stock/stock.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/roles.enum';
import { RolesGuard } from './roles/roles.guard';
import { CreateUserDTO } from './users/dto/create-user.dto';
import { EmailDTO, UserCredentialDTO } from './auth/dto/user-credential.dto';
import { JWTUserDTO } from './auth/dto/jwt-user.dto';
import { QueryStockDTO } from './stock/dto/query-stock.dto';
import { TokenDTO } from './auth/dto/token.dto';
import { HistoryDTO } from './stock/dto/history.dto';
import { StatsDTO } from './stock/dto/stats.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users/users.service';
import { query } from 'express';
import { LimitOffsetDTO } from './utils/global-dtos/limit-offset.dto';
import { StockDTO } from './stock/dto/stock.dto';

@ApiTags('Routes')
@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly stockService: StockService,
  ) {}

  @ApiOperation({ description: 'Register a new user' })
  @Post('register')
  async register(@Body() user: CreateUserDTO): Promise<UserCredentialDTO> {
    return this.authService.register(user);
  }

  @ApiOperation({ description: 'Reset a user password' })
  @Post('reset-password')
  async resetPassword(@Body() userEmail: EmailDTO): Promise<string> {
    return this.userService.resetPassword(userEmail.email);
  }

  @ApiOperation({ description: 'Make Login' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() credentials: UserCredentialDTO): Promise<TokenDTO> {
    return this.authService.login(credentials);
  }

  @ApiOperation({ description: 'Get a stock quote' })
  @ApiBearerAuth('JWT')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('stock')
  async getStock(
    @Request() req,
    @Query() query: QueryStockDTO,
  ): Promise<StockDTO> {
    const { id: user }: JWTUserDTO = req.user;
    const { q: symbol } = query;
    return await this.stockService.getStock(symbol, user);
  }

  @ApiOperation({ description: 'Get a history of the user searchs' })
  @ApiBearerAuth('JWT')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @Request() req,
    @Query() query: LimitOffsetDTO,
  ): Promise<HistoryDTO[]> {
    const { id: user }: JWTUserDTO = req.user;
    const { limit, offset } = query;
    const result: HistoryDTO[] = await this.stockService.getHistory(
      user,
      Number(limit || 10),
      Number(offset || 0),
    );
    return result;
  }

  @ApiOperation({
    description:
      'Get a summary of which stocks has been searched and how many times',
  })
  @ApiBearerAuth('JWT')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Query() query: LimitOffsetDTO): Promise<StatsDTO[]> {
    const { limit, offset } = query;
    return await this.stockService.getStats(
      Number(limit || 10),
      Number(offset || 0),
    );
  }
}
