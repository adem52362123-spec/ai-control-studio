"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api } from "./api-client"

interface User {
  id: string
  email: string
  name: string
  role: string
  plan?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("token")
    if (stored) {
      setToken(stored)
      api.get<User>("/api/auth/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password })
    localStorage.setItem("token", res.token)
    setToken(res.token)
    setUser(res.user)
  }

  async function register(email: string, password: string, name: string) {
    const res = await api.post<{ token: string; user: User }>("/api/auth/register", { email, password, name })
    localStorage.setItem("token", res.token)
    setToken(res.token)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
