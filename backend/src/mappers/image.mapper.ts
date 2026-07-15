import { IImage } from '../models/Image';
import { ImageResponseDto } from '../dto/image.dto';

export class ImageMapper {
  static toDto(image: IImage): ImageResponseDto {
    return {
      _id: String(image._id),
      imageUrl: image.imageUrl,
      title: image.title,
      order: image.order,
      createdAt: image.createdAt,
    };
  }

  static toDtoList(images: IImage[]): ImageResponseDto[] {
    return images.map((image) => ImageMapper.toDto(image));
  }
}
