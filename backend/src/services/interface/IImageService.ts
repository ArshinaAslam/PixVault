import { ImageResponseDto, ReorderImageDto, UpdateImageDto } from '../../dto/image.dto';

export interface IImageService {
  uploadImages(
    userId: string,
    files: Express.Multer.File[],
    titlesRaw: string
  ): Promise<ImageResponseDto[]>;
  getUserImages(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: ImageResponseDto[]; total: number; page: number; totalPages: number }>;
  updateTitle(userId: string, imageId: string, dto: UpdateImageDto): Promise<ImageResponseDto>;
  replaceImage(
    userId: string,
    imageId: string,
    file: Express.Multer.File,
    title?: string
  ): Promise<ImageResponseDto>;
  reorderImages(userId: string, order: ReorderImageDto[]): Promise<void>;
  deleteImage(userId: string, imageId: string): Promise<void>;
}
