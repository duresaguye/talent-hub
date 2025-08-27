"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles, User, LogOut, Briefcase, UserCheck, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    // Redirect to home page after logout
    window.location.href = '/'
  }

  // Navigation items based on authentication and userType
  const getNavigationItems = () => {
    if (!isAuthenticated) {
      // Not logged in: Only Jobs
      return [
        { href: "/jobs", label: "Jobs" },
      ]
    }

    // Logged in users: Show userType-specific navigation
    switch (user?.userType) {
      case 'EMPLOYER':
        return [
          { href: "/employer", label: "Dashboard" }, // Only EMPLOYER sees Dashboard
        ]
      case 'APPLICANT':
        return [
          { href: "/jobs", label: "Jobs" }, // Only APPLICANT sees Jobs
          { href: "/applicant", label: "Dashboard" }, // Applicant's dashboard
        ]
      case 'ADMIN':
        return [
          { href: "/admin", label: "Dashboard" }, // Admin's dashboard
        ]
      default:
        return [
          { href: "/jobs", label: "Jobs" },
        ]
    }
  }

  const navigationItems = getNavigationItems()

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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            
            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user?.firstName} {user?.lastName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">{user?.userType}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.userType === 'EMPLOYER' && (
                      <DropdownMenuItem asChild>
                        <Link href="/employer" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Employer Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.userType === 'APPLICANT' && (
                      <DropdownMenuItem asChild>
                        <Link href="/applicant" className="flex items-center">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Applicant Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.userType === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild className="font-medium">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-lg font-bold">TalentHub</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-6">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </h3>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center py-2 text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="space-y-4 pt-4 border-t">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Account
                          </h3>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.userType}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Quick Actions
                          </h3>
                          <div className="space-y-2">
                            {user?.userType === 'EMPLOYER' && (
                              <Link
                                href="/employer"
                                className="flex items-center py-2 text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Employer Dashboard
                              </Link>
                            )}
                            {user?.userType === 'APPLICANT' && (
                              <Link
                                href="/applicant"
                                className="flex items-center py-2 text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Applicant Dashboard
                              </Link>
                            )}
                            {user?.userType === 'ADMIN' && (
                              <Link
                                href="/admin"
                                className="flex items-center py-2 text-foreground/70 hover:text-primary font-medium transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Admin Dashboard
                              </Link>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Account
                        </h3>
                        <div className="space-y-3">
                          <Button variant="outline" asChild className="w-full">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                              Login
                            </Link>
                          </Button>
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold"
                          >
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                              Get Started
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}