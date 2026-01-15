"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Gavel, Heart, Package, ShieldCheck, ShoppingCart } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const buyerLinks = [
    { href: "/dashboard", label: "Live Auctions", icon: Gavel },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
  ]

  const sellerLinks = [
    { href: "/dashboard", label: "Live Auctions", icon: Gavel },
    { href: "/dashboard/my-listings", label: "My Listings", icon: Package },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "All Auctions", icon: Gavel },
    { href: "/dashboard/admin", label: "Admin Panel", icon: ShieldCheck },
  ]

  const links = user?.role === "admin" ? adminLinks : user?.role === "seller" ? sellerLinks : buyerLinks

  return (
    <aside className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
