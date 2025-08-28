"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Download, Mail, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { apiClient, Application } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApplicationsTableProps {
  jobId?: number
}

export function ApplicationsTable({ jobId }: ApplicationsTableProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!jobId) {
          setApplications([])
          return
        }

        const params: any = {}
        if (statusFilter && statusFilter !== "all") {
          params.status = statusFilter
        }

        const res = await apiClient.getJobApplications(jobId, params)
        setApplications(res.applications || [])
      } catch (e) {
        console.error("Error fetching applications:", e)
        setError(e instanceof Error ? e.message : "Failed to fetch applications")
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [jobId, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return <Badge>Applied</Badge>
      case "SHORTLISTED":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "HIRED":
        return <Badge variant="secondary">Hired</Badge>
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

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      await apiClient.updateApplicationStatus(applicationId, newStatus)
      // Refresh the applications list
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as Application['status'] }
            : app
        )
      )
    } catch (e) {
      console.error("Error updating application status:", e)
      setError(e instanceof Error ? e.message : "Failed to update application status")
    }
  }

  const handleViewApplication = (applicationId: number) => {
    // TODO: Implement view application details
    console.log("View application:", applicationId)
  }

  const handleDownloadResume = (resumePath: string) => {
    if (resumePath) {
      // TODO: Implement resume download
      window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${resumePath}`, '_blank')
    }
  }

  const handleContactApplicant = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  if (!jobId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
          <CardDescription>Review and manage applications for your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Select a job from "My Jobs" tab to view its applications. Jobs with applications will be shown automatically.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>Review and manage applications for your job postings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="HIRED">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {statusFilter === "all" 
                ? "No applications found for this job." 
                : `No applications found with status "${statusFilter}".`
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Job Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(`${application.applicant?.firstName || ''} ${application.applicant?.lastName || ''}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {application.applicant?.firstName} {application.applicant?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{application.applicant?.email}</p>
                        {application.applicant?.location && (
                          <p className="text-xs text-muted-foreground">{application.applicant?.location}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.job?.title || 'N/A'}</TableCell>
                  <TableCell>{application.applicant?.experience || 'Not specified'}</TableCell>
                  <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select
                      value={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>{getStatusBadge(application.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPLIED">Applied</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="HIRED">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewApplication(application.id)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      {application.resumePath && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadResume(application.resumePath!)}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Resume
                        </Button>
                      )}
                      {application.applicant?.email && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContactApplicant(application.applicant!.email)}
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
