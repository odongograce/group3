"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const API_URL = "http://127.0.0.1:5555/api"

interface AuthContextType {
  user: any
  signup: (
    email: string,
    username: string,
    password: string,
    role: "buyer" | "seller"
  ) => Promise<{ success: boolean; error?: string }>
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)


  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signup = async (
    email: string,
    username: string,
    password: string,
    role: "buyer" | "seller"
  ) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, username, password, role }),
    })

    if (!res.ok) {
      return { success: false, error: "Signup failed" }
    }

    const data = await res.json()
    setUser(data)
    localStorage.setItem("currentUser", JSON.stringify(data))
    return { success: true }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      return { success: false, error: "Invalid credentials" }
    }

    const data = await res.json()
    setUser(data)
    localStorage.setItem("currentUser", JSON.stringify(data))

    return { success: true, user: data }
  }

  const logout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "DELETE",
      credentials: "include",
    })
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}





















































































// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import type { User, UserRole } from "@/lib/types"

// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
//   signup: (
//     email: string,
//     username: string,
//     password: string,
//     role: UserRole,
//   ) => Promise<{ success: boolean; error?: string }>
//   logout: () => void
//   isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     // Load user from localStorage on mount
//     const storedUser = localStorage.getItem("currentUser")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }

//     // Initialize admin user if not exists
//     const users = JSON.parse(localStorage.getItem("users") || "[]")
//     const adminExists = users.some((u: User) => u.role === "admin")
//     if (!adminExists) {
//       const adminUser: User = {
//         id: "admin-1",
//         email: "admin@ecofind.com",
//         username: "admin",
//         role: "admin",
//         createdAt: new Date().toISOString(),
//       }
//       users.push(adminUser)
//       localStorage.setItem("users", JSON.stringify(users))
//       // Store admin password separately
//       const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")
//       passwords["admin@ecofind.com"] = "admin123"
//       localStorage.setItem("passwords", JSON.stringify(passwords))
//     }
//   }, [])

//   const login = async (email: string, password: string) => {
//     const users = JSON.parse(localStorage.getItem("users") || "[]")
//     const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")

//     const foundUser = users.find((u: User) => u.email === email)

//     if (!foundUser) {
//       return { success: false, error: "User not found" }
//     }

//     if (passwords[email] !== password) {
//       return { success: false, error: "Incorrect password" }
//     }

//     setUser(foundUser)
//     localStorage.setItem("currentUser", JSON.stringify(foundUser))
//     return { success: true }
//   }

//   const signup = async (email: string, username: string, password: string, role: UserRole) => {
//     // Admin cannot signup
//     if (role === "admin") {
//       return { success: false, error: "Admin accounts cannot be created through signup" }
//     }

//     const users = JSON.parse(localStorage.getItem("users") || "[]")
//     const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")

//     // Check if email already exists
//     if (users.some((u: User) => u.email === email)) {
//       return { success: false, error: "Email already exists" }
//     }

//     const newUser: User = {
//       id: `user-${Date.now()}`,
//       email,
//       username,
//       role,
//       createdAt: new Date().toISOString(),
//     }

//     users.push(newUser)
//     passwords[email] = password

//     localStorage.setItem("users", JSON.stringify(users))
//     localStorage.setItem("passwords", JSON.stringify(passwords))

//     setUser(newUser)
//     localStorage.setItem("currentUser", JSON.stringify(newUser))
//     return { success: true }
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("currentUser")
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider")
//   }
//   return context
// }
