import express from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../index.js";
import { authenticateToken, requireApplicant, requireEmployer } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."));
    }
  },
});

// Apply for a job
router.post("/", authenticateToken, requireApplicant, upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "coverLetterFile", maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
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
    if (!jobId) {
      return res.status(400).json({
        error: "Job ID is required",
      });
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "ACTIVE") {
      return res.status(400).json({ error: "This job is not accepting applications" });
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId: parseInt(jobId),
          applicantId: req.user.id,
        },
      },
    });

    if (existingApplication) {
      return res.status(409).json({ error: "You have already applied for this job" });
    }

    // Handle file uploads
    const resumePath = req.files?.resume?.[0]?.filename;
    const coverLetterPath = req.files?.coverLetterFile?.[0]?.filename;

    if (!resumePath) {
      return res.status(400).json({ error: "Resume is required" });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        applicantId: req.user.id,
        coverLetter,
        resumePath,
        coverLetterPath,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
          },
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            location: true,
            experience: true,
            currentRole: true,
            expectedSalary: true,
            availableDate: true,
            portfolio: true,
            linkedin: true,
          },
        },
      },
    });

    // Update user profile with additional information if provided
    if (phone || location || experience || currentRole || expectedSalary || availableDate || portfolio || linkedin) {
      const updateData = {};
      if (phone) updateData.phone = phone;
      if (location) updateData.location = location;
      if (experience) updateData.experience = experience;
      if (currentRole) updateData.currentRole = currentRole;
      if (expectedSalary) updateData.expectedSalary = expectedSalary;
      if (availableDate) updateData.availableDate = new Date(availableDate);
      if (portfolio) updateData.portfolio = portfolio;
      if (linkedin) updateData.linkedin = linkedin;

      await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
      });
    }

    const transformedApplication = {
      id: application.id,
      status: application.status,
      coverLetter: application.coverLetter,
      resumePath: application.resumePath,
      coverLetterPath: application.coverLetterPath,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      job: application.job,
      applicant: application.applicant,
    };

    res.status(201).json({
      message: "Application submitted successfully",
      application: transformedApplication,
    });
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({
      error: "Failed to submit application",
      message: error.message,
    });
  }
});

// Get user's applications
router.get("/my-applications", authenticateToken, requireApplicant, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      applicantId: req.user.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              type: true,
              salary: true,
              remote: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.application.count({ where }),
    ]);

    const transformedApplications = applications.map((app) => ({
      id: app.id,
      status: app.status,
      coverLetter: app.coverLetter,
      resumePath: app.resumePath,
      coverLetterPath: app.coverLetterPath,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job: {
        ...app.job,
        postedDate: formatPostedDate(app.job.createdAt),
      },
    }));

    res.json({
      applications: transformedApplications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalApplications: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
      message: error.message,
    });
  }
});

// Get applications for a specific job (employer only)
router.get("/job/:jobId", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if job exists and belongs to the user
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.employerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to view applications for this job" });
    }

    const where = {
      jobId: parseInt(jobId),
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
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
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.application.count({ where }),
    ]);

    const transformedApplications = applications.map((app) => ({
      id: app.id,
      status: app.status,
      coverLetter: app.coverLetter,
      resumePath: app.resumePath,
      coverLetterPath: app.coverLetterPath,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      applicant: app.applicant,
      job: app.job,
    }));

    res.json({
      applications: transformedApplications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalApplications: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({
      error: "Failed to fetch job applications",
      message: error.message,
    });
  }
});

// Update application status (employer only)
router.patch("/:id/status", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid status",
        validStatuses,
      });
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: {
          select: {
            id: true,
            employerId: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Check if user is authorized to update this application
    if (application.job.employerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status: status.toUpperCase() },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({
      error: "Failed to update application status",
      message: error.message,
    });
  }
});

// Get application by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
            salary: true,
            remote: true,
            status: true,
            employerId: true,
          },
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            location: true,
            experience: true,
            currentRole: true,
            expectedSalary: true,
            availableDate: true,
            portfolio: true,
            linkedin: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Check if user is authorized to view this application
    const isAuthorized = 
      req.user.id === application.applicant.id || 
      req.user.id === application.job.employerId || 
      req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized to view this application" });
    }

    res.json({ application });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({
      error: "Failed to fetch application",
      message: error.message,
    });
  }
});

// Check if user has applied to a specific job
router.get("/check/:jobId", authenticateToken, requireApplicant, async (req, res) => {
  try {
    const { jobId } = req.params;

    const application = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId: parseInt(jobId),
          applicantId: req.user.id,
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error("Check application error:", error);
    res.status(500).json({
      error: "Failed to check application status",
      message: error.message,
    });
  }
});

// Helper function to format posted date
function formatPostedDate(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

export default router;
