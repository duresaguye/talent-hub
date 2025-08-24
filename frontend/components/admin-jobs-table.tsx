"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Flag, CheckCircle, XCircle } from "lucide-react"

// Mock data for all jobs in the system
const allSystemJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    employer: "john@techcorp.com",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "active",
    applications: 24,
    postedDate: "2024-01-15",
    salary: "$120k - $160k",
    flagged: false,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    employer: "sarah@startupxyz.com",
    location: "New York, NY",
    type: "Full-time",
    status: "active",
    applications: 18,
    postedDate: "2024-01-12",
    salary: "$130k - $180k",
    flagged: false,
  },
  {
    id: 3,
    title: "Suspicious Job Posting",
    company: "FakeCompany Ltd",
    employer: "fake@suspicious.com",
    location: "Remote",
    type: "Full-time",
    status: "flagged",
    applications: 2,
    postedDate: "2024-01-16",
    salary: "$200k - $300k",
    flagged: true,
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Design Studio",
    employer: "design@studio.com",
    location: "Remote",
    type: "Contract",
    status: "paused",
    applications: 12,
    postedDate: "2024-01-10",
    salary: "$80k - $110k",
    flagged: false,
  },
]

export function AdminJobsTable() {
  const [jobs, setJobs] = useState(allSystemJobs)

  const handleApproveJob = (jobId: number) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: "active", flagged: false } : job)))
  }

  const handleRejectJob = (jobId: number) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: "rejected", flagged: false } : job)))
  }

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter((job) => job.id !== jobId))
  }

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return <Badge variant="destructive">Flagged</Badge>
    }

    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Job Postings</CardTitle>
        <CardDescription>Monitor and moderate job postings across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className={job.flagged ? "bg-red-50 dark:bg-red-950/20" : ""}>
                <TableCell>
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-sm text-primary">{job.salary}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{job.employer}</p>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{getStatusBadge(job.status, job.flagged)}</TableCell>
                <TableCell>{job.applications}</TableCell>
                <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {job.flagged && (
                      <>
                        <Button size="sm" onClick={() => handleApproveJob(job.id)}>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectJob(job.id)}>
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Flag for Review
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
