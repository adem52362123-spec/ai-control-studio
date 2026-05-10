export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: "7d",
  bcryptRounds: 12,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
}
