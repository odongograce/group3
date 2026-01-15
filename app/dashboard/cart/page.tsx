"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAuction } from "@/contexts/auction-context"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Trash2 } from "lucide-react"

export default function CartPage() {
  const { user, isAuthenticated } = useAuth()
  const { cartItems, removeFromCart } = useAuction()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const userCartItems = cartItems.filter((item) => item.userId === user.id)
  const total = userCartItems.reduce((sum, item) => sum + item.finalPrice, 0)

  const handleCheckout = () => {
    alert("Checkout functionality would be implemented here with payment integration")
    // In a real app, this would integrate with Stripe or another payment provider
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">Review your won auctions and proceed to checkout</p>
            </div>

            {userCartItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-4">Win some auctions to add items to your cart</p>
                  <Button onClick={() => router.push("/dashboard")}>Browse Auctions</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {userCartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Won on {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-bold text-primary mt-1">${item.finalPrice}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
