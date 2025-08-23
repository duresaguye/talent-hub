"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react"

// Extended mock jobs data
const allJobs = [
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
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k - $180k",
    description:
      "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences. Experience with SaaS products preferred.",
    tags: ["Strategy", "Leadership", "SaaS"],
    postedDate: "1 day ago",
    remote: false,
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $110k",
    description:
      "Create beautiful and intuitive user experiences for mobile and web applications. Portfolio review required.",
    tags: ["Figma", "User Research", "Mobile"],
    postedDate: "3 days ago",
    remote: true,
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataFlow Labs",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140k - $190k",
    description:
      "Analyze complex datasets and build machine learning models to drive business insights. PhD preferred but not required.",
    tags: ["Python", "ML", "Analytics"],
    postedDate: "1 week ago",
    remote: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110k - $150k",
    description:
      "Manage cloud infrastructure and implement CI/CD pipelines for scalable applications. AWS certification preferred.",
    tags: ["AWS", "Docker", "Kubernetes"],
    postedDate: "4 days ago",
    remote: true,
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$90k - $120k",
    description:
      "Drive marketing campaigns and growth strategies for our expanding customer base. B2B experience required.",
    tags: ["Digital Marketing", "Growth", "Analytics"],
    postedDate: "5 days ago",
    remote: false,
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "ServerTech Inc.",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$100k - $140k",
    description:
      "Build robust APIs and microservices using Node.js and Python. Experience with databases and cloud platforms required.",
    tags: ["Node.js", "Python", "APIs"],
    postedDate: "6 days ago",
    remote: true,
  },
  {
    id: 8,
    title: "Mobile Developer",
    company: "AppCraft Studios",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$95k - $130k",
    description: "Develop native iOS and Android applications. Experience with React Native or Flutter is a plus.",
    tags: ["iOS", "Android", "React Native"],
    postedDate: "1 week ago",
    remote: false,
  },
  {
    id: 9,
    title: "Sales Manager",
    company: "SalesForce Pro",
    location: "Denver, CO",
    type: "Full-time",
    salary: "$85k - $120k",
    description: "Lead sales team and drive revenue growth. Experience in B2B software sales required.",
    tags: ["Sales", "Leadership", "B2B"],
    postedDate: "3 days ago",
    remote: false,
  },
  {
    id: 10,
    title: "Cybersecurity Analyst",
    company: "SecureNet Corp",
    location: "Washington, DC",
    type: "Full-time",
    salary: "$105k - $145k",
    description: "Monitor and protect company systems from security threats. Security certifications preferred.",
    tags: ["Security", "Monitoring", "Compliance"],
    postedDate: "2 days ago",
    remote: true,
  },
  {
    id: 11,
    title: "Content Writer",
    company: "ContentCo",
    location: "Remote",
    type: "Part-time",
    salary: "$40k - $60k",
    description: "Create engaging content for blogs, social media, and marketing materials. Portfolio required.",
    tags: ["Writing", "Content", "SEO"],
    postedDate: "1 day ago",
    remote: true,
  },
  {
    id: 12,
    title: "Project Manager",
    company: "BuildRight Construction",
    location: "Phoenix, AZ",
    type: "Full-time",
    salary: "$80k - $110k",
    description: "Manage construction projects from planning to completion. PMP certification preferred.",
    tags: ["Project Management", "Construction", "Planning"],
    postedDate: "1 week ago",
    remote: false,
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobType, setJobType] = useState("all")
  const [location, setLocation] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6

  // Filter jobs based on search criteria
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = jobType === "all" || job.type === jobType
    const matchesLocation =
      location === "all" || (location === "remote" && job.remote) || (location === "onsite" && !job.remote)

    return matchesSearch && matchesType && matchesLocation
  })

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Find Your Next Opportunity</h1>
          <p className="text-lg text-muted-foreground">
            Browse {allJobs.length} available positions from top companies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-6 mb-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {paginatedJobs.length} of {filteredJobs.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {job.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {job.postedDate}
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-primary transition-colors">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.company} • {job.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-lg font-semibold text-primary">{job.salary}</span>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1" onClick={() => (window.location.href = `/jobs/${job.id}`)}>
                  Apply Now
                </Button>
                <Button variant="outline" size="icon">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available positions.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setJobType("all")
                setLocation("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
