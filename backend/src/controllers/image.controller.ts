import { inject, injectable } from 'tsyringe';
import { Response } from 'express';
import { DI_TYPES } from '../common/di/types';
import { HttpStatus } from '../common/enums/httpStatus.enum';
import { ApiResponse } from '../common/response/ApiResponse';
import { MESSAGES } from '../common/constants/statusMessages';
import { IImageService } from '../services/interface/IImageService';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ReorderImageDto } from '../dto/image.dto';

@injectable()
export class ImageController {
  constructor(
    @inject(DI_TYPES.ImageService)
    private readonly _imageService: IImageService
  ) {}

  async upload(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const files = req.files as Express.Multer.File[];
    const titles = req.body.titles as string;

    const result = await this._imageService.uploadImages(userId, files, titles);

    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(result, MESSAGES.IMAGE.UPLOAD_SUCCESS));
  }

  async getAll(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const result = await this._imageService.getUserImages(userId, page, limit);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(result, MESSAGES.IMAGE.FETCH_SUCCESS));
  }

  async updateTitle(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const { imageId } = req.params as { imageId: string };
    const { title } = req.body as { title?: string };

    const result = await this._imageService.updateTitle(userId, imageId, { title });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(result, MESSAGES.IMAGE.UPDATE_SUCCESS));
  }

  async replace(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const { imageId } = req.params as { imageId: string };
    const file = req.file as Express.Multer.File;
    const { title } = req.body as { title?: string };



    const result = await this._imageService.replaceImage(userId, imageId, file, title);
    return res
      .status(HttpStatus.OK)
   
      .json(ApiResponse.success(result, MESSAGES.IMAGE.UPDATE_SUCCESS));
  }


  async reorder(req: AuthRequest, res: Response): Promise<Response> {
  const userId = req.userId as string;
  const { order } = req.body as { order: ReorderImageDto[] };

  await this._imageService.reorderImages(userId, order);

  return res
    .status(HttpStatus.OK)
    .json(ApiResponse.success(null, MESSAGES.IMAGE.REORDER_SUCCESS));
}

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId as string;
    const { imageId } = req.params as { imageId: string };

    await this._imageService.deleteImage(userId, imageId);

    return res.status(HttpStatus.OK).json(ApiResponse.success(null, MESSAGES.IMAGE.DELETE_SUCCESS));
  }
}
