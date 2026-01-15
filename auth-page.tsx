import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import Image from 'next/image'
import { Github, Mail, Menu } from 'lucide-react'

export default function AuthPage() {
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign in with:', signInEmail, signInPassword)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up with:', signUpName, signUpEmail, signUpPassword)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <header className="bg-[#1a1a1a] text-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <span className="sr-only">Perses</span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xM7CkjKnNjJxtjZ0f9BNYSqFV0FMt1.png"
                  alt="Perses Logo"
                  width={110}
                  height={28}
                  className="h-7 w-auto sm:h-9"
                />
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="/discover" className="text-base font-medium text-gray-300 hover:text-white">
                Discover
              </Link>
              <Link href="/publish" className="text-base font-medium text-gray-300 hover:text-white">
                Publish
              </Link>
              <Link href="/about" className="text-base font-medium text-gray-300 hover:text-white">
                About
              </Link>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link href="/login" className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-white">
                Sign in
              </Link>
              <Link href="/signup" className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#1a1a1a] bg-white hover:bg-gray-200">
                Sign up
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] text-white">
                  <DropdownMenuItem>
                    <Link href="/discover" className="text-white hover:text-gray-300">Discover</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/publish" className="text-white hover:text-gray-300">Publish</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/about" className="text-white hover:text-gray-300">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/login" className="text-white hover:text-gray-300">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/signup" className="text-white hover:text-gray-300">Sign up</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow relative z-10 flex items-center justify-center py-20">
        <Card className="w-full max-w-md bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to Perses</CardTitle>
            <CardDescription className="text-center">Sign in or create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#DF005D] hover:bg-[#C30051]">
                    Sign In
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link href="/forgot-password" className="text-sm text-[#DF005D] hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Your name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#DF005D] hover:bg-[#C30051]">
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <Separator className="my-4" />
            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={() => console.log('Sign in/up with Google')}>
                <Image src="/google-logo.svg" alt="Google logo" width={20} height={20} className="mr-2" />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => console.log('Sign in/up with GitHub')}>
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="relative z-10 bg-[#1a1a1a] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="mb-2 sm:mb-0">
              © {new Date().getFullYear()} Perses. All rights reserved.
            </div>
            <nav className="flex space-x-4">
              <Link href="/terms" className="text-gray-300 hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
