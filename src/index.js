
import http from "node:http"
import createApp from "./app.js"
import readConfig from "./config.js"

const servers = [];

async function init() {
  // 初始化配置文件，开启服务器
  const config = await readConfig();
  // 检查 http server
  try {
    const httpServer = http.createServer(createApp(config));
    httpServer.listen(config.http.port);
    servers.push(httpServer);
    console.log(`|- HTTP Server Started : ${config.http.port}`);
  } catch (e) {
    console.error('|- HTTP Server Init Failed', e.message);
  }
}

export default init;
