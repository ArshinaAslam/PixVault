import { IBaseRepository } from '../../common/repository/IBaseRepository';
import { IUser } from '../../models/User';

export interface IUserRepository extends IBaseRepository<IUser> {
  createUser(data: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUserId(taskId: string): Promise<IUser | null>;
  updateById(userId: string, data: Partial<IUser>): Promise<IUser | null>
}
