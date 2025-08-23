"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react"

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
    <div className="w-64 bg-card border-r min-h-screen p-6">
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
  )
}
