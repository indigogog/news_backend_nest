import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { Public } from './decorators';
import { LoginDto } from './dto/login.dto';
import {
  ENDPOINTS,
  GLOBAL_PREFIXES,
} from '../../common/constants/endpoints.consts';
import { JwtAuthService } from './jwt-auth.service';
import { ErrorService } from '../../common/error/error.service';
import { TOKENS } from './enum';
import { CreateUserDto } from '../../user/dto/create-user.dto';

const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
};

@Public()
@Controller(GLOBAL_PREFIXES.AUTH)
export class JwtAuthController {
  constructor(
    private readonly authService: JwtAuthService,
    private readonly errorService: ErrorService,
  ) {}

  @Post(ENDPOINTS.AUTH.LOGIN)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { refreshToken, accessToken } = await this.authService.login(dto);
    res.cookie(TOKENS.REFRESH, refreshToken, COOKIE_CONFIG);
    res.cookie(TOKENS.ACCESS, accessToken, COOKIE_CONFIG);
    res.json(this.errorService.success('Успешный вход'));
  }

  @Post(ENDPOINTS.AUTH.REGISTER)
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    const { refreshToken, accessToken } = await this.authService.register(dto);
    res.cookie(TOKENS.REFRESH, refreshToken, COOKIE_CONFIG);
    res.cookie(TOKENS.ACCESS, accessToken, COOKIE_CONFIG);
    res.json(this.errorService.success('Успешная регистрация'));
  }

  @Get(ENDPOINTS.AUTH.REFRESH)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, accessToken } = await this.authService.refresh(
      req.cookies,
    );

    if (refreshToken) {
      res.cookie(TOKENS.REFRESH, refreshToken, COOKIE_CONFIG);
      res.cookie(TOKENS.ACCESS, accessToken, COOKIE_CONFIG);
    } else {
      res.cookie(TOKENS.ACCESS, accessToken, COOKIE_CONFIG);
    }

    res.json(this.errorService.success('Токены успешно обновлены'));
  }

  @Get(ENDPOINTS.AUTH.LOGOUT)
  async logout(@Res() res: Response) {
    res.clearCookie(TOKENS.REFRESH, COOKIE_CONFIG);
    res.clearCookie(TOKENS.ACCESS, COOKIE_CONFIG);
    res.json(this.errorService.success('Пока-пока, до встречи :)'));
  }
}
