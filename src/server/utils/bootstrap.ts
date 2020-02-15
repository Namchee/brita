import { Client } from '@line/bot-sdk';
import { Connection } from 'typeorm';
import { createClient } from 'redis';
import { AnnouncementRepositoryTypeORM } from './../repository/announcement';
import { CategoryRepositoryTypeORM } from './../repository/category';
import { BotAnnouncementService } from './../services/bot/announcement';
import { LineBotController } from './../controllers/bot.controller';
import { BotService } from './../services/bot/base';
import { LineBotServiceHub } from './../services/bot.hub';
import config from './../config/env';
import { StateRepositoryRedis } from '../repository/state';

/**
 * An interface which describes key-value mapping for bootstrapped
 * controllers returned by bootstrap function
 */
export interface ControllerList {
  lineController: LineBotController;
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
  const redisClient = createClient()

  const announcementRepository = conn.getCustomRepository(
    AnnouncementRepositoryTypeORM,
  );
  const categoryRepository = conn.getCustomRepository(
    CategoryRepositoryTypeORM,
  );
  const stateRepository = new StateRepositoryRedis();

  const announcementService = new BotAnnouncementService(
    announcementRepository,
    categoryRepository,
  );

  const serviceMap = new Map<string, BotService>();
  serviceMap.set(announcementService.identifier, announcementService);

  const serviceHub = new LineBotServiceHub(client, serviceMap, stateRepository);

  return {
    lineController: new LineBotController(serviceHub),
  };
}
