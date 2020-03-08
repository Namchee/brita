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

/**
 * An interface which describes key-value mapping for bootstrapped
 * controllers returned by bootstrap function
 */
export interface ControllerList {
  lineController: LineBotController;
  announcementController: AnnouncementController;
  categoryController: CategoryController;
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

  const announcementService = new AnnouncementService(announcementRepository);
  const categoryService = new CategoryService(categoryRepository);

  const serviceMap: StringMap = {};

  serviceMap[botAnnouncementService.identifier] = botAnnouncementService;

  const serviceHub = new LineBotServiceHub(client, serviceMap, stateRepository);

  return {
    lineController: new LineBotController(serviceHub),
    announcementController: new AnnouncementController(announcementService),
    categoryController: new CategoryController(categoryService),
  };
}
