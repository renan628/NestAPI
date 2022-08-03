import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class QueryStockDTO {
  @ApiProperty({ description: 'Stock quote symbol' })
  @IsNotEmpty()
  q: string;
}
