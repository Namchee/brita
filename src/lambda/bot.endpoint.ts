import { LambdaHandler } from './base';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { StateRepository } from '../repository/state';
import { BotService, BotServiceParameters } from '../services/bot/base';
import * as Sentry from '@sentry/node';
import { formatMessages } from '../services/bot/messaging/formatter';
import {
  createTextMessage,
  createTextBody,
} from '../services/bot/messaging/messages';
import { REPLY } from '../utils/messaging/reply';
import { UserError } from '../utils/error';

interface Request {
  userId: string;
  text: string;
}

export class BotEndpointHandler implements LambdaHandler {
  private readonly serviceMap: Map<string, BotService>;
  private readonly stateRepository: StateRepository;

  public constructor(
    serviceMap: Map<string, BotService>,
    stateRepository: StateRepository,
  ) {
    this.serviceMap = serviceMap;
    this.stateRepository = stateRepository;
  }

  public handler = async (
    event: APIGatewayEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult | void> => {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          data: null,
          error: 'The request body must not be null',
        }),
      };
    }

    const body = JSON.parse(event.body);

    if (!this.isRequestBody(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          data: null,
          error: 'Invalid request body format',
        }),
      };
    }

    const userId = body.userId.trim().toLowerCase();
    const text = body.text.trim().toLowerCase();

    const state = await this.stateRepository.findById(userId);
    let service: BotService | undefined;

    if (state) {
      service = this.serviceMap.get(state.service);
    } else {
      const serviceKeyword = text.split(' ')[0];

      service = this.serviceMap.get(serviceKeyword);

      if (!service) {
        const message = formatMessages([
          createTextMessage(createTextBody(REPLY.UNIDENTIFIABLE)),
        ]);

        return {
          statusCode: 400,
          body: JSON.stringify({
            data: null,
            error: message,
          }),
        };
      }
    }

    if (!service) {
      let errorString = 'Service map returns undefined';

      if (state) {
        errorString += ` for service ${state.service}`;
      }

      this.sendError(errorString, context);
      return;
    }

    try {
      const processedText = (state) ?
        state.text + text :
        text;

      const result = await service.handle(
        this.buildServiceParameters(
          service,
          userId,
          state ? state.state : 0,
          text,
        ),
      );

      const updateResult = await this.updateUserState(
        userId,
        service.identifier,
        result.state,
        processedText,
      );

      if (!updateResult) {
        const errorString = 'State update failure';

        this.sendError(errorString, context);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: formatMessages(result.message),
          error: null,
        }),
      };
    } catch (err) {
      if (err instanceof UserError) {
        const message = formatMessages([
          createTextMessage(createTextBody(err.message)),
        ]);

        return {
          statusCode: 400,
          body: JSON.stringify({
            data: null,
            error: message,
          }),
        };
      }

      this.sendError((err as Error).message, context);
    }
  }

  private async updateUserState(
    userId: string,
    serviceId: string,
    state: number,
    text: string,
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
      });
    }
  }

  private isRequestBody(object: any): object is Request {
    return object &&
      Object.keys(object).length === 2 &&
      object.userId &&
      typeof(object.userId) === 'string' &&
      object.text &&
      typeof(object.text) === 'string';
  }

  private sendError(message: string, context: Context): void {
    Sentry.getCurrentHub().getClient()?.captureException(
      message,
    );
    context.fail(
      message,
    );
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
}
