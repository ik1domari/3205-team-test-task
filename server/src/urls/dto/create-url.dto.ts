import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ default: 'https://example.com' })
  originalUrl: string;

  @ApiProperty({ default: 'example' })
  alias?: string;

  @ApiProperty({ default: '2023-01-01T00:00:00.000Z' })
  expiresAt?: Date;
}
