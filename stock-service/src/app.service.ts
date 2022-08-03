import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as CSVToJSON from 'csvtojson';
import { StockDTO } from './dto/stock.dto';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getStock(stock: string): Promise<StockDTO> {
    try {
      const url = process.env.STOOQ_URL;
      const { data: stringData } = await this.httpService.axiosRef.get(
        url.replace('{stock}', stock),
      );

      const { Date, Time, Name, Symbol, Open, High, Low, Close } = (
        await CSVToJSON().fromString(stringData)
      )[0];

      if (
        Date === 'N/D' &&
        High === 'N/D' &&
        Low === 'N/D' &&
        Close === 'N/D'
      ) {
        throw new HttpException('Resource not found', HttpStatus.BAD_REQUEST);
      }

      return {
        date: `${Date}T${Time}Z`,
        name: Name,
        symbol: Symbol,
        open: Number(Open),
        high: Number(High),
        low: Number(Low),
        close: Number(Close),
      };
    } catch (e) {
      throw e;
    }
  }
}
