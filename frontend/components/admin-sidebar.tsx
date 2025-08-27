"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Briefcase, FileText, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    id: "applications",
    label: "Applications",
    icon: FileText,
  },
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-card border-r min-h-screen p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Platform Management</p>
        </div>
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn("w-full justify-start", activeTab === item.id && "bg-primary text-primary-foreground")}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Mobile header with drawer */}
      <div className="md:hidden p-4 border-b w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Platform Management</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={cn("w-full justify-start", activeTab === item.id && "bg-primary text-primary-foreground")}
                      onClick={() => onTabChange(item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
