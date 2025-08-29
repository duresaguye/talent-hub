"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Flag, CheckCircle, XCircle } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { Job, apiClient } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export function AdminJobsTable() {
  const { jobs, loading, error, pagination, fetchJobs } = useJobs()
  const [searchParams, setSearchParams] = useState({
    search: '',
    status: 'all',
    type: 'all',
    page: 1,
  })

  useEffect(() => {
    const apiParams = {
      ...searchParams,
      status: searchParams.status === 'all' ? '' : searchParams.status,
      type: searchParams.type === 'all' ? '' : searchParams.type,
    }
    fetchJobs(apiParams)
  }, [searchParams])

  const handleApproveJob = async (jobId: number) => {
    try {
      await apiClient.adminUpdateJobStatus(jobId, 'ACTIVE')
      toast({ title: "Success", description: "Job approved successfully" })
      await fetchJobs(searchParams)
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve job", variant: "destructive" })
    }
  }

  const handleRejectJob = async (jobId: number) => {
    try {
      await apiClient.adminUpdateJobStatus(jobId, 'REJECTED')
      toast({ title: "Success", description: "Job rejected successfully" })
      await fetchJobs(searchParams)
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject job", variant: "destructive" })
    }
  }

  const handleFlagJob = async (jobId: number) => {
    try {
      await apiClient.adminUpdateJobStatus(jobId, 'FLAGGED', 'Flagged for review by admin')
      toast({ title: "Success", description: "Job flagged for review" })
      await fetchJobs(searchParams)
    } catch (error) {
      toast({ title: "Error", description: "Failed to flag job", variant: "destructive" })
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }
    
    try {
      await apiClient.adminDeleteJob(jobId)
      toast({ title: "Success", description: "Job deleted successfully" })
      await fetchJobs(searchParams)
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "INACTIVE":
        return <Badge variant="secondary">Inactive</Badge>
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "FLAGGED":
        return <Badge className="bg-yellow-100 text-yellow-800">Flagged</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase()
  }

  if (loading && jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
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
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>Error loading jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchJobs(searchParams)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Job Postings</CardTitle>
        <CardDescription>
          {pagination ? `${pagination.totalJobs} jobs found` : 'Monitor and moderate job postings across the platform'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    {job.salary && <p className="text-sm text-primary">{job.salary}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {job.employer ? `${job.employer.firstName} ${job.employer.lastName}` : 'Unknown'}
                  </p>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Badge variant="outline">{formatJobType(job.type)}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>{job.applicationsCount}</TableCell>
                <TableCell>{job.postedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/jobs/${job.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApproveJob(job.id)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Approve Job
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRejectJob(job.id)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-600" />
                          Reject Job
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFlagJob(job.id)}>
                          <Flag className="mr-2 h-4 w-4 text-yellow-600" />
                          Flag for Review
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteJob(job.id)}
                        >
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
