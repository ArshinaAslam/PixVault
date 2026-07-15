import { Router } from 'express';
import { container } from 'tsyringe';
import { AsyncHandler } from '../middlewares/asyncHandler';
import { ImageController } from '../controllers/image.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();

const imageController = container.resolve(ImageController);

router.post(
  '/upload',
  authenticateToken,
  uploadMiddleware.array('images', 20),
  AsyncHandler(imageController.upload.bind(imageController))
);
router.get(
  '/my-uploads',
  authenticateToken,
  AsyncHandler(imageController.getAll.bind(imageController))
);
router.patch(
  '/reorder',
  authenticateToken,
  AsyncHandler(imageController.reorder.bind(imageController))
);
router.patch(
  '/:imageId',
  authenticateToken,
  AsyncHandler(imageController.updateTitle.bind(imageController))
);
router.put(
  '/:imageId/replace',
  authenticateToken,
  uploadMiddleware.single('image'),
  AsyncHandler(imageController.replace.bind(imageController))
);
router.delete(
  '/:imageId',
  authenticateToken,
  AsyncHandler(imageController.delete.bind(imageController))
);

export default router;