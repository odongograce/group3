"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAuction } from "@/contexts/auction-context"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Clock, User, Mail, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const { products, placeBid, getProductBids, favorites, toggleFavorite } = useAuction()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [bidAmount, setBidAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const bids = getProductBids(productId)
  const isFavorite = favorites.includes(productId)

  const timeLeft = new Date(product.endDate).getTime() - Date.now()
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const amount = Number.parseFloat(bidAmount)

    if (amount <= product.currentPrice) {
      setError(`Bid must be higher than current price of $${product.currentPrice}`)
      return
    }

    const bidPlaced = placeBid(productId, user.id, user.username, user.email, amount)

    if (bidPlaced) {
      setSuccess(true)
      setBidAmount("")
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError("Failed to place bid. Please try again.")
    }
  }

  const canBid = user.role === "buyer" && product.status === "active"

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Auctions
              </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-border">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className="absolute top-4 left-4"
                    variant={product.status === "active" ? "default" : "secondary"}
                  >
                    {product.status}
                  </Badge>
                  {user.role !== "admin" && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4"
                      onClick={() => toggleFavorite(productId)}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-balance">{product.name}</h1>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <p className="text-muted-foreground text-pretty">{product.description}</p>
                </div>

                <Separator />

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium capitalize">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Price</p>
                    <p className="font-medium">${product.startingPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-medium">{product.sellerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Left</p>
                      <p className="font-medium">
                        {daysLeft > 0 ? `${daysLeft}d ` : ""}
                        {hoursLeft}h {minutesLeft}m
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Current Bid */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-primary">${product.currentPrice}</span>
                    {bids.length > 0 && (
                      <span className="text-sm text-muted-foreground mb-2">({bids.length} bids)</span>
                    )}
                  </div>
                </div>

                {/* Bidding Form */}
                {canBid ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Place Your Bid</CardTitle>
                      <CardDescription>Enter an amount higher than the current bid</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bidAmount">Bid Amount ($)</Label>
                          <Input
                            id="bidAmount"
                            type="number"
                            placeholder={`Minimum: $${product.currentPrice + 1}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                            min={product.currentPrice + 1}
                            step="0.01"
                          />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {success && <p className="text-sm text-green-600">Bid placed successfully!</p>}

                        <Button type="submit" className="w-full">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Place Bid
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : user.role === "admin" ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      Admins cannot place bids
                    </CardContent>
                  </Card>
                ) : user.role === "seller" ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      Switch to a buyer account to place bids
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      This auction is no longer active
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Bid History */}
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
                <CardDescription>
                  {bids.length === 0 ? "No bids yet" : `${bids.length} ${bids.length === 1 ? "bid" : "bids"} placed`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Be the first to place a bid!</p>
                ) : (
                  <div className="space-y-3">
                    {bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{bid.username}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {bid.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${bid.amount}</p>
                          <p className="text-xs text-muted-foreground">{new Date(bid.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
