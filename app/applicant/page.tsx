"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { ApplicantSidebar } from "@/components/applicant-sidebar"
import { MyApplicationsTable } from "@/components/my-applications-table"
import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp, User } from "lucide-react"

// Mock data for applicant dashboard
const dashboardStats = {
  totalApplications: 15,
  pendingApplications: 8,
  shortlisted: 4,
  rejected: 3,
  profileCompletion: 85,
}

const recentActivity = [
  {
    id: 1,
    action: "Applied to Senior Frontend Developer at TechCorp Inc.",
    date: "2 hours ago",
    type: "application",
  },
  {
    id: 2,
    action: "Shortlisted for Product Manager at StartupXYZ",
    date: "1 day ago",
    type: "shortlisted",
  },
  {
    id: 3,
    action: "Profile viewed by Design Studio",
    date: "2 days ago",
    type: "profile_view",
  },
  {
    id: 4,
    action: "Applied to UX Designer at Design Studio",
    date: "3 days ago",
    type: "application",
  },
]

const recommendedJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "WebTech Solutions",
    location: "Remote",
    salary: "$90k - $120k",
    match: 95,
  },
  {
    id: 2,
    title: "React Developer",
    company: "StartupABC",
    location: "San Francisco, CA",
    salary: "$100k - $130k",
    match: 88,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "DevCorp",
    location: "New York, NY",
    salary: "$110k - $140k",
    match: 82,
  },
]

export default function ApplicantDashboard() {
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
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.shortlisted}</div>
                  <p className="text-xs text-muted-foreground">Great progress!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{dashboardStats.rejected}</div>
                  <p className="text-xs text-muted-foreground">Keep trying!</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Completion
                  </CardTitle>
                  <CardDescription>Complete your profile to get better job matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Strength</span>
                      <span>{dashboardStats.profileCompletion}%</span>
                    </div>
                    <Progress value={dashboardStats.profileCompletion} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic information added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Work experience added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Add skills and certifications</span>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest job search activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="mt-1">
                          {activity.type === "application" && <Briefcase className="h-4 w-4 text-blue-500" />}
                          {activity.type === "shortlisted" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {activity.type === "profile_view" && <User className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>Jobs that match your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">{job.salary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Match:</span>
                            <Badge variant="secondary" className="text-xs">
                              {job.match}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    View More Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "applications":
        return <MyApplicationsTable />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <ApplicantSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "applications" && "My Applications"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "dashboard" && "Track your job search progress and discover new opportunities"}
                {activeTab === "applications" && "View and manage your job applications"}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
