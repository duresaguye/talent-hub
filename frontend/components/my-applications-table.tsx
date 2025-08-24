"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ExternalLink, MessageCircle } from "lucide-react"

// Mock applications data for the applicant
const myApplications = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    appliedDate: "2024-01-16",
    status: "applied",
    salary: "$120k - $160k",
    type: "Full-time",
  },
  {
    id: 2,
    jobTitle: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    appliedDate: "2024-01-15",
    status: "shortlisted",
    salary: "$130k - $180k",
    type: "Full-time",
  },
  {
    id: 3,
    jobTitle: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    appliedDate: "2024-01-14",
    status: "shortlisted",
    salary: "$80k - $110k",
    type: "Contract",
  },
  {
    id: 4,
    jobTitle: "Backend Developer",
    company: "ServerTech Inc.",
    appliedDate: "2024-01-13",
    status: "rejected",
    location: "Chicago, IL",
    salary: "$100k - $140k",
    type: "Full-time",
  },
  {
    id: 5,
    jobTitle: "Mobile Developer",
    company: "AppCraft Studios",
    location: "Miami, FL",
    appliedDate: "2024-01-12",
    status: "applied",
    salary: "$95k - $130k",
    type: "Full-time",
  },
  {
    id: 6,
    jobTitle: "Data Scientist",
    company: "DataFlow Labs",
    location: "Austin, TX",
    appliedDate: "2024-01-10",
    status: "rejected",
    salary: "$140k - $190k",
    type: "Full-time",
  },
]

export function MyApplicationsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge variant="secondary">Applied</Badge>
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "interview":
        return <Badge className="bg-blue-100 text-blue-800">Interview</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "text-blue-600"
      case "shortlisted":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      case "interview":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Job Applications</CardTitle>
        <CardDescription>Track the status of your job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{application.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-primary font-medium">{application.salary}</span>
                      <Badge variant="outline" className="text-xs">
                        {application.type}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.company}</TableCell>
                <TableCell>{application.location}</TableCell>
                <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Job
                    </Button>
                    {application.status === "shortlisted" && (
                      <Button size="sm" variant="outline">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        Message
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {myApplications.filter((app) => app.status === "applied").length}
            </div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {myApplications.filter((app) => app.status === "shortlisted").length}
            </div>
            <div className="text-sm text-muted-foreground">Shortlisted</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {myApplications.filter((app) => app.status === "rejected").length}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{myApplications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
