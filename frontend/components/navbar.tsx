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

    // Logged in users: Show role-specific navigation
    switch (user?.role) {
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
                        <p className="text-xs leading-none text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.role === 'EMPLOYER' && (
                      <DropdownMenuItem asChild>
                        <Link href="/employer" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Employer Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'APPLICANT' && (
                      <DropdownMenuItem asChild>
                        <Link href="/applicant" className="flex items-center">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Applicant Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'ADMIN' && (
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[380px] p-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700"
              >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary to-secondary">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">TalentHub</h2>
                      <p className="text-sm text-white/80">Navigation Menu</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Mobile Navigation Links */}
                  {navigationItems.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Navigation
                      </h3>
                      <div className="space-y-1">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white font-medium transition-all duration-200 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-2 h-2 rounded-full bg-primary/60 mr-3 group-hover:bg-primary transition-colors"></div>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Auth Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info Card */}
                        <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                              <div className="flex items-center mt-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 capitalize font-medium">{user?.role}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Quick Actions
                          </h3>
                          <div className="space-y-1">
                            {user?.role === 'EMPLOYER' && (
                              <Link
                                href="/employer"
                                className="flex items-center px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-all duration-200 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <div className="text-sm">Employer Dashboard</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Manage jobs & candidates</div>
                                </div>
                              </Link>
                            )}
                            {user?.role === 'APPLICANT' && (
                              <Link
                                href="/applicant"
                                className="flex items-center px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium transition-all duration-200 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                  <div className="text-sm">Applicant Dashboard</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Track applications</div>
                                </div>
                              </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                className="flex items-center px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-all duration-200 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm">Admin Dashboard</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Platform management</div>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                        
                        {/* Logout Button */}
                        <div className="pt-2">
                          <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Get Started
                        </h3>
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            asChild 
                            className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                          >
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                              <User className="mr-2 h-4 w-4" />
                              Sign In
                            </Link>
                          </Button>
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                              <Sparkles className="mr-2 h-4 w-4" />
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