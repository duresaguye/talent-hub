"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ApplicationForm } from "@/components/application-form"
import { MapPin, Clock, DollarSign, Building2, Users, ArrowLeft, Briefcase, CheckCircle,  Star  } from "lucide-react"
import { useJob } from "@/hooks/useJobs"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
 
  const { user, isAuthenticated, isLoading } = useAuth()
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const jobId = Number.parseInt(params.id as string)
  const { job, loading, error } = useJob(jobId)

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Star  className="h-8 w-1/3 mb-4" />
                  <Star  className="h-10 w-full mb-2" />
                  <Star  className="h-6 w-2/3" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Star  className="h-6 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Star  className="h-4 w-full mb-2" />
                  <Star  className="h-4 w-full mb-2" />
                  <Star  className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  < Star  className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  < Star  className="h-10 w-full mb-4" />
                  < Star  className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The job you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
      
        <ApplicationForm job={job as any} onBack={() => setShowApplicationForm(false)} />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/jobs")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary">{formatJobType(job.type)}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {job.postedDate}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-foreground mb-2">{job.title}</CardTitle>
                <CardDescription className="text-lg">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                    )}
                  </div>
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.remote && (
                    <Badge variant="outline">Remote</Badge>
                  )}
                  <Badge variant="outline">{formatJobType(job.type)}</Badge>
                  <Badge variant="outline">{job.applicationsCount} applications</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground whitespace-pre-wrap">{job.benefits}</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
                <CardDescription>Join {job.company} and take your career to the next level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              {isLoading ? (
  <Button size="lg" variant="outline" className="w-full" disabled>Loading...</Button>
) : isAuthenticated && user?.role === 'APPLICANT' ? (
  <Button size="lg" className="w-full" onClick={() => setShowApplicationForm(true)}>
    Apply for This Position
  </Button>
) : isAuthenticated && user?.role !== 'APPLICANT' ? (
  <Button size="lg" variant="outline" className="w-full" disabled>
    {user?.role === 'EMPLOYER' ? 'Employers cannot apply' : 'Not eligible to apply'}
  </Button>
) : (
  <Button size="lg" variant="outline" asChild className="w-full">
    <Link href="/login">Login to Apply</Link>
  </Button>
                )}
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Save Job
                </Button>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type:</span>
                    <span className="font-medium">{formatJobType(job.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remote Work:</span>
                    <span className="font-medium">{job.remote ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">{job.applicationsCount}</span>
                  </div>
                  {job.employer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted by:</span>
                      <span className="font-medium">{job.employer.firstName} {job.employer.lastName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {job.employer ? `Posted by ${job.employer.firstName} ${job.employer.lastName}` : 'Company information not available'}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {job.applicationsCount} applications received
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

