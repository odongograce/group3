"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { Product, Bid, CartItem } from "@/lib/types"

interface AuctionContextType {
  products: Product[]
  bids: Bid[]
  favorites: string[]
  cartItems: CartItem[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "currentPrice" | "status" | "reviews">) => void
  updateProductStatus: (productId: string, status: Product["status"]) => void
  placeBid: (productId: string, userId: string, username: string, email: string, amount: number) => boolean
  toggleFavorite: (productId: string) => void
  getProductBids: (productId: string) => Bid[]
  addToCart: (productId: string, userId: string) => void
  removeFromCart: (cartItemId: string) => void
  checkAuctionExpiry: () => void
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined)

export function AuctionProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [bids, setBids] = useState<Bid[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const processedAuctions = useRef<Set<string>>(new Set())

  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    const storedBids = localStorage.getItem("bids")
    const storedFavorites = localStorage.getItem("favorites")
    const storedCart = localStorage.getItem("cartItems")

    if (storedProducts) setProducts(JSON.parse(storedProducts))
    if (storedBids) setBids(JSON.parse(storedBids))
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    if (storedCart) setCartItems(JSON.parse(storedCart))

    if (!storedProducts) {
      const sampleProducts: Product[] = [
        {
          id: "prod-1",
          name: "Vintage Camera",
          description: "Classic 35mm film camera in excellent working condition",
          condition: "good",
          startingPrice: 150,
          currentPrice: 150,
          category: "Electronics",
          imageUrl: "/vintage-camera.png",
          sellerId: "seller-1",
          sellerName: "CameraCollector",
          status: "active",
          createdAt: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          reviews: [],
        },
        {
          id: "prod-2",
          name: "Designer Watch",
          description: "Luxury timepiece with leather strap",
          condition: "like-new",
          startingPrice: 500,
          currentPrice: 500,
          category: "Fashion",
          imageUrl: "/luxury-watch.jpg",
          sellerId: "seller-2",
          sellerName: "TimeKeeper",
          status: "active",
          createdAt: new Date().toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          reviews: [],
        },
      ]
      setProducts(sampleProducts)
      localStorage.setItem("products", JSON.stringify(sampleProducts))
    }
  }, [])

  const checkAuctionExpiry = () => {
    const now = new Date()

    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) => {
        if (processedAuctions.current.has(product.id)) {
          return product
        }

        if (product.status === "active" && new Date(product.endDate) < now) {
          processedAuctions.current.add(product.id)

          setBids((currentBids) => {
            const productBids = currentBids
              .filter((b) => b.productId === product.id)
              .sort((a, b) => b.amount - a.amount)

            if (productBids.length > 0) {
              const winningBid = productBids[0]

              setCartItems((currentCart) => {
                const cartItem: CartItem = {
                  id: `cart-${Date.now()}-${product.id}`,
                  productId: product.id,
                  userId: winningBid.userId,
                  productName: product.name,
                  finalPrice: winningBid.amount,
                  imageUrl: product.imageUrl,
                  addedAt: new Date().toISOString(),
                }

                const updatedCart = [...currentCart, cartItem]
                localStorage.setItem("cartItems", JSON.stringify(updatedCart))
                return updatedCart
              })
            }

            return currentBids
          })

          return {
            ...product,
            status: "sold" as const,
            winnerId: bids.find((b) => b.productId === product.id && b.amount === product.currentPrice)?.userId,
            winnerUsername: bids.find((b) => b.productId === product.id && b.amount === product.currentPrice)?.username,
          }
        }
        return product
      })

      if (JSON.stringify(updatedProducts) !== JSON.stringify(currentProducts)) {
        localStorage.setItem("products", JSON.stringify(updatedProducts))
        return updatedProducts
      }
      return currentProducts
    })
  }

  useEffect(() => {
    const interval = setInterval(checkAuctionExpiry, 60000)
    checkAuctionExpiry()

    return () => clearInterval(interval)
  }, [])

  const addProduct = (product: Omit<Product, "id" | "createdAt" | "currentPrice" | "status" | "reviews">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      currentPrice: product.startingPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      reviews: [],
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const updateProductStatus = (productId: string, status: Product["status"]) => {
    const updatedProducts = products.map((p) => (p.id === productId ? { ...p, status } : p))
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const placeBid = (productId: string, userId: string, username: string, email: string, amount: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product || amount <= product.currentPrice) {
      return false
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      productId,
      userId,
      username,
      email,
      amount,
      timestamp: new Date().toISOString(),
    }

    const updatedBids = [...bids, newBid]
    setBids(updatedBids)
    localStorage.setItem("bids", JSON.stringify(updatedBids))

    const updatedProducts = products.map((p) => (p.id === productId ? { ...p, currentPrice: amount } : p))
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    return true
  }

  const toggleFavorite = (productId: string) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]

    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const getProductBids = (productId: string) => {
    return bids
      .filter((b) => b.productId === productId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const addToCart = (productId: string, userId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const cartItem: CartItem = {
      id: `cart-${Date.now()}`,
      productId,
      userId,
      productName: product.name,
      finalPrice: product.currentPrice,
      imageUrl: product.imageUrl,
      addedAt: new Date().toISOString(),
    }

    const updatedCart = [...cartItems, cartItem]
    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== cartItemId)
    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  return (
    <AuctionContext.Provider
      value={{
        products,
        bids,
        favorites,
        cartItems,
        addProduct,
        updateProductStatus,
        placeBid,
        toggleFavorite,
        getProductBids,
        addToCart,
        removeFromCart,
        checkAuctionExpiry,
      }}
    >
      {children}
    </AuctionContext.Provider>
  )
}

export function useAuction() {
  const context = useContext(AuctionContext)
  if (!context) {
    throw new Error("useAuction must be used within AuctionProvider")
  }
  return context
}
