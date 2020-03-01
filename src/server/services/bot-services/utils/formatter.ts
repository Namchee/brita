/**
 * Some utility functions to format LINE flex messages
 */
import {
  FlexMessage,
  FlexButton,
  FlexText,
  FlexBubble,
  FlexComponent,
  FlexCarousel,
  FlexContainer,
  QuickReplyItem,
} from '@line/bot-sdk';

/**
 * A function to create a LINE-compliant quick reply objects for a message
 *
 * @param {string} label Text to be shown to user
 * @param {text} text Actual text to be sent to the server
 * @return {QuickReplyItem} LINE-compliant quick reply object with
 * message' action
 */
export function generateQuickReplyObject(
  label: string,
  text: string,
): QuickReplyItem {
  return {
    type: 'action',
    action: {
      type: 'message',
      label,
      text,
    },
  };
}

/**
 * A function to create a text component for LINE flex messages
 *
 * @param {string} text Text to be sent to user
 * @param {string} size Text size
 * @param {boolean=} bold Fill with `true` if the text should be in bold
 * @param {boolean=} center Fill with `true` if the text should be centered
 * @return {FlexText} LINE flex text component
 */
export function generateTextComponent(
  text: string,
  size?: 'sm' | 'md' | 'lg',
  bold?: boolean,
  center?: boolean,
): FlexText {
  return {
    type: 'text',
    text,
    size: size || 'sm',
    wrap: true,
    weight: bold ? 'bold' : 'regular',
    align: center ? 'center' : 'start',
  };
}

/**
 * A function to create a button component for LINE text message
 *
 * @param {string} label Text to be shown to user
 * @param {string} text Actual text to be sent to server
 * @return {FlexButton} LINE flex button component
 */
export function generateButtonComponent(
  label: string,
  text: string,
): FlexButton {
  return {
    type: 'button',
    action: {
      type: 'message',
      text,
      label,
    },
    height: 'sm',
  };
}

/**
 * A function to create a bubble container used in LINE flex message
 *
 * @param {FlexComponent[]} body Body of the bubble, may contain more than
 * one flex component (text or button)
 * @param {FlexComponent=} header Header for the bubble, you can leave this
 * empty if the bubble should be headerless
 * @param {boolean=} tightPadding Enforces bubble to use tighter-than-normal
 * padding
 * @param {boolean=} smallSize Enforces bubble to have slightly smaller size
 * than usual
 * @return {FlexBubble} LINE flex bubble
 */
export function generateBubbleContainer(
  body: FlexComponent[],
  header?: FlexComponent,
  tightPadding?: boolean,
  smallSize?: boolean,
): FlexBubble {
  const bubble: FlexBubble = {
    type: 'bubble',
    size: smallSize ? 'kilo' : 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: tightPadding ? 'lg' : undefined,
      contents: body,
    },
  };

  if (header) {
    bubble.header = {
      type: 'box',
      layout: 'vertical',
      paddingAll: tightPadding ? 'lg' : undefined,
      contents: [header],
    };
  }

  return bubble;
}

/**
 * A function to wrap flex bubbles to a single LINE carousel
 *
 * @param {FlexBubble[]} bubbles Array of LINE flex bubble
 * @return {FlexCarousel} LINE carousel
 */
export function generateCarouselContainer(
  bubbles: FlexBubble[],
): FlexCarousel {
  return {
    type: 'carousel',
    contents: bubbles,
  };
}

/**
 * A function to generate LINE-compliant flex message, which allows
 * you to format LINE message with CSS (although it's still limited)
 *
 * NOTE: This function cannot generate alt-text yet
 *
 * @param {FlexContainer} contents LINE flex container, can be a single
 * `FlexBubble` or `FlexCarousel`
 * @return {FlexMessage} LINE flex message
 */
export function generateFlexMessage(contents: FlexContainer): FlexMessage {
  return {
    type: 'flex',
    altText: '\0',
    contents,
  };
}
