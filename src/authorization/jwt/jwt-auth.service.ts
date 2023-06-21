import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { LoginDto } from './dto/login.dto';
import { ErrorService } from '../../common/error/error.service';
import { TOKENS } from './enum';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/user.service';
import { User } from '../../types/User.type';
import { UserEntity } from '../../user/enitity/user.entity';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password }: LoginDto) {
    try {
      const { user } = await this.userService.getBy(
        { email },
        { withPassword: true },
      );

      if (!user) {
        throw this.errorService.badRequest('Invalid login or password.');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw this.errorService.badRequest('Invalid login or password.');
      }

      if (user.dateDeleted) {
        throw this.errorService.badRequest('Invalid login or password.');
      }

      const payload = this.getPayload(user);
      const refreshToken = await this.generateToken(payload, '30d');
      const accessToken = await this.generateToken(payload, '24h');

      return { accessToken, refreshToken };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw this.errorService.internal('Authorization error', e.message);
    }
  }

  async register(dto: CreateUserDto) {
    const { user } = await this.userService.create(dto);
    const payload = this.getPayload(user);
    const refreshToken = await this.generateToken(payload, '3m');
    const accessToken = await this.generateToken(payload, '3d');

    return { accessToken, refreshToken };
  }

  async refresh(cookies) {
    try {
      if (!cookies[TOKENS.REFRESH]) {
        throw this.errorService.forbidden('Unauthorized');
      }

      const refreshToken = cookies[TOKENS.REFRESH];

      const { info: refreshTokenInfo, expireIn: expireInRefresh } =
        this.verifyToken(refreshToken);

      const { user } = await this.userService.getBy({
        id: refreshTokenInfo.id,
      });

      if (!user || user.dateDeleted) {
        throw this.errorService.forbidden('Unauthorized');
      }

      const payload = this.getPayload(user);

      if (dayjs().isAfter(expireInRefresh)) {
        const refreshToken = await this.generateToken(payload, '3m');
        const accessToken = await this.generateToken(payload, '3d');

        return { accessToken, refreshToken };
      }

      const accessTokenCookie = cookies[TOKENS.ACCESS];

      const { expireIn: expireInAccess } = this.verifyToken(accessTokenCookie);
      // if access token is fresh
      if (dayjs().isBefore(expireInAccess)) {
        return { accessToken: accessTokenCookie, refreshToken: null };
      }

      const accessToken = await this.generateToken(payload, '3m');

      return { accessToken, refreshToken: null };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw this.errorService.internal(
        'Refresh token error',
        JSON.stringify(e),
      );
    }
  }

  private verifyToken(token: string) {
    let expireIn = 0;
    try {
      const info = this.jwtService.verify<User<{ exp: number; iat: number }>>(
        token,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );

      expireIn = dayjs(info.exp * 1000).valueOf();

      return { isValid: true, info, expireIn };
    } catch (e) {
      return { isValid: false, info: null, expireIn };
    }
  }

  private async generateToken(payload: any, expiresIn: string) {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  private getPayload({ id }: UserEntity) {
    return { id };
  }
}
