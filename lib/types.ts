// export type ProductStatus = "pending" | "active" | "sold" | "closed"

export type Product = {
  id: string
  name: string
  description: string
  condition: string
  startingPrice: number
  currentPrice: number
  category: string
  imageUrl: string
  sellerId: string
  sellerName: string
  status: ProductStatus
  createdAt: string
  endDate: string
  reviews: any[]
}

export type Bid = {
  id: string
  productId: string // maps to auction_id
  userId: string
  username: string
  email: string
  amount: number
  timestamp: string
}

export type CartItem = {
  id: string
  productId: string
  userId: string
  productName: string
  finalPrice: number
  imageUrl: string
  addedAt: string
}
