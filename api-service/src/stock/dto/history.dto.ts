import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { StockDTO } from 'src/stock/dto/stock.dto';

export class HistoryDTO extends StockDTO {
  @ApiProperty()
  @IsDateString()
  date: string;
}
