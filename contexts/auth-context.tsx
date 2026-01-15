"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

const API_URL = "http://localhost:5555/api"

type Role = "buyer" | "seller" | "admin"

type AuthUser = {
  id: number
  email: string
  username: string
  role: Role
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  signup: (
    email: string,
    username: string,
    password: string,
    role: Exclude<Role, "admin">
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const res = await fetch(`${API_URL}/check_session`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        localStorage.removeItem("currentUser")
        return
      }

      const data = (await res.json()) as AuthUser
      setUser(data)
      localStorage.setItem("currentUser", JSON.stringify(data))
    } catch {
      // optional fallback if backend is down
      const stored = localStorage.getItem("currentUser")
      setUser(stored ? JSON.parse(stored) : null)
    }
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await refreshSession()
      setLoading(false)
    })()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await safeJson(res)
        return { success: false, error: err?.error ?? `Login failed (${res.status})` }
      }

      const data = (await res.json()) as AuthUser
      setUser(data)
      localStorage.setItem("currentUser", JSON.stringify(data))
      return { success: true, user: data }
    } catch (e) {
      console.error("LOGIN FETCH ERROR:", e)
      return { success: false, error: "Network error (backend down or CORS blocked)" }
    }
  }

  const signup = async (email: string, username: string, password: string, role: Exclude<Role, "admin">) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, username, password, role }),
      })

      if (!res.ok) {
        const err = await safeJson(res)
        return { success: false, error: err?.error ?? `Signup failed (${res.status})` }
      }

      const createdUser = (await res.json()) as AuthUser

      // IMPORTANT: your backend does NOT set session on signup by default.
      // So we login immediately after successful signup:
      const loginResult = await login(email, password)
      if (!loginResult.success) {
        // If login fails, still return created user but user isn't session-authenticated
        return { success: true, user: createdUser }
      }

      return { success: true, user: loginResult.user }
    } catch (e) {
      console.error("SIGNUP FETCH ERROR:", e)
      return { success: false, error: "Network error (backend down or CORS blocked)" }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "DELETE",
        credentials: "include",
      })
    } finally {
      setUser(null)
      localStorage.removeItem("currentUser")
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      refreshSession,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
