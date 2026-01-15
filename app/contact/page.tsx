"use client"

import React from "react"
import { LandingNavbar } from "@/components/landing-navbar"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, Clock, MessageSquare, Truck, ShieldCheck, RefreshCcw } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Customer Support</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Need help with an order? Our team is available to assist you with tracking, 
              returns, and product inquiries.
            </p>
          </div>

          {/* Contact Channels */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:border-primary transition-all">
              <CardHeader className="space-y-1">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Best for order inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:support@ecofind.com" className="text-primary font-bold hover:underline">
                  support@ecofind.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-accent transition-all">
              <CardHeader className="space-y-1">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Phone & WhatsApp</CardTitle>
                <CardDescription>Mon-Fri, 8am - 6pm</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="tel:+254740984673" className="text-accent font-bold hover:underline">
                  +254 740 984 673
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:border-primary transition-all">
              <CardHeader className="space-y-1">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Available for quick help</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-medium">Coming Soon</p>
              </CardContent>
            </Card>
          </div>

          {/* Shop Policy / FAQ Quick Links */}
          <div className="bg-muted/50 rounded-2xl p-8 border">
            <h2 className="text-2xl font-bold mb-8 text-center">Helpful Resources</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <Truck className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold">Shipping Info</h3>
                <p className="text-sm text-muted-foreground">Track your package or view delivery times for Nairobi and beyond.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <RefreshCcw className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold">Returns & Refunds</h3>
                <p className="text-sm text-muted-foreground">Not happy with your purchase? Start a return within 14 days.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">Learn about our M-Pesa and card payment encryption.</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center border-t pt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Average Response Time: 2 Hours</span>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}