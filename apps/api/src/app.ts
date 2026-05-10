import { Hono } from "hono"
import { cors } from "hono/cors"
import { config } from "./config"
import { rateLimit } from "./middleware/rate-limit"
import { requestLogger } from "./middleware/logger"
import { auth, projects, providers, commands, tasks, memory, logs, stats, agents, subscription } from "./routes"

const app = new Hono()

app.use("*", cors({ origin: config.corsOrigin, credentials: true }))
app.use("*", rateLimit)
app.use("*", requestLogger)

app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }))

app.route("/api/auth", auth)
app.route("/api/projects", projects)
app.route("/api/providers", providers)
app.route("/api/commands", commands)
app.route("/api/tasks", tasks)
app.route("/api/memory", memory)
app.route("/api/logs", logs)
app.route("/api/stats", stats)
app.route("/api/agents", agents)
app.route("/api/subscription", subscription)

export { app }
