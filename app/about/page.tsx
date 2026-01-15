import { LandingNavbar } from "@/components/landing-navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Users, Heart, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">About ecoFind</h1>
            <p className="text-xl text-muted-foreground">
              Building a sustainable future through second-hand marketplace innovation
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              ecoFinds was founded with a simple yet powerful mission: to reduce waste and promote sustainability by
              giving pre-loved items a second life. We believe that every item has a story and deserves another chapter.
            </p>

            <div className="grid md:grid-cols-2 gap-6 not-prose my-12">
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sustainability First</h3>
                <p className="text-muted-foreground">
                  Every transaction on ecoFind helps reduce waste and promotes circular economy principles.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Community Driven</h3>
                <p className="text-muted-foreground">
                  Our platform connects conscious buyers and sellers who care about the environment.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Quality & Trust</h3>
                <p className="text-muted-foreground">
                  Every item is reviewed by our team to ensure quality and authenticity for our community.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Fair Marketplace</h3>
                <p className="text-muted-foreground">
                  Our auction system ensures transparent pricing and fair opportunities for all participants.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Our Story</h2>
            <p className="text-lg leading-relaxed">
              Started in 2026, ecoFind emerged from the vision of creating a platform where sustainability meets
              technology. We saw the potential in combining the excitement of live auctions with the environmental
              benefits of buying and selling second-hand items.
            </p>

            <p className="text-lg leading-relaxed">
              Today, we're proud to serve a growing community of environmentally conscious individuals who believe in
              making smart, sustainable choices. Every item sold on ecoFind is a step towards a greener planet.
            </p>
          </div>

          <div className="text-center pt-8">
            <Button size="lg" asChild>
              <Link href="/signup">Join Our Community</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
