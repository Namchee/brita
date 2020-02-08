jest.mock('./../services/bot.hub', () => ({
  LineBotServiceHub: jest.fn().mockImplementation(() => ({
    handleBotQuery: jest.fn().mockImplementation(() => 'works'),
  })),
}));

jest.mock('@sentry/node', () => ({

}));
