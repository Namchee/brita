import { StateRepositoryTypeORM } from './repository/state';
import { connectToDatabase } from './database/connection';
import { BotService } from './services/bot/base';
import { BotAnnouncementService } from './services/bot/announcement';
import { AnnouncementRepositoryTypeORM } from './repository/announcement';
import { CategoryRepositoryTypeORM } from './repository/category';
import { BotEndpointHandler } from './controllers/line.controller';
import { init } from '@sentry/node';
import config from './config/config';

let endpointHandler: BotEndpointHandler;

init({ dsn: config.dsn });

async function setupBotHandler(): Promise<void> {
  const connection = await connectToDatabase();

  const serviceMap = new Map<string, BotService>();

  const announcementRepository = connection.getCustomRepository(
    AnnouncementRepositoryTypeORM,
  );
  const categoryRepository = connection.getCustomRepository(
    CategoryRepositoryTypeORM,
  );
  const stateRepository = connection.getCustomRepository(
    StateRepositoryTypeORM,
  );

  const announcementService = new BotAnnouncementService(
    announcementRepository,
    categoryRepository,
  );

  serviceMap.set(announcementService.identifier, announcementService);

  endpointHandler = new BotEndpointHandler(serviceMap, stateRepository);
}

export async function botHandler(
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult | void> {
  if (!botHandler) {
    await setupBotHandler();
  }

  return await endpointHandler.handler(event, context);
}
