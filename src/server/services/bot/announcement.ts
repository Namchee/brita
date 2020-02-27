import { Message, QuickReplyItem, FlexBubble } from '@line/bot-sdk';
import {
  BotService,
  BotServiceParameters,
  BotServiceResult,
  HandlerParameters,
} from './base';
import { AnnouncementRepository } from './../../repository/announcement';
import { UserError } from './../../utils/error';
import { REPLY } from './utils/reply';
import { CategoryRepository } from './../../repository/category';
import { Category } from './../../entity/category';
import { StringMap } from '../../utils/types';
import {
  generateQuickReplyObject,
  generateBubbleContainer,
  generateTextComponent,
  generateCarouselContainer,
  generateFlexMessage,
} from './utils/formatter';

/**
 * A class which provide services for serving announcements
 * (with query support) to user
 */
export class BotAnnouncementService extends BotService {
  private readonly announcementRepository: AnnouncementRepository;
  private readonly categoryRepository: CategoryRepository;

  private static readonly PROMPT_MESSAGE: Message = {
    type: 'text',
    quickReply: {
      items: [
        generateQuickReplyObject(
          REPLY.NEXT_ANNOUNCEMENT_LABEL,
          REPLY.NEXT_ANNOUNCEMENT_TEXT,
        ),
        generateQuickReplyObject(
          REPLY.RECHOOSE_CATEGORY_LABEL,
          REPLY.RECHOOSE_CATEGORY_TEXT,
        ),
        generateQuickReplyObject(
          REPLY.END_REQUEST_LABEL,
          REPLY.END_REQUEST_TEXT,
        ),
      ],
    },
    text: REPLY.PROMPT_ANNOUNCEMENT,
  };

  private static readonly INTRO_MESSAGE: Message = {
    type: 'text',
    text: REPLY.SHOW_ANNOUNCEMENT,
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
      timestamp,
      misc,
    }: BotServiceParameters,
  ): Promise<BotServiceResult> => {
    try {
      return await this.handler[state]({ text, timestamp, misc });
    } catch (err) {
      if (err instanceof UserError) {
        return {
          state: -1,
          message: [{
            type: 'text',
            text: err.message,
          }],
        };
      }

      throw err;
    }
  }

  /**
   * Handles the initial user request
   */
  private handleFirstState = async (
    {
      misc,
    }: HandlerParameters,
  ): Promise<BotServiceResult> => {
    if (misc) {
      misc = undefined;
    }

    const categories = await this.categoryRepository.findAll();

    // Fallback case when category is not present
    if (categories.length === 0) {
      return {
        state: 0,
        message: [{
          type: 'text',
          text: REPLY.NO_ANNOUNCEMENT,
        }],
        misc,
      };
    }

    const quickReplies: QuickReplyItem[] = categories.map((category) => {
      return generateQuickReplyObject(category.name, category.name);
    });

    let messageText = REPLY.INPUT_CATEGORY + '\n';

    for (let i = 0; i < categories.length; i++) {
      if (i) {
        messageText += '\n';
      }

      messageText += categories[i].name;
    }

    return {
      state: 1,
      message: [{
        type: 'text',
        text: messageText,
        quickReply: {
          items: quickReplies,
        },
      }],
      misc,
    };
  }

  /**
   * Handles the category identification flow and announcement response
   */
  private handleSecondState = async (
    {
      text,
      timestamp,
      misc,
    }: HandlerParameters,
  ): Promise<BotServiceResult> => {
    if (!misc || text === REPLY.NEXT_ANNOUNCEMENT_TEXT.toLowerCase()) {
      const category = misc?.category ||
        await this.categoryRepository.findByName(text);

      if (!category) {
        const result = await this.handleFirstState({ text });

        result.message.unshift({
          type: 'text',
          text: REPLY.UNKNOWN_CATEGORY,
        });

        return result;
      }

      category['desc'] = undefined;

      const page = misc?.page || 1;

      const message = await this.generateAnnouncementCarousel(
        category,
        page,
        timestamp || 0,
      );

      const messageArray = [message, BotAnnouncementService.PROMPT_MESSAGE];

      if (message.type === 'flex') {
        messageArray.unshift(BotAnnouncementService.INTRO_MESSAGE);
      }

      const cache: StringMap = {
        'category': category,
        'page': message.type === 'text' ? page : page + 1, // next page
      };

      return {
        state: 1,
        message: messageArray,
        misc: message.type === 'flex' ? cache : undefined,
      };
    } else {
      switch (text) {
        case REPLY.END_REQUEST_TEXT.toLowerCase(): {
          return {
            state: 0,
            message: [{
              type: 'text',
              text: REPLY.END_REQUEST_REPLY,
            }],
            misc: {},
          };
        }
        case REPLY.RECHOOSE_CATEGORY_TEXT.toLowerCase(): {
          misc = undefined;
          return this.handleFirstState({ text: '', misc });
        }
        default: {
          return {
            state: 1,
            message: [
              {
                type: 'text',
                text: REPLY.UNIDENTIFIABLE,
              },
              BotAnnouncementService.PROMPT_MESSAGE,
            ],
            misc,
          };
        }
      }
    }
  }

  /**
   * An utility function to generate carousel announcements
   *
   * @param {Category} category The requested category from user
   * @param {number} page Requested page for the announcements, used to limit
   * the amount of announcements returned
   * @param {number} timestamp Time of the request in millisecond
   * @return {Promise<Message>} An announcement carousel message and
   * a prompt message
   */
  private generateAnnouncementCarousel = async (
    category: Category,
    page: number,
    timestamp: number,
  ): Promise<Message> => {
    const announcements = await this.announcementRepository
      .findByCategory(
        category,
        {
          limit: 10,
          offset: (page - 1) * 10,
          validUntil: new Date(timestamp),
        },
      );

    if (announcements.length === 0) {
      return {
        type: 'text',
        text: REPLY.NO_ANNOUNCEMENT,
      };
    }

    const bubbles: FlexBubble[] = announcements.map((announcement) => {
      const header = generateTextComponent(
        announcement.title,
        'lg',
        true,
        true,
      );

      const body = generateTextComponent(announcement.contents);

      return generateBubbleContainer([body], header, true, true);
    });

    const carouselContainer = generateCarouselContainer(bubbles);

    return generateFlexMessage(carouselContainer);
  }
}
