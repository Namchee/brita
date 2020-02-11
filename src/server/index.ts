import { createApp } from './app';
import Koa from 'koa';
import logger from 'koa-morgan';
import { init, captureException } from '@sentry/node';
import config from 'config/env';

function errorHandler(err: Error): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    captureException(err);
  }
}

createApp().then((app: Koa) => {
  const port = config.port;

  if (process.env.NODE_ENV === 'production') {
    init({ dsn: config.dsn });
  } else {
    app.use(logger('dev'));
  }

  app.on('error', errorHandler);
  app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
});
