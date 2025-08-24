import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        experience: true,
        currentRole: true,
        expectedSalary: true,
        availableDate: true,
        portfolio: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to fetch profile",
      message: error.message,
    });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      location,
      experience,
      currentRole,
      expectedSalary,
      availableDate,
      portfolio,
      linkedin,
    } = req.body;

    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        error: "First name and last name are required",
      });
    }

    const updateData = {
      firstName,
      lastName,
      phone,
      location,
      experience,
      currentRole,
      expectedSalary,
      availableDate: availableDate ? new Date(availableDate) : null,
      portfolio,
      linkedin,
    };

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        experience: true,
        currentRole: true,
        expectedSalary: true,
        availableDate: true,
        portfolio: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Failed to update profile",
      message: error.message,
    });
  }
});

// Change password
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      error: "Failed to change password",
      message: error.message,
    });
  }
});

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (role && role !== "all") {
      where.role = role.toUpperCase();
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          phone: true,
          location: true,
          experience: true,
          currentRole: true,
          expectedSalary: true,
          availableDate: true,
          portfolio: true,
          linkedin: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              jobs: true,
              applications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    const transformedUsers = users.map((user) => ({
      ...user,
      jobsCount: user._count.jobs,
      applicationsCount: user._count.applications,
      _count: undefined,
    }));

    res.json({
      users: transformedUsers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalUsers: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      message: error.message,
    });
  }
});

// Get user by ID (admin only)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        experience: true,
        currentRole: true,
        expectedSalary: true,
        availableDate: true,
        portfolio: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transformedUser = {
      ...user,
      jobsCount: user._count.jobs,
      applicationsCount: user._count.applications,
      _count: undefined,
    };

    res.json({ user: transformedUser });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      message: error.message,
    });
  }
});

// Update user role (admin only)
router.patch("/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const validRoles = ["APPLICANT", "EMPLOYER", "ADMIN"];
    if (!validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid role",
        validRoles,
      });
    }

    // Prevent admin from changing their own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      error: "Failed to update user role",
      message: error.message,
    });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      error: "Failed to delete user",
      message: error.message,
    });
  }
});

// Get user statistics (admin only)
router.get("/stats/overview", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      usersByRole,
      jobsByStatus,
      applicationsByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.job.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const stats = {
      totalUsers,
      totalJobs,
      totalApplications,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {}),
      jobsByStatus: jobsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
    };

    res.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Failed to fetch statistics",
      message: error.message,
    });
  }
});

export default router;
