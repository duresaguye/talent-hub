"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-foreground font-heading tracking-tight">TalentHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
            >
              Jobs
            </Link>
            <Link
              href="/employer"
              className="text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
            >
              For Employers
            </Link>
            <Link
              href="/applicant"
              className="text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" asChild className="font-medium">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
