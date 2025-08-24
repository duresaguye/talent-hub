"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { EmployerSidebar } from "@/components/employer-sidebar"
import { PostJobForm } from "@/components/post-job-form"
import { MyJobsTable } from "@/components/my-jobs-table"
import { ApplicationsTable } from "@/components/applications-table"
import { Users, Briefcase, Eye, TrendingUp,  Star } from "lucide-react"
import { useEmployerJobs } from "@/hooks/useJobs"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAuth()
  const router = useRouter()
  const { jobs, loading: jobsLoading, error: jobsError, fetchMyJobs } = useEmployerJobs()
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
  })

  useEffect(() => {
    if (user?.role !== 'EMPLOYER') {
      router.push('/unauthorized')
      return
    }

    if (activeTab === 'dashboard' || activeTab === 'my-jobs') {
      fetchMyJobs()
    }
  }, [user, activeTab])

  useEffect(() => {
    if (jobs.length > 0) {
      const activeJobs = jobs.filter(job => job.status === 'ACTIVE')
      const totalApplications = jobs.reduce((sum, job) => sum + job.applicationsCount, 0)
      
      setDashboardStats({
        totalJobs: jobs.length,
        activeJobs: activeJobs.length,
        totalApplications,
        newApplications: Math.floor(totalApplications * 0.15), // Mock new applications
      })
    }
  }, [jobs])

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
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.totalJobs}</div>
                      <p className="text-xs text-muted-foreground">Your job postings</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.activeJobs}</div>
                      <p className="text-xs text-muted-foreground">Currently hiring</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
                      <p className="text-xs text-muted-foreground">Across all jobs</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.newApplications}</div>
                      <p className="text-xs text-muted-foreground">Needs review</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Your latest job postings and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          < Star className="h-4 w-48" />
                          < Star className="h-3 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                          < Star className="h-6 w-16" />
                          < Star className="h-8 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : jobsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{jobsError}</p>
                    <Button onClick={() => fetchMyJobs()}>Try Again</Button>
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                          <p className="text-xs text-muted-foreground">Posted {job.postedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={job.status === "ACTIVE" ? "default" : "secondary"}
                          >
                            {job.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveTab('applications')}
                          >
                            View ({job.applicationsCount})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                    <Button onClick={() => setActiveTab('post-job')}>
                      Post Your First Job
                    </Button>
                  </div>
                )}
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent"
                    onClick={() => setActiveTab('my-jobs')}
                  >
                    View All Jobs
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
