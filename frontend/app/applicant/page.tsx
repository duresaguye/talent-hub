"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { ApplicantSidebar } from "@/components/applicant-sidebar"
import { MyApplicationsTable } from "@/components/my-applications-table"
import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp, User } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { useApplications } from "@/hooks/useApplications"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user, isAuthenticated, isLoading } = useAuth()
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
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (user?.role !== 'APPLICANT') {
      router.push('/unauthorized')
      return
    }

    if (activeTab === 'dashboard' || activeTab === 'applications') {
      setIsInitialLoad(true)
      Promise.all([
        fetchMyApplications(),
        fetchJobs({ limit: 3, status: 'ACTIVE' })
      ]).finally(() => {
        setIsInitialLoad(false)
      })
    }
  }, [isLoading, isAuthenticated, user, activeTab, router])

  useEffect(() => {
    // Only update stats when not loading and have data or confirmed no data
    if (!applicationsLoading && !applicationsError) {
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
      } else {
        // Reset stats when no applications
        setDashboardStats({
          totalApplications: 0,
          pendingApplications: 0,
          shortlisted: 0,
          rejected: 0,
          profileCompletion: 85,
        })
      }
    }
  }, [applications, applicationsLoading, applicationsError])

  // Show loading state while authentication is being validated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {isInitialLoad && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
              </div>
            )}
            
            {applicationsError && !isInitialLoad && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 mb-2">Error loading applications: {applicationsError}</p>
                <Button onClick={() => fetchMyApplications()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            )}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isInitialLoad ? (
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
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
                  {isInitialLoad ? (
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
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
                  {isInitialLoad ? (
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
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
                  {isInitialLoad ? (
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
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
                  {isInitialLoad ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="h-4 w-4 mt-1 bg-muted animate-pulse rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                            <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : applicationsError && !isInitialLoad ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-4">{applicationsError}</p>
                      <Button onClick={() => fetchMyApplications()}>Try Again</Button>
                    </div>
                  ) : !isInitialLoad && applications.length > 0 ? (
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
                  ) : !isInitialLoad ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button asChild>
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  ) : null}
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
                {isInitialLoad ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !isInitialLoad && jobs.length > 0 ? (
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
                ) : !isInitialLoad ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No recommended jobs available</p>
                    <Button asChild>
                      <Link href="/jobs">Browse All Jobs</Link>
                    </Button>
                  </div>
                ) : null}
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

      <div className="lg:flex">
        <ApplicantSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 lg:p-6 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 lg:block hidden">
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "applications" && "My Applications"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "dashboard" && "Track your job search progress"}
                {activeTab === "applications" && "View and manage your applications"}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
