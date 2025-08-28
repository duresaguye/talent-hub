"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface ApplicantSidebarProps {
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
    id: "applications",
    label: "My Applications",
    icon: FileText,
    description: "Track applications"
  },
]

export function ApplicantSidebar({ activeTab, onTabChange }: ApplicantSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-slate-800 border-r border-indigo-200 dark:border-indigo-700 min-h-screen">
        <div className="p-6 border-b border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Portal</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Career Journey</p>
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
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-700/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-indigo-100 dark:bg-indigo-700 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-indigo-600 dark:text-indigo-400"
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
        <div className="flex items-center justify-between p-4 border-b border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Applicant Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Career Journey</p>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[320px] p-0 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-slate-800 border-indigo-200 dark:border-indigo-700"
            >
              <div className="p-6 border-b border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Portal</h2>
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
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" 
                            : "text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-700/50 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          isActive 
                            ? "bg-white/20" 
                            : "bg-indigo-100 dark:bg-indigo-700 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            isActive ? "text-white" : "text-indigo-600 dark:text-indigo-400"
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
