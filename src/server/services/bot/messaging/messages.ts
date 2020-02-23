/**
 * LINE's quick reply items
 *
 * It represents a single quick reply item
 */
export interface QuickReplyItems {
  label: string;
  text: string;
}

/**
 * Message Body
 *
 * It represents the contents of the message
 *
 * Every Message must contain at least one `MessageBody`
 */
export interface MessageBody {
  type: 'text' | 'button' | 'bubble';
  quickReply?: QuickReplyItems[];
}

/**
 * Text Body
 *
 * It represents a simple text without complex formattings
 */
export interface TextBody extends MessageBody {
  type: 'text';
  text: string;
}

/**
 * Button Body
 *
 * It represents a single button which contains button label and action
 *
 * You can control the size by specifying the `size` property
 */
export interface ButtonBody extends MessageBody {
  type: 'button';
  label: string;
  text: string;
  size?: 'sm' | 'md';
}

/**
 * Carousel Body
 *
 * It represents a single bubble in a carousel
 *
 * Unlike other bodies, it has a header and controlable padding
 */
export interface CarouselBody extends MessageBody {
  type: 'bubble';
  text: string;
  header?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  tightPadding?: boolean;
}

/**
 * An entity which represents a single message to be sent to
 * the user.
 */
export interface Message {
  type: 'basic' | 'buttons' | 'carousel';
  body: MessageBody[];
}
