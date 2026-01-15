"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAuction } from "@/contexts/auction-context"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock } from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const { products, updateProductStatus } = useAuction()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const pendingProducts = products.filter((p) => p.status === "pending")
  const activeProducts = products.filter((p) => p.status === "active")

  const handleApprove = (productId: string) => {
    updateProductStatus(productId, "active")
  }

  const handleReject = (productId: string) => {
    updateProductStatus(productId, "rejected")
  }

  const handleCloseBid = (productId: string) => {
    updateProductStatus(productId, "sold")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage auction items and close bids</p>
            </div>

            {/* Pending Approvals */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Pending Approvals</h2>
              {pendingProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">No pending approvals</CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle>{product.name}</CardTitle>
                              <Badge variant="secondary">{product.status}</Badge>
                            </div>
                            <CardDescription>{product.description}</CardDescription>
                          </div>
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Seller:</span>
                            <p className="font-medium">{product.sellerName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Condition:</span>
                            <p className="font-medium capitalize">{product.condition}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Starting Price:</span>
                            <p className="font-medium">${product.startingPrice}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={() => handleApprove(product.id)} className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button onClick={() => handleReject(product.id)} variant="destructive" className="flex-1">
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Active Auctions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Active Auctions</h2>
              {activeProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">No active auctions</CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle>{product.name}</CardTitle>
                              <Badge>{product.status}</Badge>
                            </div>
                            <CardDescription>{product.description}</CardDescription>
                          </div>
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Seller:</span>
                            <p className="font-medium">{product.sellerName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current Bid:</span>
                            <p className="font-medium text-primary">${product.currentPrice}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Condition:</span>
                            <p className="font-medium capitalize">{product.condition}</p>
                          </div>
                        </div>

                        <Button onClick={() => handleCloseBid(product.id)} variant="outline" className="w-full">
                          <Clock className="mr-2 h-4 w-4" />
                          Close Bid & Mark as Sold
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
