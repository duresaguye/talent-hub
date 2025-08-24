"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Plus, Briefcase, Users } from "lucide-react"

interface EmployerSidebarProps {
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
    id: "post-job",
    label: "Post a Job",
    icon: Plus,
  },
  {
    id: "my-jobs",
    label: "My Jobs",
    icon: Briefcase,
  },
  {
    id: "applications",
    label: "Applications",
    icon: Users,
  },
]

export function EmployerSidebar({ activeTab, onTabChange }: EmployerSidebarProps) {
  return (
    <div className="w-64 bg-card border-r min-h-screen p-6">
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
