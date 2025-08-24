import express from "express";
import { prisma } from "../index.js";
import { authenticateToken, requireEmployer } from "../middleware/auth.js";

const router = express.Router();

// Get all jobs (public)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      location,
      remote,
      status = "ACTIVE",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      status: status.toUpperCase(),
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type && type !== "all") {
      where.type = type.toUpperCase();
    }

    if (location && location !== "all") {
      if (location === "remote") {
        where.remote = true;
      } else if (location === "onsite") {
        where.remote = false;
      } else {
        where.location = { contains: location, mode: "insensitive" };
      }
    }

    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.job.count({ where }),
    ]);

    // Transform data to match frontend expectations
    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      remote: job.remote,
      status: job.status,
      postedDate: formatPostedDate(job.createdAt),
      applicationsCount: job._count.applications,
      employer: job.createdBy,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));

    res.json({
      jobs: transformedJobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalJobs: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      error: "Failed to fetch jobs",
      message: error.message,
    });
  }
});

// Get single job by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const transformedJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      remote: job.remote,
      status: job.status,
      postedDate: formatPostedDate(job.createdAt),
      applicationsCount: job._count.applications,
      employer: job.createdBy,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    res.json({ job: transformedJob });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      error: "Failed to fetch job",
      message: error.message,
    });
  }
});

// Create new job (employer only)
router.post("/", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
      remote,
    } = req.body;

    // Validation
    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["title", "company", "location", "type", "description"],
      });
    }

    // Validate job type
    const validTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
    if (!validTypes.includes(type.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid job type",
        validTypes,
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: type.toUpperCase(),
        salary,
        description,
        requirements,
        benefits,
        remote: remote || false,
        employerId: req.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const transformedJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      remote: job.remote,
      status: job.status,
      postedDate: formatPostedDate(job.createdAt),
      employer: job.createdBy,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    res.status(201).json({
      message: "Job created successfully",
      job: transformedJob,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      error: "Failed to create job",
      message: error.message,
    });
  }
});

// Update job (employer only)
router.put("/:id", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if job exists and belongs to the user
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (existingJob.employerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to update this job" });
    }

    // Validate job type if provided
    if (updateData.type) {
      const validTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
      if (!validTypes.includes(updateData.type.toUpperCase())) {
        return res.status(400).json({
          error: "Invalid job type",
          validTypes,
        });
      }
      updateData.type = updateData.type.toUpperCase();
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const transformedJob = {
      id: updatedJob.id,
      title: updatedJob.title,
      company: updatedJob.company,
      location: updatedJob.location,
      type: updatedJob.type,
      salary: updatedJob.salary,
      description: updatedJob.description,
      requirements: updatedJob.requirements,
      benefits: updatedJob.benefits,
      remote: updatedJob.remote,
      status: updatedJob.status,
      postedDate: formatPostedDate(updatedJob.createdAt),
      employer: updatedJob.createdBy,
      createdAt: updatedJob.createdAt,
      updatedAt: updatedJob.updatedAt,
    };

    res.json({
      message: "Job updated successfully",
      job: transformedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({
      error: "Failed to update job",
      message: error.message,
    });
  }
});

// Delete job (employer only)
router.delete("/:id", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and belongs to the user
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (existingJob.employerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    await prisma.job.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      error: "Failed to delete job",
      message: error.message,
    });
  }
});

// Get jobs by employer
router.get("/employer/my-jobs", authenticateToken, requireEmployer, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      employerId: req.user.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.job.count({ where }),
    ]);

    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      remote: job.remote,
      status: job.status,
      postedDate: formatPostedDate(job.createdAt),
      applicationsCount: job._count.applications,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));

    res.json({
      jobs: transformedJobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalJobs: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get employer jobs error:", error);
    res.status(500).json({
      error: "Failed to fetch employer jobs",
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
