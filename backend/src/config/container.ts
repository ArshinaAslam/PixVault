import { container } from 'tsyringe';
import { DI_TYPES } from '../common/di/types';
import { AuthService } from '../services/implementation/auth.service';
import { UserRepository } from '../repositories/implementation/user.repository';
import { ImageRepository } from '../repositories/implementation/image.repository';
import { ImageService } from '../services/implementation/image.service';

container.registerSingleton(DI_TYPES.UserRepository, UserRepository);
container.registerSingleton(DI_TYPES.AuthService, AuthService);
container.registerSingleton(DI_TYPES.ImageRepository, ImageRepository);
container.registerSingleton(DI_TYPES.ImageService, ImageService);
