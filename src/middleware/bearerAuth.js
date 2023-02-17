export default async function (ctx, next){
  if(ctx.config.auth.enable === true){
    if(ctx.request.token === ctx.config.auth.token){
      await next()
    }else{
      ctx.throw(401);
    }
  }else{
    await next();
  }
}