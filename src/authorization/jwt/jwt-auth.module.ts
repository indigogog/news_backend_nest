import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { UserModule } from '../../user/user.module';
import { ErrorModule } from '../../common/error/error.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, ErrorModule, JwtModule, ConfigModule],
  controllers: [JwtAuthController],
  providers: [JwtAuthService, JwtStrategy],
  exports: [],
})
export class JwtAuthModule {}
