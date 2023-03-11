import Koa from "koa"
import bodyParser from "koa-bodyparser"
import root from "./router/index.js"
import {ChatGPTClient, BingAIClient } from "@waylaidwanderer/chatgpt-api"
import { bearerToken } from "koa-bearer-token"


function createApp(config) {
  const app = new Koa();

  app.context.config = config;

  app.context.chatGptClient = new ChatGPTClient(config.chatgpt.key, {
    modelOptions: {
      model: config.chatgpt.model
    },
    promptPrefix:`You are ${config.chatgpt.assistantLabel}, a large language model trained by OpenAI. ${config.chatgpt.promptPrefix}.
    Current date: ${new Date().toISOString().split('T')[0]}`,
    debug:false,
  }, {

  });

  app.context.newBingClient = new BingAIClient({
    ...config.bing
  })

  app.use(bearerToken());

  app.use(bodyParser());

  app.use(root.routes()).use(root.allowedMethods()); // 路由


  return app.callback();
}

export default createApp;
