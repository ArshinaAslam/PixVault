import { inject, injectable } from 'tsyringe';
import { DI_TYPES } from '../common/di/types';
import { ChangePasswordDto, LoginDto, SignupDto } from '../dto/auth.dto';
import { HttpStatus } from '../common/enums/httpStatus.enum';
import { ApiResponse } from '../common/response/ApiResponse';
import { MESSAGES } from '../common/constants/statusMessages';
import { IAuthService } from '../services/interface/IAuthService';
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth.middleware';

@injectable()
export class AuthController {
  constructor(
    @inject(DI_TYPES.AuthService)
    private readonly _authService: IAuthService
  ) {}

  async signup(req: Request, res: Response): Promise<Response> {
    const dto = req.body as SignupDto;

    const result = await this._authService.signup(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse.success(
          { user: result.user, accessToken: result.tokens.accessToken },
          MESSAGES.AUTH.SIGNUP_SUCCESS
        )
      );
  }

  async login(req: Request, res: Response): Promise<Response> {
    const dto = req.body as LoginDto;

    const result = await this._authService.login(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          { user: result.user, accessToken: result.tokens.accessToken },
          MESSAGES.AUTH.LOGIN_SUCCESS
        )
      );
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    const token = req.cookies?.refreshToken as string;

    const result = this._authService.refreshToken(token);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(result, MESSAGES.AUTH.TOKEN_REFRESHED));
  }

  async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('refreshToken', {
      httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    logger.info('User logged out');
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, MESSAGES.AUTH.LOGOUT_SUCCESS));
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const user = await this._authService.getCurrentUser(userId);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success({ user }, MESSAGES.AUTH.USER_FETCHED));
  }

  async changePassword(req: AuthRequest, res: Response): Promise<Response> {
  const userId = req.userId as string;
  const dto = req.body as ChangePasswordDto;

  await this._authService.changePassword(userId, dto);

  return res
    .status(HttpStatus.OK)
    .json(ApiResponse.success(null, MESSAGES.AUTH.PASSWORD_CHANGED));
}
}
