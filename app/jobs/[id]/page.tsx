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
import { MapPin, Clock, DollarSign, Building2, Users, ArrowLeft, Briefcase, CheckCircle } from "lucide-react"

// Extended job data with more details
const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description:
      "Join our team to build cutting-edge web applications using React, TypeScript, and modern tools. We're looking for someone with 5+ years of experience.",
    tags: ["React", "TypeScript", "Remote"],
    postedDate: "2 days ago",
    remote: true,
    companySize: "500-1000 employees",
    industry: "Technology",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management libraries (Redux, Zustand)",
      "Proficiency in CSS-in-JS solutions and responsive design",
      "Experience with testing frameworks (Jest, React Testing Library)",
      "Knowledge of build tools and CI/CD pipelines",
      "Strong problem-solving and communication skills",
    ],
    responsibilities: [
      "Develop and maintain high-quality web applications",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Mentor junior developers and contribute to team growth",
      "Stay up-to-date with latest frontend technologies and best practices",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements and remote options",
      "Professional development budget ($2,000/year)",
      "Unlimited PTO and flexible working hours",
      "Modern office with free meals and snacks",
      "401(k) with company matching",
    ],
    companyDescription:
      "TechCorp Inc. is a leading technology company focused on building innovative solutions that transform how businesses operate. We're a fast-growing company with a strong engineering culture and commitment to work-life balance.",
  },
]

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const jobId = Number.parseInt(params.id as string)
  const job = jobsData.find((j) => j.id === jobId)

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist.</p>
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
        <ApplicationForm job={job} onBack={() => setShowApplicationForm(false)} />
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
                  <Badge variant="secondary">{job.type}</Badge>
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
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                  </div>
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
                <Button size="lg" className="w-full" onClick={() => setShowApplicationForm(true)}>
                  Apply for This Position
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Save Job
                </Button>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type:</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium">{job.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Size:</span>
                    <span className="font-medium">{job.companySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remote Work:</span>
                    <span className="font-medium">{job.remote ? "Yes" : "No"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{job.companyDescription}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {job.companySize}
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <h4 className="font-medium text-sm">Frontend Developer</h4>
                  <p className="text-xs text-muted-foreground">StartupXYZ • Remote</p>
                  <p className="text-xs text-primary font-medium">$90k - $120k</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <h4 className="font-medium text-sm">React Developer</h4>
                  <p className="text-xs text-muted-foreground">WebCorp • San Francisco</p>
                  <p className="text-xs text-primary font-medium">$110k - $140k</p>
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
