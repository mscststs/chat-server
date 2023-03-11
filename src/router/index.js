import Router from "koa-router"
import bearerAuth from "../middleware/bearerAuth.js";

const stash = {};
const msgCache = {};

// 24小时清空一次 msgCache
setTimeout(()=>{
  msgCache = {};
}, 24*60*60*1000);


const root = new Router();

root.get('/ping', async (ctx) => {
  ctx.body = 'pong';
});

root.get('/', async (ctx) => {
  ctx.body = 'OK';
});

root.post("/message", bearerAuth, async (ctx)=>{
  const user = ctx.query.user || 'user';
  const key = `${user}`;
  const msgId = ctx.query.msgId || user + Date.now();
  const {text} = ctx.request.body;
  if(!text){
    throw new Error(500);
  }
  console.log("Message Received:", user, text, msgId);
  try{
    if(!msgCache[msgId]){
      console.log("新建请求")
      msgCache[msgId] = ctx.chatGptClient.sendMessage(
        text,
        stash[key] ? {
          conversationId: stash[key].conversationId,
          parentMessageId: stash[key].messageId,
        } : undefined
      );
    }else{
      console.log("从 msgId 恢复请求进度")
    }
    const res = await msgCache[msgId]
    stash[key] = res;
    ctx.body = res;
  }catch(e){
    console.error("error",e)
    ctx.body = {
      response: 'Error: ' + e.message,
      code: -1
    }
  }
})


root.post("/message/bing", bearerAuth, async (ctx)=>{
  const user = ctx.query.user || 'user';
  const key = `${user}:bing`;
  const msgId = ctx.query.msgId || user + Date.now();
  const {text} = ctx.request.body;
  if(!text){
    throw new Error(500);
  }
  console.log("Message Received:", user, text, msgId);
  try{
    if(!msgCache[msgId]){
      console.log("新建请求")
      msgCache[msgId] = ctx.newBingClient.sendMessage(
        text,
        stash[key] ? {
          jailbreakConversationId: stash[key].jailbreakConversationId,
          parentMessageId: stash[key].messageId,
        } : {
          jailbreakConversationId:true
        }
      );
    }else{
      console.log("从 msgId 恢复请求进度")
    }
    const res = await msgCache[msgId]
    stash[key] = res;
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

root.get("/new/bing", bearerAuth, async (ctx) =>{
  const user = ctx.query.user;
  const key = `${user}:bing`;
  stash[key] = null;
  ctx.body = "重置会话成功"
});

export default root;
