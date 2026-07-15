import { injectable } from 'tsyringe';
import { BaseRepository } from '../../common/repository/base.repository';
import { IImage, ImageModel } from '../../models/Image';
import { IImageRepository } from '../interface/IImageRepository';

@injectable()
export class ImageRepository extends BaseRepository<IImage> implements IImageRepository {
  constructor() {
    super(ImageModel);
  }

  async createMany(data: Partial<IImage>[]): Promise<IImage[]> {
    return this.model.insertMany(data) as unknown as Promise<IImage[]>;
  }

  async findByUserId(userId: string, skip: number, limit: number): Promise<IImage[]> {
    return this.model.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit).exec();
  }

  async findByIdAndUser(imageId: string, userId: string): Promise<IImage | null> {
    return this.model.findOne({ _id: imageId, userId }).exec();
  }

  async updateById(imageId: string, data: Partial<IImage>): Promise<IImage | null> {
    return this.update(imageId, data);
  }

  async deleteById(imageId: string): Promise<IImage | null> {
    return this.delete(imageId);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.count({ userId });
  }

  async incrementAllOrders(userId: string, incrementBy: number): Promise<void> {
  await this.model.updateMany({ userId }, { $inc: { order: incrementBy } });
}
}
