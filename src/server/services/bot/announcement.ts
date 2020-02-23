import {
  BotService,
  BotServiceParameters,
  BotServiceResult,
  HandlerParameters,
} from './base';
import { Message, TextBody, QuickReplyItems, CarouselBody, ButtonBody } from './messaging/messages';
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

      const announcements = await this.announcementRepository
        .findByCategory(category, 10);

      const carouselBody: CarouselBody[] = announcements.map((announcement) => {
        return {
          type: 'bubble',
          header: announcement.title,
          text: announcement.content,
          tightPadding: true,
        };
      });

      return {
        state: 2,
        message: [
          {
            type: 'carousel',
            body: carouselBody,
          },
          this.generatePrompt(),
        ],
        misc: cache,
      };
    } else {

    }
  }

  private generatePrompt(): Message {
    return {
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
  }
}
