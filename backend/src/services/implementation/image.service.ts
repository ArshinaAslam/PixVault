import { inject, injectable } from 'tsyringe';
import { UploadApiResponse } from 'cloudinary';
import { DI_TYPES } from '../../common/di/types';
import { HttpStatus } from '../../common/enums/httpStatus.enum';
import { AppError } from '../../common/errors/appError';
import { MESSAGES } from '../../common/constants/statusMessages';
import { IImageRepository } from '../../repositories/interface/IImageRepository';
import { ImageResponseDto, ReorderImageDto, UpdateImageDto } from '../../dto/image.dto';
import { ImageMapper } from '../../mappers/image.mapper';
import cloudinary from '../../config/cloudinary';
import logger from '../../utils/logger';
import { IImageService } from '../interface/IImageService';
import { Types } from 'mongoose';

@injectable()
export class ImageService implements IImageService {
  constructor(
    @inject(DI_TYPES.ImageRepository)
    private readonly _imageRepo: IImageRepository
  ) {}

  private async uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'pixvault' }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result);
      });
      stream.end(buffer);
    });
  }

async uploadImages(
  userId: string,
  files: Express.Multer.File[],
  titlesRaw: string
): Promise<ImageResponseDto[]> {
  if (!files?.length) {
    throw new AppError(MESSAGES.IMAGE.NO_FILES, HttpStatus.BAD_REQUEST);
  }

  const titles = JSON.parse(titlesRaw) as string[];

  if (files.length !== titles.length) {
    throw new AppError(MESSAGES.IMAGE.TITLE_MISMATCH, HttpStatus.BAD_REQUEST);
  }

  // Push every existing image down by however many new images are coming in
  await this._imageRepo.incrementAllOrders(userId, files.length);

  const uploadResults = await Promise.all(
    files.map((file) => this.uploadToCloudinary(file.buffer))
  );

  const imagesToCreate = uploadResults.map((result, index) => ({
    userId: new Types.ObjectId(userId),
    imageUrl: result.secure_url,
    publicId: result.public_id,
    title: titles[index],
    order: index, 
  }));

  const createdImages = await this._imageRepo.createMany(imagesToCreate);

  logger.info('Images uploaded successfully', { userId, count: createdImages.length });

  return ImageMapper.toDtoList(createdImages);
}

  async getUserImages(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [images, total] = await Promise.all([
      this._imageRepo.findByUserId(userId, skip, limit),
      this._imageRepo.countByUserId(userId),
    ]);

    return {
      images: ImageMapper.toDtoList(images),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async updateTitle(
    userId: string,
    imageId: string,
    dto: UpdateImageDto
  ): Promise<ImageResponseDto> {
    const existing = await this._imageRepo.findByIdAndUser(imageId, userId);
    if (!existing) {
      throw new AppError(MESSAGES.IMAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updated = await this._imageRepo.updateById(imageId, dto);
    if (!updated) {
      throw new AppError(MESSAGES.IMAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info('Image updated successfully', { userId, imageId });

    return ImageMapper.toDto(updated);
  }

  async replaceImage(
    userId: string,
    imageId: string,
    file: Express.Multer.File,
    title?: string
  ): Promise<ImageResponseDto> {
    const existing = await this._imageRepo.findByIdAndUser(imageId, userId);
    if (!existing) {
      throw new AppError(MESSAGES.IMAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const uploadResult = await this.uploadToCloudinary(file.buffer);
    await cloudinary.uploader.destroy(existing.publicId);

    const updated = await this._imageRepo.updateById(imageId, {
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      ...(title ? { title } : {}),
    });

    if (!updated) {
      throw new AppError(MESSAGES.IMAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info('Image replaced successfully', { userId, imageId });
    return ImageMapper.toDto(updated);
  }


  async reorderImages(userId: string, order: ReorderImageDto[]): Promise<void> {
  if (!order?.length) {
    throw new AppError(MESSAGES.IMAGE.NO_FILES, HttpStatus.BAD_REQUEST);
  }

  await Promise.all(
    order.map(({ imageId, order: newOrder }) =>
      this._imageRepo.updateById(imageId, { order: newOrder })
    )
  );

  logger.info("Images reordered successfully", { userId, count: order.length });
}

  async deleteImage(userId: string, imageId: string): Promise<void> {
    const existing = await this._imageRepo.findByIdAndUser(imageId, userId);
    if (!existing) {
      throw new AppError(MESSAGES.IMAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await cloudinary.uploader.destroy(existing.publicId);
    await this._imageRepo.deleteById(imageId);

    logger.info('Image deleted successfully', { userId, imageId });
  }
}
