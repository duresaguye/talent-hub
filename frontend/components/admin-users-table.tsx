"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Ban, CheckCircle, Mail } from "lucide-react"

// Mock data for all users in the system
const allSystemUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    type: "job-seeker",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-16",
    applications: 5,
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@techcorp.com",
    type: "employer",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2024-01-15",
    jobsPosted: 3,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    type: "job-seeker",
    status: "active",
    joinDate: "2024-01-12",
    lastActive: "2024-01-16",
    applications: 8,
  },
  {
    id: 4,
    name: "Suspicious User",
    email: "spam@fake.com",
    type: "employer",
    status: "suspended",
    joinDate: "2024-01-16",
    lastActive: "2024-01-16",
    jobsPosted: 1,
  },
]

export function AdminUsersTable() {
  const [users, setUsers] = useState(allSystemUsers)

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "suspended" } : user)))
  }

  const handleActivateUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "job-seeker":
        return <Badge variant="outline">Job Seeker</Badge>
      case "employer":
        return <Badge variant="secondary">Employer</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
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
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users on the TalentHub platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={user.status === "suspended" ? "bg-red-50 dark:bg-red-950/20" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.type === "job-seeker" && <span className="text-sm">{user.applications} applications</span>}
                  {user.type === "employer" && <span className="text-sm">{user.jobsPosted} jobs posted</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.status === "suspended" ? (
                      <Button size="sm" onClick={() => handleActivateUser(user.id)}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Activate
                      </Button>
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="mr-1 h-3 w-3" />
                        Suspend
                      </Button>
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
