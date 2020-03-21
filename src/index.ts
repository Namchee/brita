import Koa from 'koa';
import { createApp } from './app';
import config from './config/env';

createApp().then((app: Koa) => {
  const port = config.port;

  app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
});
