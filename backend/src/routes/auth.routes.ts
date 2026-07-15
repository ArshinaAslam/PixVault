import { Router } from 'express';
import { container } from 'tsyringe';
import { AsyncHandler } from '../middlewares/asyncHandler';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

const authController = container.resolve(AuthController);

router.post('/signup', AsyncHandler(authController.signup.bind(authController)));
router.post('/login', AsyncHandler(authController.login.bind(authController)));
router.post('/refresh-token', AsyncHandler(authController.refreshToken.bind(authController)));
router.get(
  '/me',
  authenticateToken,
  AsyncHandler(authController.getCurrentUser.bind(authController))
);
router.post('/logout', authenticateToken, AsyncHandler(authController.logout.bind(authController)));
router.post(
  "/change-password",
  authenticateToken,
  AsyncHandler(authController.changePassword.bind(authController))
);

export default router;
