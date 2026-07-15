import { IBaseRepository } from '../../common/repository/IBaseRepository';
import { IImage } from '../../models/Image';

export interface IImageRepository extends IBaseRepository<IImage> {
  createMany(data: Partial<IImage>[]): Promise<IImage[]>;
  findByUserId(userId: string, skip: number, limit: number): Promise<IImage[]>;
  findByIdAndUser(imageId: string, userId: string): Promise<IImage | null>;
  updateById(imageId: string, data: Partial<IImage>): Promise<IImage | null>;
  deleteById(imageId: string): Promise<IImage | null>;
  countByUserId(userId: string): Promise<number>;
  findByUserId(userId: string, skip: number, limit: number): Promise<IImage[]>;
  incrementAllOrders(userId: string, incrementBy: number): Promise<void>;
}
