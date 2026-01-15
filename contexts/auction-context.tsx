"use client"

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { Product, Bid, CartItem, ProductStatus } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

const API_URL = "http://localhost:5555/api"

type AddProductInput = Omit<Product, "id" | "createdAt" | "currentPrice" | "status" | "reviews">

interface AuctionContextType {
  products: Product[]
  bids: Bid[]
  favorites: string[]
  cartItems: CartItem[]

  // DB-backed
  reloadAll: () => Promise<void>
  addProduct: (product: AddProductInput) => Promise<{ success: boolean; error?: string }>
  updateProductStatus: (productId: string, status: ProductStatus) => Promise<{ success: boolean; error?: string }>
  placeBid: (productId: string, amount: number) => Promise<{ success: boolean; error?: string }>

  // local-only (fine to keep local)
  toggleFavorite: (productId: string) => void
  getProductBids: (productId: string) => Bid[]
  addToCart: (productId: string) => void
  removeFromCart: (cartItemId: string) => void

  // optional
  checkAuctionExpiry: () => void
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined)

type ServerUser = { id: number; username: string; email: string }
type ServerAuction = any
type ServerBid = any

export function AuctionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [bids, setBids] = useState<Bid[]>([])

  // these can stay local for now
  const [favorites, setFavorites] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // caches to enrich bids/users
  const usersByIdRef = useRef<Map<number, ServerUser>>(new Map())

  // ----------------------------
  // Local-only persistence (fav/cart)
  // ----------------------------
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    const storedCart = localStorage.getItem("cartItems")
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    if (storedCart) setCartItems(JSON.parse(storedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  // ----------------------------
  // Helpers: mapping server -> client
  // ----------------------------
  function mapAuctionToProduct(a: ServerAuction): Product {
    // Your Auction model uses: title, description, category, condition, starting_price, current_price, end_date, status, user_id
    return {
      id: String(a.id),
      name: a.title ?? "",
      description: a.description ?? "",
      condition: a.condition ?? "",
      startingPrice: Number(a.starting_price ?? 0),
      currentPrice: Number(a.current_price ?? a.starting_price ?? 0),
      category: a.category ?? "Other",
      imageUrl: a.image_url ?? "",

      sellerId: String(a.user_id ?? ""),
      sellerName: a.user?.username ?? "Seller",

      status: normalizeStatus(a.status),
      createdAt: a.created_at ?? new Date().toISOString(),
      endDate: a.end_date ?? new Date().toISOString(),
      reviews: a.reviews ?? [],
    }
  }

  function normalizeStatus(s: any): ProductStatus {
    if (s === "pending") return "pending"
    if (s === "active") return "active"
    if (s === "sold") return "sold"
    if (s === "closed") return "closed"
    // default fallback
    return "pending"
  }

  function mapBidToClient(b: ServerBid): Bid {
    const u = usersByIdRef.current.get(Number(b.user_id))
    return {
      id: String(b.id),
      productId: String(b.auction_id),
      userId: String(b.user_id),
      username: u?.username ?? "User",
      email: u?.email ?? "",
      amount: Number(b.bid_amount ?? 0),
      timestamp: b.created_at ?? new Date().toISOString(),
    }
  }

  async function safeJson(res: Response) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  // ----------------------------
  // Load users (for bid enrichment)
  // ----------------------------
  // async function loadUsers(): Promise<void> {
  //   const res = await fetch(`${API_URL}/users`, { credentials: "include" })
  //   if (!res.ok) return

  //   const serverUsers = (await res.json()) as ServerUser[]
  //   const map = new Map<number, ServerUser>()
  //   for (const u of serverUsers) map.set(Number(u.id), u)
  //   usersByIdRef.current = map
  // }


  async function loadUsers(): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/users`, { credentials: "include" })
    if (!res.ok) return

    const serverUsers = (await res.json()) as ServerUser[]
    const map = new Map<number, ServerUser>()
    for (const u of serverUsers) map.set(Number(u.id), u)
    usersByIdRef.current = map
  } catch (e) {
    console.warn("loadUsers failed; continuing without user enrichment:", e)
    // Leave usersByIdRef as-is; bids will show fallback username/email
  }
}

  // ----------------------------
  // Load auctions + bids from DB
  // ----------------------------
  async function loadAuctions(): Promise<void> {
    const res = await fetch(`${API_URL}/auctions`, { credentials: "include" })
    if (!res.ok) return

    const auctions = await res.json()
    setProducts(auctions.map(mapAuctionToProduct))
  }

  async function loadBids(): Promise<void> {
    const res = await fetch(`${API_URL}/bids`, { credentials: "include" })
    if (!res.ok) return

    const serverBids = await res.json()
    setBids(serverBids.map(mapBidToClient))
  }

  // const reloadAll = async () => {
  //   try {
  //     await loadUsers()
  //     await Promise.all([loadAuctions(), loadBids()])
  //   } catch (e) {
  //     console.error("reloadAll failed:", e)
  //   }
  // }


  const reloadAll = async () => {
  try {
    await loadUsers() // may fail, but will not throw now
    await Promise.all([loadAuctions(), loadBids()])
  } catch (e) {
    console.error("reloadAll failed:", e)
  }
}

  useEffect(() => {
    // initial load
    reloadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------------------
  // DB-backed actions
  // ----------------------------

  // Seller uploads product -> POST /api/auctions
  const addProduct = async (product: AddProductInput) => {
    if (!user) return { success: false, error: "Not logged in" }

    try {
      const payload = {
        title: product.name,
        description: product.description,
        category: product.category,
        condition: product.condition,
        starting_price: product.startingPrice,
        end_date: product.endDate, // ISO string expected
        user_id: Number(user.id),
        // You can add image_url in backend later if you add it to model
      }

      const res = await fetch(`${API_URL}/auctions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await safeJson(res)
        return { success: false, error: err?.error ?? `Failed to create auction (${res.status})` }
      }

      // refresh list from DB
      await reloadAll()
      return { success: true }
    } catch (e) {
      console.error("addProduct error:", e)
      return { success: false, error: "Network/CORS error creating auction" }
    }
  }

  // NOTE: your backend currently does NOT have PATCH /api/auctions/<id>
  // This function will work only after you add PATCH support (I provide backend code below).
  const updateProductStatus = async (productId: string, status: ProductStatus) => {
    if (!user) return { success: false, error: "Not logged in" }
    if (user.role !== "admin") return { success: false, error: "Admin only" }

    try {
      const res = await fetch(`${API_URL}/auctions/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const err = await safeJson(res)
        return { success: false, error: err?.error ?? `Failed to update (${res.status})` }
      }

      await reloadAll()
      return { success: true }
    } catch (e) {
      console.error("updateProductStatus error:", e)
      return { success: false, error: "Network/CORS error updating auction" }
    }
  }

  const approveAuction = async (productId: string) =>
  updateProductStatus(productId, "active")

  const closeAuction = async (productId: string) =>
  updateProductStatus(productId, "closed")


  // Place bid -> POST /api/bids (PERSISTS IN DB)
  // const placeBid = async (productId: string, amount: number) => {
  //   if (!user) return { success: false, error: "Not logged in" }

  //   const product = products.find((p) => p.id === productId)
  //   if (!product) return { success: false, error: "Auction not found" }
  //   if (product.status !== "active") return { success: false, error: "Auction is not active" }
  //   if (amount <= product.currentPrice) return { success: false, error: "Bid must be higher than current price" }

  //   try {
  //     const res = await fetch(`${API_URL}/bids`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         auction_id: Number(productId),
  //         user_id: Number(user.id),
  //         bid_amount: amount,
  //       }),
  //     })

  //     if (!res.ok) {
  //       const err = await safeJson(res)
  //       return { success: false, error: err?.error ?? `Bid failed (${res.status})` }
  //     }

  //     // Backend updates auction.current_price; we reflect immediately + refresh bids
  //     setProducts((prev) =>
  //       prev.map((p) => (p.id === productId ? { ...p, currentPrice: amount } : p))
  //     )

  //     // Refresh bids list from DB so everyone sees it
  //     await loadUsers()
  //     await loadBids()

  //     return { success: true }
  //   } catch (e) {
  //     console.error("placeBid error:", e)
  //     return { success: false, error: "Network/CORS error placing bid" }
  //   }
  // }


  // Place bid -> POST /api/bids (PERSISTS IN DB)
const placeBid = async (productId: string, amount: number) => {
  if (!user) return { success: false, error: "Not logged in" }

  const product = products.find((p) => p.id === productId)
  if (!product) return { success: false, error: "Auction not found" }
  if (product.status !== "active") return { success: false, error: "Auction is not active" }

  const bidAmount = Math.floor(Number(amount))
  if (!Number.isFinite(bidAmount)) return { success: false, error: "Invalid bid amount" }
  if (bidAmount <= product.currentPrice) return { success: false, error: "Bid must be higher than current price" }

  try {
    const res = await fetch(`${API_URL}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        auction_id: Number(productId),
        user_id: Number(user.id),
        bid_amount: bidAmount,
      }),
    })

    if (!res.ok) {
      const err = await safeJson(res)
      return { success: false, error: err?.error ?? `Bid failed (${res.status})` }
    }

    // IMPORTANT: use server response as source of truth
    const createdBid = await res.json()

    // 1) refresh auctions so UI matches DB current_price
    await loadAuctions()
    await reloadAll()

    // 2) refresh users + bids so bid list updates
    await loadUsers()
    await loadBids()

    return { success: true }
  } catch (e) {
    console.error("placeBid error:", e)
    return { success: false, error: "Network/CORS error placing bid" }
  }
}

  // ----------------------------
  // Local utilities (unchanged)
  // ----------------------------
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const getProductBids = (productId: string) => {
    return bids
      .filter((b) => b.productId === productId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const addToCart = (productId: string) => {
    if (!user) return
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const cartItem: CartItem = {
      id: `cart-${Date.now()}`,
      productId,
      userId: String(user.id),
      productName: product.name,
      finalPrice: product.currentPrice,
      imageUrl: product.imageUrl,
      addedAt: new Date().toISOString(),
    }

    setCartItems((prev) => [...prev, cartItem])
  }

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
  }

  // Optional: You can keep a local expiry checker, but DB should ultimately own this.
  const checkAuctionExpiry = () => {
    // You can implement server-side expiry later (cron/job) and just reloadAll() here.
  }

  const value = useMemo(
  () => ({
    products,
    bids,
    favorites,
    cartItems,

    reloadAll,
    addProduct,
    updateProductStatus,
    approveAuction,
    closeAuction,
    placeBid,

    toggleFavorite,
    getProductBids,
    addToCart,
    removeFromCart,
    checkAuctionExpiry,
  }),
  [products, bids, favorites, cartItems]
)


  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}

export function useAuction() {
  const ctx = useContext(AuctionContext)
  if (!ctx) throw new Error("useAuction must be used within AuctionProvider")
  return ctx
}
