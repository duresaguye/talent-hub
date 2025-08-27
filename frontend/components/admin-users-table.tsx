"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Ban, CheckCircle, Mail } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"
import { User } from "@/lib/api"

export function AdminUsersTable() {
  const { users, loading, error, pagination, fetchAllUsers, updateUseruserType, deleteUser } = useAdmin()
  const [searchParams, setSearchParams] = useState({
    userType: 'all',
    search: '',
    page: 1,
  })

  useEffect(() => {
    const apiParams = {
      ...searchParams,
      userType: searchParams.userType === 'all' ? '' : searchParams.userType,
    }
    fetchAllUsers(apiParams)
  }, [searchParams])

  const handleSuspendUser = async (userId: number) => {
    // In a real implementation, you would have a suspend user API
    // For now, we'll just refresh the users list
    await fetchAllUsers(searchParams)
  }

  const handleActivateUser = async (userId: number) => {
    // In a real implementation, you would have an activate user API
    // For now, we'll just refresh the users list
    await fetchAllUsers(searchParams)
  }

  const handleUpdateUseruserType = async (userId: number, newuserType: string) => {
    const success = await updateUseruserType(userId, newuserType)
    if (success) {
      await fetchAllUsers(searchParams)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    const success = await deleteUser(userId)
    if (success) {
      await fetchAllUsers(searchParams)
    }
  }

  const getuserTypeBadge = (userType: string) => {
    switch (userType) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>
      case "EMPLOYER":
        return <Badge variant="secondary">Employer</Badge>
      case "APPLICANT":
        return <Badge variant="outline">Job Seeker</Badge>
      default:
        return <Badge variant="outline">{userType}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading && users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
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
          <CardTitle>User Management</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchAllUsers(searchParams)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          {pagination ? `${pagination.totalUsers} users found` : 'Manage all users on the TalentHub platform'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>userType</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(`${user.firstName} ${user.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getuserTypeBadge(user.userType)}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.userType === "APPLICANT" && (
                    <span className="text-sm">{user.applicationsCount || 0} applications</span>
                  )}
                  {user.userType === "EMPLOYER" && (
                    <span className="text-sm">{user.jobsCount || 0} jobs posted</span>
                  )}
                  {user.userType === "ADMIN" && (
                    <span className="text-sm">Administrator</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        {user.userType !== "ADMIN" && (
                          <>
                            <DropdownMenuItem onClick={() => handleUpdateUseruserType(user.id, "ADMIN")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUseruserType(user.id, "EMPLOYER")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Make Employer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUseruserType(user.id, "APPLICANT")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Make Applicant
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                              <Ban className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </>
                        )}
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
