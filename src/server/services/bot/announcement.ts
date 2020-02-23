import {
  BotService,
  BotServiceParameters,
  BotServiceResult,
  HandlerParameters,
} from './base';
import {
  Message,
  TextBody,
  QuickReplyItems,
  CarouselBody,
  ButtonBody,
} from './messaging/messages';
import { AnnouncementRepository } from './../../repository/announcement';
import { ServerError, UserError } from './../../utils/error';
import { REPLY } from './messaging/reply';
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

  private static readonly PROMPT_MESSAGE: Message = {
    type: 'buttons',
    body: [
      {
        type: 'text',
        text: REPLY.PROMPT,
      },
      {
        type: 'button',
        label: REPLY.NEXT_ANNOUNCEMENT_LABEL,
        text: REPLY.NEXT_ANNOUNCEMENT_LABEL,
      } as ButtonBody,
      {
        type: 'button',
        label: REPLY.RECHOOSE_CATEGORY_LABEL,
        text: REPLY.RECHOOSE_CATEGORY_LABEL,
      } as ButtonBody,
      {
        type: 'button',
        label: REPLY.END_REQUEST_LABEL,
        text: REPLY.END_REQUEST_LABEL,
      } as ButtonBody,
    ],
  };

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
          const errorMessage: TextBody = {
            type: 'text',
            text: err.message,
          };

          result = {
            state: -2,
            message: [{
              type: 'basic',
              body: [errorMessage],
            }],
          };

          break;
        }

        throw err;
      }
    }

    return result;
  }

  /**
   * Handles the initial user request
   */
  private handleFirstState = async (): Promise<BotServiceResult> => {
    const categories = await this.categoryRepository.findAll();

    /**
     * Fallback case
     *
     * Show 'no category' message
     */
    if (categories.length === 0) {
      const body: TextBody = {
        type: 'text',
        text: REPLY.NO_CATEGORY,
      };

      return {
        state: 0,
        message: [{
          type: 'basic',
          body: [body],
        }],
      };
    }

    const quickReplies: QuickReplyItems[] = categories.map((category) => {
      return {
        label: category.name,
        text: category.name,
      };
    });

    let messageText = REPLY.INPUT_CATEGORY + '\n';

    for (let i = 0; i < categories.length; i++) {
      if (i & 1) {
        messageText += '\t';
      }

      messageText += categories[i].name;

      if (i & 1) {
        messageText += '\n';
      }
    }

    const messageBody: TextBody = {
      type: 'text',
      text: messageText,
    };

    return {
      state: 1,
      message: [{
        type: 'basic',
        body: [messageBody],
        quickReply: quickReplies,
      }],
    };
  }

  /**
   * Handles the category identification flow
   */
  private handleSecondState = async (
    {
      text,
      misc,
    }: HandlerParameters,
  ): Promise<BotServiceResult> => {
    if (!misc) {
      const category = await this.categoryRepository.findByName(text);

      if (!category) {
        throw new UserError(REPLY.UNKNOWN_CATEGORY);
      }

      const cache: StringMap = {};

      delete category.desc; // we don't need this
      cache['category'] = category;
      cache['page'] = 1;

      return {
        state: 1,
        message: [
          await this.generateAnnouncementCarousel(category, 1),
          BotAnnouncementService.PROMPT_MESSAGE,
        ],
        misc: cache,
      };
    } else {
      switch (text) {
        case REPLY.END_REQUEST_LABEL: {
          return {
            state: 0,
            message: [{
              type: 'basic',
              body: [{
                type: 'text',
                text: REPLY.END_REQUEST_REPLY,
              }],
            }],
          };
        }
        case REPLY.RECHOOSE_CATEGORY_LABEL: {
          return this.handleFirstState();
        }
        case REPLY.NEXT_ANNOUNCEMENT_LABEL: {
          return {
            state: 1,
            message: [
              await this.generateAnnouncementCarousel(
                misc['category'],
                misc['page'],
              ),
              BotAnnouncementService.PROMPT_MESSAGE,
            ],
          };
        }
        default: {
          return {
            state: 1,
            message: [{
              type: 'basic',
              body: [{
                type: 'text',
                text: REPLY.UNIDENTIFIABLE,
              }],
            }],
          };
        }
      }
    }
  }

  private generateAnnouncementCarousel = async (
    category: Category,
    page: number,
  ): Promise<Message> => {
    const announcements = await this.announcementRepository
      .findByCategory(category, { limit: 10, offset: (page - 1) * 10 });

    if (announcements.length === 0) {
      return {
        type: 'basic',
        body: [{
          type: 'text',
          text: REPLY.NO_ANNOUNCEMENT,
        }],
      };
    }

    const carouselBody: CarouselBody[] = announcements.map((announcement) => {
      return {
        type: 'bubble',
        header: announcement.title,
        text: announcement.content,
        tightPadding: true,
      };
    });

    return {
      type: 'carousel',
      body: carouselBody,
    };
  }
}
