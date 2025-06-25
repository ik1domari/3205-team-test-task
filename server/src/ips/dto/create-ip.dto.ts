import { ApiProperty } from '@nestjs/swagger';

export class CreateIpDto {
  @ApiProperty({ default: '127.0.0.1' })
  ip: string;

  @ApiProperty({ default: 1 })
  urlId: number;
}
