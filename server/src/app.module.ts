import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { UrlsModule } from './urls/urls.module';
import { UrlEntity } from './urls/entities/url.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { IpsModule } from './ips/ips.module';
import { IpEntity } from './ips/entities/ip.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, UrlEntity, IpEntity],
      synchronize: true,
    }),
    UsersModule,
    UrlsModule,
    AuthModule,
    IpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
