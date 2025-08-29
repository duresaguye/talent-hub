import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      location,
      experience,
      currentRole,
      expectedSalary,
      availableDate,
      portfolio,
      linkedin,
      userType, // preferred from frontend
      role: legacyRole, // gracefully support legacy clients
    } = req.body;

    const incomingType = (userType ?? legacyRole)?.toString().toLowerCase();

    // Validation
    if (!firstName || !lastName || !email || !password || !incomingType) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["firstName", "lastName", "email", "password", "userType"],
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Map to internal role
    const role =
      incomingType === "employer"
        ? "EMPLOYER"
        : incomingType === "admin"
        ? "ADMIN"
        : "APPLICANT";

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        phone,
        location,
        experience,
        currentRole,
        expectedSalary,
        availableDate: availableDate ? new Date(availableDate) : null,
        portfolio,
        linkedin,
      },
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
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { ...user, userType: user.role },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Failed to register user",
      message: error.message,
    });
  }
});


// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      userType: user.role,
      phone: user.phone,
      location: user.location,
      experience: user.experience,
      currentRole: user.currentRole,
      expectedSalary: user.expectedSalary,
      availableDate: user.availableDate,
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      createdAt: user.createdAt,
    };

    res.json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Failed to login",
      message: error.message,
    });
  }
});

// Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
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
      error: "Failed to get user profile",
      message: error.message,
    });
  }
});

// Get recent activities for admin dashboard
router.get("/activities", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit);

    // Get recent jobs
    const recentJobs = await prisma.job.findMany({
      take: Math.ceil(limitNum / 2),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        createdAt: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: Math.ceil(limitNum / 2),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      }
    });

    // Combine and format activities
    const activities = [];

    // Add job activities
    recentJobs.forEach(job => {
      activities.push({
        id: `job-${job.id}`,
        type: 'job_posted',
        title: 'New job posted',
        description: `${job.title} at ${job.company}`,
        user: job.createdBy ? `${job.createdBy.firstName} ${job.createdBy.lastName}` : 'Unknown',
        createdAt: job.createdAt,
        icon: 'briefcase',
        color: 'bg-green-500'
      });
    });

    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user_registered',
        title: 'New user registered',
        description: `${user.firstName} ${user.lastName} (${user.role === 'APPLICANT' ? 'Job Seeker' : user.role})`,
        user: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt,
        icon: 'users',
        color: 'bg-blue-500'
      });
    });

    // Sort by creation date and limit to 5 activities
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    res.json({ activities: sortedActivities });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      error: "Failed to fetch activities",
      message: error.message,
    });
  }
});

export default router;
