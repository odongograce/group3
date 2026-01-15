"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

type Role = "buyer" | "seller" | "admin"

export default function AuthGuard({
  children,
  allow,
  redirectTo = "/login",
}: {
  children: React.ReactNode
  allow: Role[]
  redirectTo?: string
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace(redirectTo)
      return
    }

    if (!allow.includes(user.role)) {
      router.replace(redirectTo)
      return
    }
  }, [user, loading, allow, redirectTo, router])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return null
  if (!allow.includes(user.role)) return null

  return <>{children}</>
}
