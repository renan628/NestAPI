import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDTO } from './dto/stats.dto';
import { StockDTO } from './dto/stock.dto';
import { History, HistoryDocument } from './entities/history.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(History.name)
    private historyModel: Model<HistoryDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getStock(symbol: string, userId: string): Promise<StockDTO> {
    try {
      const url = process.env.STOCK_SERVICE_URL;
      const { data: stock } = await this.httpService.axiosRef.get(
        url.replace('{symbol}', symbol),
      );
      await this.historyModel.create({ ...stock, user: userId });
      return stock;
    } catch (e) {
      if (e.name === 'AxiosError') {
        throw new HttpException(
          e?.response?.data?.message,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }

  async getHistory(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<History[]> {
    return await this.historyModel
      .find({ user: userId }, { user: 0, _id: 0, __v: 0 })
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getStats(limit: number, offset: number): Promise<StatsDTO[]> {
    const aggregatorOpts = [
      {
        $group: {
          _id: '$symbol',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          stock: '$_id',
          times_requested: '$count',
        },
      },
    ];
    const stats = await this.historyModel
      .aggregate<StatsDTO>(aggregatorOpts)
      .sort({ stock: 1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return stats;
  }
}
