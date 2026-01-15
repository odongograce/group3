"use client"

import AuthGuard from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { useAuction } from "@/contexts/auction-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function AdminClient() {
  const router = useRouter()
  const { logout } = useAuth()
  const { products, approveAuction, closeAuction } = useAuction()

  const pending = products.filter((p) => p.status === "pending")
  const active = products.filter((p) => p.status === "active")

  return (
    <AuthGuard allow={["admin"]} redirectTo="/dashboard/admin/login">
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Marketplace
            </Button>
            <Button
              onClick={async () => {
                await logout()
                router.replace("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Pending Approvals</h2>
            {pending.length === 0 ? (
              <div className="text-muted-foreground">No pending items.</div>
            ) : (
              <div className="space-y-2">
                {pending.map((p) => (
                  <div key={p.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.category} • Starting ${p.startingPrice}
                      </div>
                    </div>
                    <Button onClick={() => approveAuction(p.id)}>Approve</Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Active Auctions</h2>
            {active.length === 0 ? (
              <div className="text-muted-foreground">No active auctions.</div>
            ) : (
              <div className="space-y-2">
                {active.map((p) => (
                  <div key={p.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">Current ${p.currentPrice}</div>
                    </div>
                    <Button variant="destructive" onClick={() => closeAuction(p.id)}>
                      Close Auction
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AuthGuard>
  )
}
