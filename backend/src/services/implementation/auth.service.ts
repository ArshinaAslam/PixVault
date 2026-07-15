import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { DI_TYPES } from '../../common/di/types';
import { MESSAGES } from '../../common/constants/statusMessages';
import { HttpStatus } from '../../common/enums/httpStatus.enum';
import { AppError } from '../../common/errors/appError';
import { ENV } from '../../config/env';
import { SignupDto, LoginDto, AuthResultDto, AuthUserDto, ChangePasswordDto } from '../../dto/auth.dto';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { AuthMapper } from '../../mappers/auth.mapper';
import logger from '../../utils/logger';
import { IAuthService } from '../interface/IAuthService';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(DI_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository
  ) {}

  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async signup(dto: SignupDto): Promise<AuthResultDto> {
    if (!dto.phone || !dto.email || !dto.password) {
      throw new AppError(MESSAGES.AUTH.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const existing = await this._userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError(MESSAGES.AUTH.EMAIL_EXISTS, HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this._userRepo.createUser({
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(String(user._id));

    logger.info('User registered successfully', { userId: String(user._id) });

    return { user: AuthMapper.toUserDto(user), tokens };
  }

  async login(dto: LoginDto): Promise<AuthResultDto> {
    if (!dto.email || !dto.password) {
      throw new AppError(MESSAGES.AUTH.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const user = await this._userRepo.findByEmail(dto.email);
    if (!user) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const tokens = this.generateTokens(String(user._id));

    logger.info('User logged in successfully', { userId: String(user._id) });

    return { user: AuthMapper.toUserDto(user), tokens };
  }

  refreshToken(token: string): { accessToken: string } {
    if (!token) {
      throw new AppError(MESSAGES.AUTH.TOKEN_MISSING, HttpStatus.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { userId: string };

    const newAccessToken = jwt.sign({ userId: decoded.userId }, ENV.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    logger.info('Access token refreshed', { userId: decoded.userId });

    return { accessToken: newAccessToken };
  }

  async getCurrentUser(userId: string): Promise<AuthUserDto> {
    const user = await this._userRepo.findByUserId(userId);
    if (!user) {
      throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return AuthMapper.toUserDto(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
  if (!dto.currentPassword || !dto.newPassword) {
    throw new AppError(MESSAGES.AUTH.REQUIRED_FIELDS, HttpStatus.BAD_REQUEST);
  }

  const user = await this._userRepo.findByUserId(userId);
  if (!user) {
    throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
  if (!isMatch) {
    throw new AppError(MESSAGES.AUTH.INVALID_CURRENT_PASSWORD, HttpStatus.BAD_REQUEST);
  }

  if (dto.currentPassword === dto.newPassword) {
    throw new AppError(MESSAGES.AUTH.SAME_PASSWORD, HttpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
  await this._userRepo.updateById(userId, { password: hashedPassword });

  logger.info("Password changed successfully", { userId });
}
}
