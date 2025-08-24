"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { ApplicantSidebar } from "@/components/applicant-sidebar"
import { MyApplicationsTable } from "@/components/my-applications-table"
import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp, User, Star } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { useApplications } from "@/hooks/useApplications"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAuth()
  const router = useRouter()
  const { applications, loading: applicationsLoading, error: applicationsError, fetchMyApplications } = useApplications()
  const { jobs, loading: jobsLoading, fetchJobs } = useJobs()
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlisted: 0,
    rejected: 0,
    profileCompletion: 85,
  })

  useEffect(() => {
    if (user?.role !== 'APPLICANT') {
      router.push('/unauthorized')
      return
    }

    if (activeTab === 'dashboard' || activeTab === 'applications') {
      fetchMyApplications()
      fetchJobs({ limit: 3, status: 'ACTIVE' }) // For recommended jobs
    }
  }, [user, activeTab])

  useEffect(() => {
    if (applications.length > 0) {
      const pending = applications.filter(app => app.status === 'APPLIED').length
      const shortlisted = applications.filter(app => app.status === 'SHORTLISTED').length
      const rejected = applications.filter(app => app.status === 'REJECTED').length
      
      setDashboardStats({
        totalApplications: applications.length,
        pendingApplications: pending,
        shortlisted,
        rejected,
        profileCompletion: 85, // This could be calculated based on profile completeness
      })
    }
  }, [applications])

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
                  {applicationsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
                      <p className="text-xs text-muted-foreground">Your applications</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.pendingApplications}</div>
                      <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-green-600">{dashboardStats.shortlisted}</div>
                      <p className="text-xs text-muted-foreground">Great progress!</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    < Star className="h-8 w-16" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-red-600">{dashboardStats.rejected}</div>
                      <p className="text-xs text-muted-foreground">Keep trying!</p>
                    </>
                  )}
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
                  {applicationsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          < Star className="h-4 w-4 mt-1" />
                          <div className="flex-1 space-y-2">
                            < Star className="h-4 w-full" />
                            < Star className="h-3 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : applicationsError ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-4">{applicationsError}</p>
                      <Button onClick={() => fetchMyApplications()}>Try Again</Button>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 4).map((application) => (
                        <div key={application.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="mt-1">
                            {application.status === "APPLIED" && <Briefcase className="h-4 w-4 text-blue-500" />}
                            {application.status === "SHORTLISTED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {application.status === "REJECTED" && <XCircle className="h-4 w-4 text-red-500" />}
                            {application.status === "REVIEWED" && <Clock className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm">
                              {application.status === "APPLIED" && `Applied to ${application.job?.title || 'Job'} at ${application.job?.company || 'Company'}`}
                              {application.status === "SHORTLISTED" && `Shortlisted for ${application.job?.title || 'Job'} at ${application.job?.company || 'Company'}`}
                              {application.status === "REJECTED" && `Application rejected for ${application.job?.title || 'Job'} at ${application.job?.company || 'Company'}`}
                              {application.status === "REVIEWED" && `Application reviewed for ${application.job?.title || 'Job'} at ${application.job?.company || 'Company'}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {application.createdAt
                                ? new Date(application.createdAt).toLocaleDateString()
                                : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button asChild>
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  )}
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
                {jobsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="space-y-2">
                          < Star className="h-4 w-32" />
                          < Star className="h-3 w-24" />
                          < Star className="h-3 w-20" />
                        </div>
                        <div className="space-y-2">
                          < Star className="h-4 w-20" />
                          < Star className="h-6 w-16" />
                        </div>
                        < Star className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-primary">{job.salary || 'Salary not specified'}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Applications:</span>
                              <Badge variant="secondary" className="text-xs">
                                {job.applicationsCount}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" asChild className="w-full">
                          <Link href={`/jobs/${job.id}`}>View Job</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No recommended jobs available</p>
                    <Button asChild>
                      <Link href="/jobs">Browse All Jobs</Link>
                    </Button>
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/jobs">View More Jobs</Link>
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
