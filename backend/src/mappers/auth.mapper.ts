import { IUser } from '../models/User';
import { AuthUserDto } from '../dto/auth.dto';

export class AuthMapper {
  static toUserDto(user: IUser): AuthUserDto {
    return {
      _id: String(user._id),
      email: user.email,
      phone: user.phone,
    };
  }
}
