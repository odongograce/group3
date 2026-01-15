import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing-navbar"
import { ArrowRight, Gavel, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Give Items a Second Life,
              <br />
              <span className="text-primary">Discover Treasures</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Join ecoFind, the sustainable marketplace where second-hand items find new homes through exciting live
              auctions. Buy pre-loved treasures, sell responsibly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="text-lg h-12 px-8">
                <Link href="/auctions">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-12 px-8 bg-transparent">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/auctions" className="group">
              <div className="relative overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
                  alt="Vintage Watch"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-semibold">Vintage Watches</span>
                </div>
              </div>
            </Link>
            <Link href="/auctions" className="group">
              <div className="relative overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"
                  alt="Vintage Camera"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-semibold">Cameras</span>
                </div>
              </div>
            </Link>
            <Link href="/auctions" className="group">
              <div className="relative overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop"
                  alt="Sneakers"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-semibold">Sneakers</span>
                </div>
              </div>
            </Link>
            <Link href="/auctions" className="group">
              <div className="relative overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                  alt="Headphones"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-semibold">Electronics</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Why Choose ecoFind</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                <Gavel className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Live Bidding</h3>
              <p className="text-muted-foreground text-pretty">
                Real-time auction action with instant bid updates and notifications
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Secure Platform</h3>
              <p className="text-muted-foreground text-pretty">
                Protected transactions with verified sellers and buyer guarantees
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Sustainable Choice</h3>
              <p className="text-muted-foreground text-pretty">
                Reduce waste by giving pre-loved items a second life through our marketplace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">Ready to Start Bidding?</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Join thousands of buyers and sellers in the most exciting sustainable marketplace
          </p>
          <Button size="lg" asChild className="text-lg h-12 px-8">
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2026 ecoFind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
