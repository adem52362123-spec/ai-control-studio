import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
})

export const registerSchema = z.object({
  email: z.email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
  name: z.string().min(2, "الاسم حرفين على الأقل"),
})

export const projectSchema = z.object({
  name: z.string().min(2, "اسم المشروع حرفين على الأقل"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "slug أحرف صغيرة وأرقام فقط"),
  description: z.string().optional(),
})

export const commandSchema = z.object({
  input: z.string().min(1, "الأمر لا يمكن أن يكون فارغاً").max(2000),
  projectId: z.string().optional(),
})

export const providerSchema = z.object({
  name: z.enum(["openai", "claude", "openrouter"]),
  apiKey: z.string().min(1, "API Key مطلوب"),
  baseUrl: z.string().optional(),
})

export const memorySchema = z.object({
  key: z.string().min(1),
  content: z.string().min(1),
  projectId: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type CommandInput = z.infer<typeof commandSchema>
export type ProviderInput = z.infer<typeof providerSchema>
export type MemoryInput = z.infer<typeof memorySchema>
