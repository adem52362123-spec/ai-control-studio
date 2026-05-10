import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { authMiddleware, getUser } from "../middleware/auth"

const subscription = new Hono()
subscription.use("*", authMiddleware)

subscription.get("/plan", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, subscriptionEndsAt: true },
  })
  return c.json(user)
})

subscription.post("/upgrade", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return c.json({ error: "User not found" }, 404)

  const endsAt = new Date()
  endsAt.setMonth(endsAt.getMonth() + 1)

  await db.user.update({
    where: { id: userId },
    data: { plan: "premium", subscriptionEndsAt: endsAt },
  })

  return c.json({ plan: "premium", subscriptionEndsAt: endsAt.toISOString(), message: "تم الترقية إلى الخطة الاحترافية ✓" })
})

subscription.post("/cancel", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  await db.user.update({
    where: { id: userId },
    data: { plan: "free", subscriptionEndsAt: null },
  })
  return c.json({ plan: "free", message: "تم إلغاء الاشتراك" })
})

export { subscription }
