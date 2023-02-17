import Router from "koa-router"
import bearerAuth from "../middleware/bearerAuth.js";

const stash = {};

const root = new Router();

root.get('/ping', async (ctx) => {
  ctx.body = 'pong';
});

root.get('/', async (ctx) => {
  ctx.body = 'OK';
});

root.post("/message", bearerAuth, async (ctx)=>{
  const user = ctx.query.user;
  const {text} = ctx.request.body;
  if(!text){
    throw new Error(500);
  }
  try{
    const res = await ctx.chatGptClient.sendMessage(
      text,
      stash[user] ? {
        conversationId: stash[user].conversationId,
        parentMessageId: stash[user].messageId,
      } : undefined
    );
    stash[user] = res;
    ctx.body = res;
  }catch(e){
    console.error("error",e)
    ctx.body = {
      response: 'Error: ' + e.message,
      code: -1
    }
  }


})

root.get("/new", bearerAuth, async (ctx) =>{
  const user = ctx.query.user;
  stash[user] = null;
  ctx.body = "重置会话成功"
});

export default root;
