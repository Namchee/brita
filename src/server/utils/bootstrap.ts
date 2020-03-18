import { Client } from '@line/bot-sdk';
import { Connection } from 'typeorm';
import Redis from 'ioredis';
import { AnnouncementRepositoryTypeORM } from './../repository/announcement';
import { CategoryRepositoryTypeORM } from './../repository/category';
import { BotAnnouncementService } from '../services/bot-services/announcement';
import { LineBotController } from '../controllers/bot';
import { LineBotServiceHub } from '../services/bot';
import config from './../config/env';
import { StateRepositoryRedis } from '../repository/state';
import { StringMap } from './types';
import { AnnouncementController } from '../controllers/announcement';
import { CategoryController } from '../controllers/category';
import { AnnouncementService } from '../services/announcement';
import { CategoryService } from '../services/category';
import { UserRepositoryTypeORM } from '../repository/user';
import { UserService } from '../services/user';
import { UserController } from '../controllers/user';
import { AuthenticationMiddleware } from './middleware';
import { OAuth2Client } from 'google-auth-library';

/**
 * An interface which describes key-value mapping for bootstrapped
 * controllers returned by bootstrap function
 */
export interface ControllerList {
  lineController: LineBotController;
  announcementController: AnnouncementController;
  categoryController: CategoryController;
  userController: UserController;

  authMiddleware: AuthenticationMiddleware;
}

/**
 * Bootstrap all application dependency
 * and return list of controllers
 *
 * @param {Connection} conn TypeORM connection instance
 * @return {ControllerList} A list of singleton controllers
 */
export function bootstrapApp(conn: Connection): ControllerList {
  const lineConfig = {
    channelAccessToken: config.accessToken,
    channelSecret: config.secretToken,
  };

  const client = new Client(lineConfig);
  const redisClient = new Redis(config.redisUrl);

  const userRepository = conn.getCustomRepository(
    UserRepositoryTypeORM,
  );
  const announcementRepository = conn.getCustomRepository(
    AnnouncementRepositoryTypeORM,
  );
  const categoryRepository = conn.getCustomRepository(
    CategoryRepositoryTypeORM,
  );
  const stateRepository = new StateRepositoryRedis(redisClient);

  const botAnnouncementService = new BotAnnouncementService(
    announcementRepository,
    categoryRepository,
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

  const serviceMap: StringMap = {};

  serviceMap[botAnnouncementService.identifier] = botAnnouncementService;

  const serviceHub = new LineBotServiceHub(client, serviceMap, stateRepository);

  return {
    lineController: new LineBotController(serviceHub),
    announcementController: new AnnouncementController(announcementService),
    categoryController: new CategoryController(categoryService),
    userController: new UserController(userService),
    authMiddleware: new AuthenticationMiddleware(oauthClient, userRepository),
  };
}
