"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminJobsTable } from "@/components/admin-jobs-table"
import { AdminApplicationsTable } from "@/components/admin-applications-table"
import { AdminUsersTable } from "@/components/admin-users-table"
import { Users, Briefcase, FileText, Building, TrendingUp, AlertCircle,  Star } from "lucide-react"
import { useJobs, useApplications } from "@/hooks/useJobs"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAuth()
  const router = useRouter()
  const { jobs, loading: jobsLoading, error: jobsError, fetchJobs } = useJobs()
  const { applications, loading: applicationsLoading, error: applicationsError, fetchMyApplications } = useApplications()
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    newUsersThisWeek: 0,
    newJobsThisWeek: 0,
  })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/unauthorized')
      return
    }

    if (activeTab === 'dashboard' || activeTab === 'jobs') {
      fetchJobs({ status: 'ACTIVE' })
    }
    if (activeTab === 'dashboard' || activeTab === 'applications') {
      fetchMyApplications()
    }
  }, [user, activeTab])

  useEffect(() => {
    if (jobs.length > 0 || applications.length > 0) {
      const activeJobs = jobs.filter(job => job.status === 'ACTIVE')
      const pendingApplications = applications.filter(app => app.status === 'APPLIED').length
      
      setAdminStats({
        totalUsers: 2847, // This would come from a users API
        totalEmployers: 156, // This would come from a users API filtered by role
        totalJobs: jobs.length,
        totalApplications: applications.length,
        activeJobs: activeJobs.length,
        pendingApplications,
        newUsersThisWeek: 47, // This would come from a users API with date filter
        newJobsThisWeek: jobs.filter(job => {
          const jobDate = new Date(job.createdAt)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return jobDate > weekAgo
        }).length,
      })
    }
  }, [jobs, applications])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{adminStats.newUsersThisWeek} this week</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{adminStats.totalJobs}</div>
                      <p className="text-xs text-muted-foreground">+{adminStats.newJobsThisWeek} this week</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{adminStats.totalApplications.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{adminStats.pendingApplications} pending</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employers</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{adminStats.totalEmployers}</div>
                      <p className="text-xs text-muted-foreground">Active companies</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Health
                  </CardTitle>
                  <CardDescription>Key metrics and system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Jobs</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">{adminStats.activeJobs}</Badge>
                      <span className="text-sm text-muted-foreground">of {adminStats.totalJobs}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Job Success Rate</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Satisfaction</span>
                    <Badge variant="secondary">4.6/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Uptime</span>
                    <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest platform activities and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Recent activity data would be fetched from an API */}
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">New employer registered: TechCorp Inc.</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        <Briefcase className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">Job posted: Senior Frontend Developer</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        <FileText className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">Application submitted for Product Manager role</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">User reported inappropriate job posting</p>
                        <p className="text-xs text-muted-foreground">8 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Briefcase className="h-6 w-6" />
                    Review Jobs
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <FileText className="h-6 w-6" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <AlertCircle className="h-6 w-6" />
                    Handle Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "users":
        return <AdminUsersTable />

      case "jobs":
        return <AdminJobsTable />

      case "applications":
        return <AdminApplicationsTable />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "dashboard" && "Admin Dashboard"}
                {activeTab === "users" && "User Management"}
                {activeTab === "jobs" && "Job Management"}
                {activeTab === "applications" && "Application Management"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "dashboard" && "Monitor platform performance and manage TalentHub"}
                {activeTab === "users" && "Manage user accounts and permissions"}
                {activeTab === "jobs" && "Review and moderate job postings"}
                {activeTab === "applications" && "Monitor job applications and user activity"}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
