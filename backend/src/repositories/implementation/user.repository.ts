import { injectable } from 'tsyringe';
import { BaseRepository } from '../../common/repository/base.repository';
import { IUser, UserModel } from '../..//models/User';
import { IUserRepository } from '../interface/IUserRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return this.create(data);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findByUserId(taskId: string): Promise<IUser | null> {
    return this.findById(taskId);
  }

  async updateById(userId: string, data: Partial<IUser>): Promise<IUser | null> {
  return this.update(userId, data);
}
}
