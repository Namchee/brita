import {
  WebhookEvent,
  MessageAPIResponseBase,
  Client,
  Message,
  MessageEvent,
} from '@line/bot-sdk';
import { StateRepository } from './../repository/state';
import { BotService } from './bot/base';
import { formatMessages } from './bot/messaging/formatter';
import { REPLY } from './bot/messaging/reply';
import { StringMap } from '../utils/types';

/**
 * LINE bot service hub
 *
 * It controls state handling and service mapping for supported
 * LINE requests
 */
export class LineBotServiceHub {
  private readonly client: Client;
  private readonly serviceMap: StringMap;
  private readonly stateRepository: StateRepository;

  /**
   * Constructor for LineBotServiceHub
   * @param {Client} client LINE messaging API client
   * @param {StringMap} serviceMap A `StringMap` which 'maps' an
   * identifier to correct services
   * @param {StateRepository} stateRepository A concrete implementation
   * of `StateRepository`
   */
  public constructor(
    client: Client,
    serviceMap: StringMap,
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

    const userId = event.source.userId.trim().toLowerCase();
    const text = event.message.text.trim().toLowerCase();
    const timestamp = event.timestamp;

    const userState = await this.stateRepository.findById(userId);

    const state = userState ? userState.state : 0;

    const service: BotService = userState ?
      this.serviceMap[userState.service] :
      this.serviceMap[text];

    if (!service && !userState) {
      const message = formatMessages([{
        type: 'basic',
        body: [{
          type: 'text',
          text: REPLY.UNIDENTIFIABLE,
        }],
      }]);

      return this.sendMessage(event, message);
    }

    const queryResult = await service.handle(
      {
        state,
        text,
        timestamp,
        misc: userState?.misc,
      },
    );

    if (queryResult.state >= 0) {
      await this.updateUserState(
        userId,
        service.identifier,
        queryResult.state,
        queryResult.misc,
      );
    }

    const message = formatMessages(queryResult.message);

    return this.sendMessage(event, message);
  }

  private updateUserState = async (
    userId: string,
    serviceId: string,
    state: number,
    misc?: StringMap,
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
          misc,
        });
      }
    }
  }

  private sendMessage = (
    event: MessageEvent,
    message: Message | Message[],
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
