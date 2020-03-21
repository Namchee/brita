import Koa from 'koa';
import { createApp } from './app';
// import config from './config/env';

createApp().then((app: Koa) => {
  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
});
