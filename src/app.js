const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const root = require('./router');
const {ChatGPTClient} = require("@waylaidwanderer/chatgpt-api");

function createApp(config) {
  const app = new Koa();

  app.context.config = config;
  app.context.chatGptClient = new ChatGPTClient(config.chatgpt.key, {
    debug:false,
  }, {});

  app.use(bodyParser());

  app.use(root.routes()).use(root.allowedMethods()); // 路由


  return app.callback();
}

module.exports = createApp;
