import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from './common/config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  getDataSourceFactory,
  getTypeormConfig,
} from './common/config/typeorm.config';
import { PostModule } from './post/post.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authorization/jwt/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfig,
      dataSourceFactory: getDataSourceFactory,
    }),
    AuthorizationModule,
    UserModule,
    PostModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
