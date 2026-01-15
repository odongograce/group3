"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AdminIndexPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/dashboard/admin/login")
    else if (user.role !== "admin") router.replace("/dashboard")
  }, [user, loading, router])

  if (!user || user.role !== "admin") return null

  return <div className="p-6">Welcome, Admin.</div>
}
