
import { Connection } from 'typeorm';
import { AnnouncementRepositoryTypeORM } from './../repository/announcement';
import { CategoryRepositoryTypeORM } from './../repository/category';
import config from './../config/env';
import { AnnouncementController } from '../controllers/announcement';
import { CategoryController } from '../controllers/category';
import { AnnouncementService } from '../services/announcement';
import { CategoryService } from '../services/category';
import { UserRepositoryTypeORM } from '../repository/user';
import { UserService } from '../services/user';
import { UserController } from '../controllers/user';
import { AuthenticationMiddleware } from './middleware';
import { OAuth2Client } from 'google-auth-library';

export interface ControllerList {
  announcementController: AnnouncementController;
  categoryController: CategoryController;
  userController: UserController;

  authMiddleware: AuthenticationMiddleware;
}

export function bootstrapApp(conn: Connection): ControllerList {
  const userRepository = conn.getCustomRepository(
    UserRepositoryTypeORM,
  );
  const announcementRepository = conn.getCustomRepository(
    AnnouncementRepositoryTypeORM,
  );
  const categoryRepository = conn.getCustomRepository(
    CategoryRepositoryTypeORM,
  );

  const announcementService = new AnnouncementService(
    announcementRepository,
    categoryRepository,
  );
  const categoryService = new CategoryService(categoryRepository);
  const userService = new UserService(
    userRepository,
  );

  const oauthClient = new OAuth2Client(config.oauthToken);

  return {
    announcementController: new AnnouncementController(announcementService),
    categoryController: new CategoryController(categoryService),
    userController: new UserController(userService),
    authMiddleware: new AuthenticationMiddleware(oauthClient, userRepository),
  };
}
