"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { EmployerSidebar } from "@/components/employer-sidebar"
import { PostJobForm } from "@/components/post-job-form"
import { MyJobsTable } from "@/components/my-jobs-table"
import { ApplicationsTable } from "@/components/applications-table"
import { Users, Briefcase, Eye, TrendingUp } from "lucide-react"

// Mock data for employer dashboard
const dashboardStats = {
  totalJobs: 12,
  activeJobs: 8,
  totalApplications: 156,
  newApplications: 23,
}

const recentApplications = [
  {
    id: 1,
    applicantName: "Sarah Johnson",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2 hours ago",
    status: "new",
  },
  {
    id: 2,
    applicantName: "Michael Chen",
    jobTitle: "Product Manager",
    appliedDate: "5 hours ago",
    status: "reviewed",
  },
  {
    id: 3,
    applicantName: "Emily Davis",
    jobTitle: "UX Designer",
    appliedDate: "1 day ago",
    status: "shortlisted",
  },
]

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalJobs}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Currently hiring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.newApplications}</div>
                  <p className="text-xs text-muted-foreground">Needs review</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest applications received for your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{application.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">{application.appliedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            application.status === "new"
                              ? "default"
                              : application.status === "reviewed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {application.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Applications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "post-job":
        return <PostJobForm />

      case "my-jobs":
        return <MyJobsTable />

      case "applications":
        return <ApplicationsTable />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <EmployerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "post-job" && "Post a Job"}
                {activeTab === "my-jobs" && "My Jobs"}
                {activeTab === "applications" && "Applications"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "dashboard" && "Overview of your hiring activity"}
                {activeTab === "post-job" && "Create a new job posting"}
                {activeTab === "my-jobs" && "Manage your job postings"}
                {activeTab === "applications" && "Review candidate applications"}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
