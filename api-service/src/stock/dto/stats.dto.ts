import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StatsDTO {
  @ApiProperty()
  @IsString()
  stock: string;

  @ApiProperty()
  @IsNumber()
  times_requested: number;
}
