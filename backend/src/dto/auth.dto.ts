export interface SignupDto {
  email: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  _id: string;
  email: string;
  phone: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResultDto {
  user: AuthUserDto;
  tokens: AuthTokensDto;
}
