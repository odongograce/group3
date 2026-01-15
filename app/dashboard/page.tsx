// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/contexts/auth-context"
// import AuthGuard from "@/components/auth-guard"
// import { useAuction } from "@/contexts/auction-context"
// import { DashboardNavbar } from "@/components/dashboard-navbar"
// import { DashboardSidebar } from "@/components/dashboard-sidebar"
// import { ProductCard } from "@/components/product-card"
// import { Button } from "@/components/ui/button"
// import { Package } from "lucide-react"

// export default function DashboardPage() {
//   const router = useRouter()
//   const { user, loading } = useAuth()
//   const { products } = useAuction()

//   // Redirect admins away from /dashboard
//   useEffect(() => {
//     if (loading) return
//     if (user?.role === "admin") router.replace("/admin")
//   }, [loading, user, router])

//   const activeProducts = products.filter((p) => p.status === "active")

//   return (
//     <AuthGuard allow={["buyer", "seller", "admin"]}>
//       <div className="min-h-screen bg-background">
//         <DashboardNavbar />

//         <div className="flex">
//           <DashboardSidebar />

//           <main className="flex-1 p-6">
//             <div className="max-w-7xl mx-auto space-y-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold">Live Auctions</h1>
//                   <p className="text-muted-foreground">Browse and bid on active auctions</p>
//                 </div>

//                 {user?.role === "seller" && (
//                   <Button onClick={() => router.push("/dashboard/upload")}>
//                     <Package className="mr-2 h-4 w-4" />
//                     Upload Product
//                   </Button>
//                 )}
//               </div>

//               {activeProducts.length === 0 ? (
//                 <div className="text-center py-12 bg-card rounded-lg border border-border">
//                   <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No Active Auctions</h3>
//                   <p className="text-muted-foreground">Check back later for new items</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {activeProducts.map((product) => (
//                     <ProductCard key={product.id} product={product} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }



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

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { products, reloadAll } = useAuction()

  // Ensure we have fresh DB data when entering dashboard
  useEffect(() => {
    reloadAll?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auth guard (client-side)
  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/login")
    // If admin lands here, redirect to admin page
    if (user?.role === "admin") router.replace("/admin")
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) return null

  // ROLE-BASED VISIBILITY
  const visibleProducts = products.filter((p) => {
    // Buyers see only approved/active auctions
    if (user.role === "buyer") return p.status === "active"

    // Sellers see active auctions + THEIR OWN pending auctions
    if (user.role === "seller") {
      return p.status === "active" || (p.status === "pending" && p.sellerId === String(user.id))
    }

    // Admins see everything (though we redirect them away above)
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Live Auctions</h1>
                <p className="text-muted-foreground">
                  {user.role === "buyer"
                    ? "Browse and bid on active auctions"
                    : user.role === "seller"
                    ? "View active auctions and your pending listings"
                    : "Manage auctions"}
                </p>
              </div>

              {user.role === "seller" && (
                <Button onClick={() => router.push("/dashboard/upload")}>
                  <Package className="mr-2 h-4 w-4" />
                  Upload Product
                </Button>
              )}
            </div>

            {visibleProducts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Auctions Available</h3>
                <p className="text-muted-foreground">
                  {user.role === "buyer"
                    ? "No approved auctions yet. Check back later."
                    : user.role === "seller"
                    ? "You have no active auctions and no pending listings."
                    : "No auctions found."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product) => (
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
