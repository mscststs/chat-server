const Router = require('koa-router');


const stash = {};

const root = new Router();

root.get('/ping', async (ctx) => {
  ctx.body = 'pong';
});

root.get('/', async (ctx) => {
  ctx.body = 'OK';
});

root.post("/message",async (ctx)=>{
  const user = ctx.query.user;
  const {text} = ctx.request.body;
  if(!text){
    throw new Error(500);
  }

  const res = await chatGptClient.sendMessage(
    text,
    stash[user] ? {
      conversationId: stash[user].conversationId,
      parentMessageId: stash[user].messageId,
    } : undefined
  );

  stash[user] = res;
  ctx.body = res;

})

root.get("/new", async (ctx) =>{
  const user = ctx.query.user;
  stash[user] = null;
});

module.exports = root;
