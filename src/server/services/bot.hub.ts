import {
  WebhookEvent,
  MessageAPIResponseBase,
  Client,
  Message as LineMessage,
  MessageEvent,
} from '@line/bot-sdk';
import { StateRepository } from './../repository/state';
import { BotService } from './bot/base';
import { formatMessages } from './bot/messaging/formatter';
import {
  createTextMessage,
  createTextBody,
} from './bot/messaging/messages';
import { REPLY } from './bot/messaging/reply';
import { ServerError, UserError } from './../utils/error';

/**
 * LINE bot service hub
 *
 * It controls state handling and service mapping for supported
 * LINE requests
 */
export class LineBotServiceHub {
  private readonly client: Client;
  private readonly serviceMap: Map<string, BotService>;
  private readonly stateRepository: StateRepository;

  /**
   * Constructor for LineBotServiceHub
   * @param {Client} client LINE messaging API client
   * @param {Map<string, BotService>} serviceMap A `Map` which 'maps' an
   * identifier to correct services
   * @param {StateRepository} stateRepository A concrete implementation
   * of `StateRepository`
   */
  public constructor(
    client: Client,
    serviceMap: Map<string, BotService>,
    stateRepository: StateRepository,
  ) {
    this.client = client;
    this.serviceMap = serviceMap;
    this.stateRepository = stateRepository;
  }

  /**
   * Handles bot queries and respond with approriate messages
   *
   * @param {WebhookEvent} event LINE webhook event
   * @return {Promise<MessageAPIResponseBase | null>} Proper respond or
   * `null` when supplied with unsupported events
   */
  public handleBotQuery = async (
    event: WebhookEvent,
  ): Promise<MessageAPIResponseBase | null> => {
    if (
      event.type !== 'message' ||
      event.message.type !== 'text' ||
      event.source.type != 'user'
    ) {
      return Promise.resolve(null);
    }

    const userId = event.source.userId;
    const text = event.message.text;

    const userState = await this.stateRepository.findById(userId);

    const state = userState ? userState.state : 0;
    let service: BotService | undefined;

    if (userState) {
      service = this.serviceMap.get(userState.service);
    } else {
      const command = text.split(' ')[0];

      service = this.serviceMap.get(command);
    }

    if (!service) {
      if (userState) {
        throw new ServerError(
          `Service from user state is unidentifiable: ${userState.service}`,
        );
      } else {
        const message = formatMessages([
          createTextMessage(createTextBody(REPLY.UNIDENTIFIABLE)),
        ]);

        return this.sendMessage(event, message);
      }
    }

    try {
      const realText = userState ?
        `${userState.text} ${text}` :
        text;

      const queryResult = await service.handle(
        {
          state,
          text: realText,
          misc: userState?.misc,
        },
      );

      if (queryResult.state >= 0) {
        const stateProcess = await this.updateUserState(
          userId,
          service.identifier,
          queryResult.state,
          realText,
          queryResult.misc,
        );

        if (!stateProcess) {
          throw new ServerError('Failed to update user state');
        }
      }

      const message = formatMessages(queryResult.message);

      return this.sendMessage(event, message);
    } catch (err) {
      if (err instanceof UserError) {
        const message = formatMessages([
          createTextMessage(createTextBody(err.message)),
        ]);

        return this.sendMessage(event, message);
      }

      throw err;
    }
  }

  private updateUserState = async (
    userId: string,
    serviceId: string,
    state: number,
    text: string,
    misc?: Map<string, any>,
  ): Promise<boolean> => {
    const exist = await this.stateRepository.findById(userId);

    if (!exist) {
      if (state === 0) {
        return true;
      }

      return await this.stateRepository.create(
        userId,
        serviceId,
        state,
        text,
        misc,
      );
    } else {
      if (state === 0) {
        return await this.stateRepository.delete(userId);
      } else {
        return await this.stateRepository.update({
          id: userId,
          service: serviceId,
          state,
          text,
          misc,
        });
      }
    }
  }

  private sendMessage = (
    event: MessageEvent,
    message: LineMessage | LineMessage[],
  ): Promise<MessageAPIResponseBase> => {
    if (Array.isArray(message)) {
      return this.client.pushMessage(
        event.source.userId || '',
        message,
      );
    } else {
      return this.client.replyMessage(event.replyToken, message);
    }
  }
}
