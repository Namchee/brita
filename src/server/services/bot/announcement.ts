import {
  BotService,
  BotServiceParameters,
  BotServiceResult,
  HandlerParameters,
} from './base';
import {
  createTextBody,
  createButtonBody,
  createTextMessage,
  createCarouselMessage,
  Message,
  createCarouselBody,
} from './messaging/messages';
import { AnnouncementRepository } from './../../repository/announcement';
import { ServerError, UserError } from './../../utils/error';
import { REPLY, LOGIC_ERROR } from './messaging/reply';
import { CategoryRepository } from './../../repository/category';
import { Category } from './../../entity/category';
import { StringMap } from '../../utils/types';

/**
 * A class which provides service for handling announcement fetching
 * from a chat bot
 */
export class BotAnnouncementService extends BotService {
  private readonly announcementRepository: AnnouncementRepository;
  private readonly categoryRepository: CategoryRepository;
  /**
   * Constructor for bot announcement service
   *
   * @param {AnnouncementRepository} announcementRepository An instance of
   * announcement repository
   * @param {CategoryRepository} categoryRepository An instance of
   * category repository
   */
  public constructor(
    announcementRepository: AnnouncementRepository,
    categoryRepository: CategoryRepository,
  ) {
    super('pengumuman');

    this.handler = [
      this.handleFirstState,
      this.handleSecondState,
    ];

    this.announcementRepository = announcementRepository;
    this.categoryRepository = categoryRepository;
  }

  /**
   * Process announcement service request from chat clients
   *
   * @param {BotServiceParameters} obj Bot service parameters,
   * must include at least `state` and `text`
   * @return {Promise<BotServiceResult>} Service result, in form of
   * `Message`
   */
  public handle = async (
    {
      state,
      text,
      misc,
    }: BotServiceParameters,
  ): Promise<BotServiceResult> => {
    if (state > 2 || state < 0) {
      throw new ServerError(`Invalid state of ${state}`);
    }

    let result: BotServiceResult = {
      state: -1,
      message: [],
    };

    const fragments = text.split(' ');
    const handlerLen = this.handler.length;
    const fragmentLen = fragments.length;

    for (let i = state; i < handlerLen && i < fragmentLen; i++) {
      try {
        result = await this.handler[i]({ text, misc });
        misc = result.misc ? result.misc : misc;
      } catch (err) {
        if (err instanceof UserError) {
          result = {
            state: -2,
            message: [createTextMessage(
              createTextBody(err.message),
            )],
          };

          break;
        }

        throw err;
      }
    }

    return result;
  }

  /**
   * Handles the command checking flow
   */
  private handleFirstState = async (): Promise<BotServiceResult> => {
    const categories = await this.categoryRepository.findAll();

    if (categories.length === 0) {
      return {
        state: 0,
        message: [
          createTextMessage(createTextBody(REPLY.NO_CATEGORY)),
        ],
      };
    }

    const quickReplies = 

    return {
      state: 1,
      message: [
        createTextMessage(createTextBody(REPLY.INPUT_CATEGORY)),
        createTextMessage(createTextBody()),
      ],
    };
  }

  /**
   * Handles the category identification flow
   */
  private handleSecondState = async (
    {
      text,
    }: HandlerParameters,
  ): Promise<BotServiceResult> => {
    const categoryText = text.split(' ')[1];

    const category = await this.categoryRepository.findByName(categoryText);

    if (!category) {
      throw new UserError(REPLY.UNKNOWN_CATEGORY);
    }

    const cache: StringMap = {};

    delete category.desc; // we don't need this
    cache['category'] = category;

    return {
      state: 2,
      message: [
        createTextMessage(
          createTextBody(REPLY.INPUT_AMOUNT),
        ),
      ],
      misc: cache,
    };
  }

  /**
   * Handles the amount request validation and actual response
   */
  private handleThirdState = async (
    {
      text,
      misc,
    }: HandlerParameters,
  ): Promise<BotServiceResult> => {
    const fragments = text.split(' ');

    const amount = Number(fragments[2]);

    if (isNaN(amount)) {
      throw new UserError(REPLY.AMOUNT_NOT_NUMBER);
    }

    if (amount < 1) {
      throw new UserError(REPLY.AMOUNT_TOO_LITTLE);
    }

    if (amount > 10) {
      throw new UserError(REPLY.AMOUNT_TOO_MUCH);
    }

    if (!misc || !misc.category) {
      throw new ServerError('Cached data for bot service does not exist');
    }

    const category = misc.category as Category;

    if (!category) {
      throw new ServerError(LOGIC_ERROR.BREACH_OF_FLOW);
    }

    let message: Message = createTextMessage(
      createTextBody(REPLY.NO_ANNOUNCEMENT),
    );

    const announcements = await this.announcementRepository
      .findByCategory(category);

    if (announcements.length > 0) {
      announcements.sort((a, b) => {
        if (a.important && b.important) {
          return a.validUntil.getTime() < b.validUntil.getTime() ? -1 : 1;
        }

        return a.important ? -1 : 1;
      });

      const messages = announcements.slice(0, amount).map((announcement) => {
        return createCarouselBody(announcement.title, announcement.content);
      });

      message = createCarouselMessage(messages);
    }

    return {
      state: 0,
      message: [
        createTextMessage(
          createTextBody(REPLY.ANNOUNCEMENT_SERVED + ` ${category.name}`),
        ),
        message,
      ],
    };
  }
}
