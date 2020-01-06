import 'regenerator-runtime';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import config from './config/config';
import logger from 'koa-logger';

const app = new Koa();
app.use(bodyParser());
app.use(logger());

const router = new Router();

router.get('/', (ctx: Context) => {
  ctx.status = 200;
  ctx.body = {
    data: 'Hello World!',
  };
});

app.use(router.routes());

app.listen(config.port);
console.log(`Server listening on port ${config.port}`);
