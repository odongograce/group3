"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { Heart, Clock } from "lucide-react"
import { useAuction } from "@/contexts/auction-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { favorites, toggleFavorite } = useAuction()
  const { user } = useAuth()
  const isFavorite = favorites.includes(product.id)

  const timeLeft = new Date(product.endDate).getTime() - Date.now()
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 left-2" variant={product.status === "active" ? "default" : "secondary"}>
          {product.status}
        </Badge>
        {user?.role !== "admin" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">{product.name}</h3>
          <Badge variant="outline" className="shrink-0">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`} left</span>
        </div>

        <div className="pt-2">
          <div className="text-xs text-muted-foreground">Current Bid</div>
          <div className="text-2xl font-bold text-primary">${product.currentPrice}</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
