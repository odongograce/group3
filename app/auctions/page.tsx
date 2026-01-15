"use client"

import { LandingNavbar } from "@/components/landing-navbar"
import { useAuction } from "@/contexts/auction-context"
import { ProductCard } from "@/components/product-card"
import { Package } from "lucide-react"

export default function AuctionsPage() {
  const { products } = useAuction()
  const activeProducts = products.filter((p) => p.status === "active")

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Live Auctions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse second-hand treasures and place your bids on active auctions
            </p>
          </div>

          {activeProducts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Auctions</h3>
              <p className="text-muted-foreground">Check back later for new items</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
