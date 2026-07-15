import { SignupDto, LoginDto, AuthResultDto, AuthUserDto, ChangePasswordDto } from '../../dto/auth.dto';

export interface IAuthService {
  signup(dto: SignupDto): Promise<AuthResultDto>;
  login(dto: LoginDto): Promise<AuthResultDto>;
  refreshToken(token: string): { accessToken: string };
  getCurrentUser(userId: string): Promise<AuthUserDto>;
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
}
