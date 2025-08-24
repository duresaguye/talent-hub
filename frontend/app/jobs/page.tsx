"use client"

import { useState, useEffect } from 'react'
import { useJobs } from '@/hooks/useJobs'
import { Job } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Briefcase, Clock, DollarSign, Wifi } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'


export default function JobsPage() {
  const { jobs, loading, error, pagination, fetchJobs } = useJobs()
  const [searchParams, setSearchParams] = useState({
    search: '',
    type: 'all',
    location: 'all',
    remote: 'all',
    page: 1,
  })

  useEffect(() => {
    // Convert 'all' values to empty strings for API
    const apiParams = {
      ...searchParams,
      type: searchParams.type === 'all' ? '' : searchParams.type,
      location: searchParams.location === 'all' ? '' : searchParams.location,
      remote: searchParams.remote === 'all' ? undefined
        : searchParams.remote === 'true' ? true
        : searchParams.remote === 'false' ? false
        : undefined,
    }
    fetchJobs(apiParams)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase()
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => {
              // Convert 'all' values to empty strings/undefined for API, as in useEffect
              const apiParams = {
                ...searchParams,
                type: searchParams.type === 'all' ? '' : searchParams.type,
                location: searchParams.location === 'all' ? '' : searchParams.location,
                remote: searchParams.remote === 'all' ? undefined
                  : searchParams.remote === 'true' ? true
                  : searchParams.remote === 'false' ? false
                  : undefined,
              }
              fetchJobs(apiParams)
            }}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchParams.search}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select value={searchParams.type} onValueChange={(value) => setSearchParams(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={searchParams.location} onValueChange={(value) => setSearchParams(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {pagination ? `${pagination.totalJobs} jobs found` : 'Loading...'}
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-2">
                    <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="text-muted-foreground font-medium">{job.company}</p>
                </div>
                <Badge variant={job.remote ? "default" : "secondary"}>
                  {job.remote ? "Remote" : "On-site"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {formatJobType(job.type)}
                </div>
                {job.salary && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {job.postedDate}
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </div>
                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/jobs/${job.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}
