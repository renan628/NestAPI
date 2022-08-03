import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class LimitOffsetDTO {
  @ApiPropertyOptional({ description: 'Limit returned register number' })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({ description: 'Offset returned register number' })
  @IsNumberString()
  @IsOptional()
  offset: number;
}
