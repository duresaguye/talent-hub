"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApplications } from "@/hooks/useApplications"
import { Skeleton } from "@/components/ui/skeleton"

export function MyApplicationsTable() {
  const { applications, loading, error, fetchMyApplications } = useApplications()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    setIsInitialLoad(true)
    fetchMyApplications().finally(() => {
      setIsInitialLoad(false)
    })
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return <Badge variant="secondary">Applied</Badge>
      case "SHORTLISTED":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "REVIEWED":
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>
      case "HIRED":
        return <Badge className="bg-purple-100 text-purple-800">Hired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "text-blue-600"
      case "SHORTLISTED":
        return "text-green-600"
      case "REJECTED":
        return "text-red-600"
      case "REVIEWED":
        return "text-purple-600"
      case "HIRED":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  if (isInitialLoad) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Job Applications</CardTitle>
          <CardDescription>Track the status of your job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !isInitialLoad) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Job Applications</CardTitle>
          <CardDescription>Track the status of your job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchMyApplications()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Job Applications</CardTitle>
        <CardDescription>Track the status of your job applications</CardDescription>
      </CardHeader>
      <CardContent>
        {!isInitialLoad && applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No applications yet</p>
            <Button asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </div>
        ) : !isInitialLoad ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.job?.title || 'Job Title Not Available'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-primary font-medium">
                            {application.job?.salary || 'Salary not specified'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {application.job?.type || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.job?.company || 'Company Not Available'}</TableCell>
                    <TableCell>{application.job?.location || 'Location Not Available'}</TableCell>
                    <TableCell>
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : 'Date Not Available'}
                    </TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary Stats */}
            {!isInitialLoad && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.filter((app) => app.status === "APPLIED").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Applied</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter((app) => app.status === "SHORTLISTED").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Shortlisted</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {applications.filter((app) => app.status === "REJECTED").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{applications.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            )}
                      </>
          ) : null}
        </CardContent>
    </Card>
  )
}
