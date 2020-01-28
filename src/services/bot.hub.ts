import { StateRepository } from '../repository/state';
import { BotService, BotServiceParameters } from './bot/base';
import {
  WebhookEvent,
  MessageAPIResponseBase,
  Client,
  Message,
  MessageEvent,
} from '@line/bot-sdk';
import { State } from '../entity/state';
import config from '../config/config';
import { formatMessages } from './utils/formatter';
import { createTextMessage, createTextBody } from './utils/messages';
import { LineMessage } from './utils/types';
import { REPLY } from '../utils/messaging/reply';
import { ServerError, UserError } from '../utils/error';

export class BotServiceHub {
  private readonly client: Client;
  private readonly serviceMap: Map<string, BotService>;
  private readonly stateRepository: StateRepository;

  public async handleBotQuery(
    event: WebhookEvent,
  ): Promise<MessageAPIResponseBase | null> {
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
      if (this.checkRequestExpiration(userState)) {
        await this.stateRepository.delete(userId);

        const message = formatMessages([
          createTextMessage(createTextBody(REPLY.REQUEST_EXPIRED)),
        ]);

        return this.sendMessage(event, message);
      }

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
      const realText = text + userState?.text;

      const queryResult = await service.handle(
        this.buildServiceParameters(
          service,
          userId,
          state,
          realText,
        ),
      );

      await this.updateUserState(
        userId,
        service.identifier,
        queryResult.state,
        realText,
        new Date(),
      );

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

  private async updateUserState(
    userId: string,
    serviceId: string,
    state: number,
    text: string,
    lastUpdate: Date,
  ): Promise<boolean> {
    const exist = await this.stateRepository.findById(userId);

    if (!exist) {
      return await this.stateRepository.create(
        userId,
        serviceId,
        state,
        text,
      );
    }

    if (state === 0) {
      return await this.stateRepository.delete(userId);
    } else {
      return await this.stateRepository.update({
        id: userId,
        service: serviceId,
        state,
        text,
        lastUpdate,
      });
    }
  }

  private buildServiceParameters(
    service: BotService,
    userId: string,
    state: number,
    text: string,
  ): BotServiceParameters {
    return {
      state,
      text,
      account: service.userRelated ? userId : undefined,
    };
  }

  private checkRequestExpiration(state: State): boolean {
    const lastUpdate = state.lastUpdate.getTime();

    return Date.now() - lastUpdate > config.expirationTime;
  }

  private sendMessage = (
    event: MessageEvent,
    message: LineMessage | LineMessage[],
  ): Promise<MessageAPIResponseBase> => {
    if (Array.isArray(message)) {
      return this.client.pushMessage(
        event.source.userId || '',
        message as Message[],
      );
    } else {
      return this.client.replyMessage(event.replyToken, message as Message);
    }
  }
}
