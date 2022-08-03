import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { StockDTO } from './dto/stock.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query('stock') stock: string): Promise<StockDTO> {
    return await this.appService.getStock(stock);
  }
}
