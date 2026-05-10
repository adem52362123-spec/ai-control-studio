import { Server as HttpServer } from "http"
import { Server } from "socket.io"
import { verify } from "jsonwebtoken"
import { config } from "../config"

let io: Server

export function initWebSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token
    if (!token) return next(new Error("Authentication required"))

    try {
      const payload = verify(token as string, config.jwtSecret) as any
      socket.data.userId = payload.userId
      socket.data.role = payload.role
      next()
    } catch {
      next(new Error("Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.data.userId
    socket.join(`user:${userId}`)

    socket.on("subscribe:project", (projectId: string) => {
      socket.join(`project:${projectId}`)
    })

    socket.on("unsubscribe:project", (projectId: string) => {
      socket.leave(`project:${projectId}`)
    })

    socket.on("disconnect", () => {
      // cleanup handled automatically
    })
  })

  return io
}

export function emitTaskUpdate(taskId: string, data: any) {
  if (!io) return
  io.to(`task:${taskId}`).emit("task:update", { taskId, ...data })
}

export function emitUserEvent(userId: string, event: string, data: any) {
  if (!io) return
  io.to(`user:${userId}`).emit(event, data)
}

export function emitProjectEvent(projectId: string, event: string, data: any) {
  if (!io) return
  io.to(`project:${projectId}`).emit(event, data)
}

export { io }
