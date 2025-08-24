"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Mail, Flag } from "lucide-react"

// Mock data for all applications in the system
const allSystemApplications = [
  {
    id: 1,
    applicantName: "Sarah Johnson",
    applicantEmail: "sarah.johnson@email.com",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    appliedDate: "2024-01-16",
    status: "new",
    experience: "5 years",
  },
  {
    id: 2,
    applicantName: "Michael Chen",
    applicantEmail: "michael.chen@email.com",
    jobTitle: "Product Manager",
    company: "StartupXYZ",
    appliedDate: "2024-01-15",
    status: "reviewed",
    experience: "7 years",
  },
  {
    id: 3,
    applicantName: "Emily Davis",
    applicantEmail: "emily.davis@email.com",
    jobTitle: "UX Designer",
    company: "Design Studio",
    appliedDate: "2024-01-14",
    status: "shortlisted",
    experience: "4 years",
  },
  {
    id: 4,
    applicantName: "David Wilson",
    applicantEmail: "david.wilson@email.com",
    jobTitle: "Backend Developer",
    company: "ServerTech Inc.",
    appliedDate: "2024-01-13",
    status: "rejected",
    experience: "3 years",
  },
]

export function AdminApplicationsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge>New</Badge>
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applications</CardTitle>
        <CardDescription>Monitor job applications across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSystemApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(application.applicantName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{application.applicantName}</p>
                      <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.jobTitle}</TableCell>
                <TableCell>{application.company}</TableCell>
                <TableCell>{application.experience}</TableCell>
                <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="mr-1 h-3 w-3" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <Flag className="mr-1 h-3 w-3" />
                      Flag
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
