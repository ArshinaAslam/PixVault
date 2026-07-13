import { container } from "tsyringe";
import { DI_TYPES } from "../common/di/types";
import { AuthService } from "../services/implementation/auth.service";
import { UserRepository } from "../repositories/implementation/user.repository";


container.registerSingleton(DI_TYPES.UserRepository, UserRepository);
container.registerSingleton(DI_TYPES.AuthService, AuthService);