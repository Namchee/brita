import { ServerError } from '../../utils/error';

/**
 * Formats messages to an object which will be understood
 * by the providing chat client
 * @param {string} provider Provider identifier
 * @param {Messages[]} messages Array of messages
 */
export function formatMessage(
  provider: string,
  messages: Message[],
) {
  switch (provider) {
    case 'line': break;
    default:
      throw new ServerError('Invalid provider name when formatting message');
  }
}
