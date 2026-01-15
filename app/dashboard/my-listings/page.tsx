"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAuction } from "@/contexts/auction-context"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export default function MyListingsPage() {
  const { user, isAuthenticated } = useAuth()
  const { products } = useAuction()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role !== "seller") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "seller") {
    return null
  }

  const myProducts = products.filter((p) => p.sellerId === user.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Listings</h1>
                <p className="text-muted-foreground">Manage your auction items</p>
              </div>

              <Button onClick={() => router.push("/dashboard/upload")}>
                <Package className="mr-2 h-4 w-4" />
                Upload New Product
              </Button>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first product to get started</p>
                <Button onClick={() => router.push("/dashboard/upload")}>Upload Product</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
