"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Plus, Briefcase, Users, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface EmployerSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats"
  },
  {
    id: "post-job",
    label: "Post a Job",
    icon: Plus,
    description: "Create new job"
  },
  {
    id: "my-jobs",
    label: "My Jobs",
    icon: Briefcase,
    description: "Manage postings"
  },
  {
    id: "applications",
    label: "Applications",
    icon: Users,
    description: "Review candidates"
  },
]

export function EmployerSidebar({ activeTab, onTabChange }: EmployerSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900 dark:to-slate-800 border-r border-emerald-200 dark:border-emerald-700 min-h-screen">
        <div className="p-6 border-b border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employer Hub</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Talent Management</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-700/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-emerald-100 dark:bg-emerald-700 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-600"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Employer Hub</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Talent Management</p>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[320px] p-0 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900 dark:to-slate-800 border-emerald-200 dark:border-emerald-700"
            >
              <div className="p-6 border-b border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employer Hub</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Navigation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                          isActive 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" 
                            : "text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-700/50 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          isActive 
                            ? "bg-white/20" 
                            : "bg-emerald-100 dark:bg-emerald-700 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-600"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className={cn(
                            "text-xs truncate",
                            isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                          )}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
