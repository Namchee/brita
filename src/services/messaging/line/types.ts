import { ServerError } from '../../../utils/error';

/**
 * A class which represents single Line Message
 *
 * Use this class when the provider is `line`
 */
export abstract class LineMessage {
  public readonly type: string;
  private static readonly validTypes = [
    'text',
    'template',
    'image',
    'video',
    'audio',
    'location',
    'sticker',
    'imagemap',
    'flex',
  ];

  /**
   * Constructor for `LineMessage`
   * @param {string} type Type of the message, please refer
   * to `validTypes` for all possible types
   * @throws An error if an invalid type is supplied
   */
  public constructor(type: string) {
    if (!LineMessage.validTypes.includes(type)) {
      throw new ServerError('Invalid LINE message type');
    }

    this.type = type;
  }
}

/**
 * A class which represents single plain-text Line Message
 */
export class TextMessage extends LineMessage {
  public readonly text: string;

  /**
   * Constructor for `TextMessage`
   * @param {string} text Contents of the message
   */
  public constructor(text: string) {
    super('text');

    this.text = text;
  }
}

/**
 * A class which represents single Flex Message
 *
 * Use this class for any non-`TextMessage` type for maximum freedom
 */
export class FlexMessage extends LineMessage {
  public readonly altText: string;
  public readonly contents: FlexMessageContents;

  /**
   * Constructor for `FlexMessage`
   * @param {FlexMessageContents} contents Contents of the flex container
   */
  public constructor(contents: FlexMessageContents) {
    super('flex');
    this.altText = '\0'; // no, I don't want to support older LINE
    this.contents = contents;
  }
}

/**
 * A class which represents single content for `FlexMessage`
 */
export abstract class FlexMessageContents {
  public readonly type: string;
  private static readonly validTypes = ['bubble', 'carousel'];

  /**
   * Constructor for `FlexMessageContents`
   * @param {string} type Type of the contents, refer to
   * `validTypes` for all possible values
   * @throws An error if an invalid type is supplied
   */
  public constructor(type: string) {
    if (!FlexMessageContents.validTypes.includes(type)) {
      throw new ServerError('Invalid flex message contents type');
    }

    this.type = type;
  }
}

/**
 * A class which represents a single chat bubble for Flex Message
 *
 * Note: There are many custom stuffs, I just don't support it
 * for now
 */
export class BubbleMessage extends FlexMessageContents {
  public readonly body: BoxContainer;

  /**
   * Constructor for `BubbleMessage`
   * @param {BoxContainer} body Box container
   */
  public constructor(body: BoxContainer) {
    super('bubble');

    this.body = body;
  }
}

/**
 * A class which represents single Carousel Message
 *
 * Basically, it contains more than one `BubbleMessage`
 */
export class CarouselMessage extends FlexMessageContents {
  public readonly contents: BubbleMessage[];

  /**
   * Constructor for `CarouselMessage`
   * @param {BubbleMessage[]} contents Array of `BubbleMessage`
   */
  public constructor(contents: BubbleMessage[]) {
    super('carousel');

    this.contents = contents;
  }
}

/**
 * A class which represents single Box in Line Message
 */
export class BoxContainer {
  public readonly type: string;
  public readonly layout: string;
  public readonly spacing: string;
  public readonly contents: LineMessageComponent[];

  /**
   * Constructor for `BoxContainer`
   * @param {LineMessageComponents[]} contents Array of `LineMessageComponents`
   */
  public constructor(contents: LineMessageComponent[]) {
    this.type = 'box';
    this.layout = 'vertical';
    this.spacing = 'xs';
    this.contents = contents;
  }
}

/**
 * A class which represents single LineMessageComponent
 *
 * It is only usable with `FlexMessage`
 */
export abstract class LineMessageComponent {
  public readonly type: string;

  private static readonly validTypes = ['text', 'button'];

  /**
   * Constructor for LineMessageComponent
   * @param {string} type Component's type
   */
  public constructor(type: string) {
    if (!LineMessageComponent.validTypes.includes(type)) {
      throw new ServerError('Invalid / Unsupported message component type');
    }

    this.type = type;
  }
}

/**
 * A class which represents single text component in a flex message
 *
 * Cannot be customized at the moment
 */
export class TextMessageComponent extends LineMessageComponent {
  public readonly text: string;
  public readonly size?: string;
  public readonly color?: string;
  public readonly wrap?: boolean;

  /**
   * Constructor for `TextMessageComponent`
   * @param {string} text A plain-text message
   */
  public constructor(text: string) {
    super('text');

    this.text = text;
    this.wrap = true;
  }
}

/**
 * A class which represents an action button for flex messages
 */
export class ButtonMessageComponent extends LineMessageComponent {
  public readonly action: LineAction;

  /**
   * Constructor for `ButtonMessageComponent`
   * @param {LineAction} action Action to be performed when the
   * button is clicked
   */
  public constructor(action: LineAction) {
    super('button');

    this.action = action;
  }
}

/**
 * A class which represents an action for Line buttons
 */
export class LineAction {
  public readonly type: string;
  public readonly label: string;
  public readonly text: string;

  /**
   * Constructor for `LineAction`
   * @param {string} label Button's label
   * @param {string} text A plain-text message which will be
   * sent when the button is clicked
   */
  public constructor(label: string, text: string) {
    this.type = 'message';
    this.label = label;
    this.text = text;
  }
}
