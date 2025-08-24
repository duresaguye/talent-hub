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
import { Users, Briefcase, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { stats, loading: statsLoading, error: statsError, fetchStats } = useAdmin()

  useEffect(() => {
    fetchStats()
  }, [])

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.usersByRole?.APPLICANT || 0} job seekers, {stats?.usersByRole?.EMPLOYER || 0} employers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalJobs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.jobsByStatus?.ACTIVE || 0} active, {stats?.jobsByStatus?.DRAFT || 0} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalApplications || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.applicationsByStatus?.APPLIED || 0} new, {stats?.applicationsByStatus?.SHORTLISTED || 0} shortlisted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : "Good"}
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New job posted</p>
                <p className="text-xs text-muted-foreground">Senior Developer at TechCorp</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson (Job Seeker)</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job flagged for review</p>
                <p className="text-xs text-muted-foreground">Suspicious job posting detected</p>
              </div>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Application submitted</p>
                <p className="text-xs text-muted-foreground">Michael Chen applied for Product Manager</p>
              </div>
              <span className="text-xs text-muted-foreground">8 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("jobs")}>
              <Briefcase className="h-6 w-6 mb-2" />
              <span>Manage Jobs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("users")}>
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("applications")}>
              <FileText className="h-6 w-6 mb-2" />
              <span>View Applications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "jobs":
        return <AdminJobsTable />
      case "users":
        return <AdminUsersTable />
      case "applications":
        return <AdminApplicationsTable />
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage the TalentHub platform and monitor user activity
              </p>
            </div>

            {statsError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error loading statistics: {statsError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => fetchStats()}
                >
                  Retry
                </Button>
              </div>
            )}

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
