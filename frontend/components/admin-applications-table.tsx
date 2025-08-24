"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Mail, Flag } from "lucide-react"
import { useApplications } from "@/hooks/useApplications"
import { Application } from "@/lib/api"

export function AdminApplicationsTable() {
  const { applications, loading, error, pagination, fetchJobApplications } = useApplications()
  const [searchParams, setSearchParams] = useState({
    status: 'all',
    page: 1,
  })

  // For admin, we'll fetch applications from all jobs
  // In a real implementation, you might want a specific admin endpoint
  useEffect(() => {
    // For now, we'll just show a message that this needs to be implemented
    // In a real admin panel, you'd want to fetch all applications across all jobs
  }, [searchParams])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return <Badge>Applied</Badge>
      case "REVIEWED":
        return <Badge variant="secondary">Reviewed</Badge>
      case "SHORTLISTED":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "HIRED":
        return <Badge className="bg-blue-100 text-blue-800">Hired</Badge>
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

  if (loading && applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Error loading applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchJobApplications(1, searchParams)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // For now, show a message that this needs to be implemented
  // In a real admin panel, you'd want to show all applications across all jobs
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Monitor job applications across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              This feature needs to be implemented with a proper admin endpoint to fetch all applications across all jobs.
            </p>
            <p className="text-sm text-muted-foreground">
              Currently, applications are fetched per job. For admin view, we need an endpoint that returns all applications.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applications</CardTitle>
        <CardDescription>
          {pagination ? `${pagination.totalApplications} applications found` : 'Monitor job applications across the platform'}
        </CardDescription>
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
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {application.applicant ? getInitials(`${application.applicant.firstName} ${application.applicant.lastName}`) : 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {application.applicant ? `${application.applicant.firstName} ${application.applicant.lastName}` : 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {application.applicant?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {application.job ? application.job.title : 'Unknown Job'}
                </TableCell>
                <TableCell>
                  {application.job ? application.job.company : 'Unknown Company'}
                </TableCell>
                <TableCell>
                  {application.applicant?.experience || 'Not specified'}
                </TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
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
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
