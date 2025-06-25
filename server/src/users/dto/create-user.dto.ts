import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'admin',
  })
  login: string;

  @ApiProperty({
    default: 'Admin',
  })
  name: string;

  @ApiProperty({
    default: 'asd123141',
  })
  password: string;
}
