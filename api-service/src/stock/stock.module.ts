import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { History, HistorySchema } from './entities/history.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
  ],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
