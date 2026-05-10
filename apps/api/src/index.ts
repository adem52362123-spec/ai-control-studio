import { getRequestListener } from "@hono/node-server"
import { createServer } from "http"
import { config } from "./config"
import { app } from "./app"
import { initWebSocket } from "./ws"

const httpServer = createServer(getRequestListener(app.fetch))
initWebSocket(httpServer)

httpServer.listen(config.port, () => {
  console.log(`🚀 API running on http://localhost:${config.port}`)
})
