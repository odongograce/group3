export type UserRole = "buyer" | "seller" | "admin"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  startingPrice: number
  currentPrice: number
  category: string
  imageUrl: string
  sellerId: string
  sellerName: string
  status: "pending" | "active" | "sold" | "rejected"
  createdAt: string
  endDate: string
  reviews: Review[]
  winnerId?: string
  winnerUsername?: string
}

export interface Bid {
  id: string
  productId: string
  userId: string
  username: string
  email: string
  amount: number
  timestamp: string
}

export interface Review {
  id: string
  userId: string
  username: string
  rating: number
  comment: string
  timestamp: string
}

export interface CartItem {
  id: string
  productId: string
  userId: string
  productName: string
  finalPrice: number
  imageUrl: string
  addedAt: string
}
