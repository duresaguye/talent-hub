import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@talenthub.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@talenthub.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+1234567890",
      location: "San Francisco, CA",
      experience: "10+ years",
      currentRole: "System Administrator",
      expectedSalary: "$150,000",
      portfolio: "https://admin-portfolio.com",
      linkedin: "https://linkedin.com/in/admin",
    },
  });

  // Create sample employer
  const employerPassword = await bcrypt.hash("employer123", 12);
  const employer = await prisma.user.upsert({
    where: { email: "employer@techcorp.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Employer",
      email: "employer@techcorp.com",
      password: employerPassword,
      role: "EMPLOYER",
      phone: "+1234567891",
      location: "New York, NY",
      experience: "8+ years",
      currentRole: "HR Manager",
      expectedSalary: "$120,000",
      portfolio: "https://techcorp.com",
      linkedin: "https://linkedin.com/in/john-employer",
    },
  });

  // Create sample applicant
  const applicantPassword = await bcrypt.hash("applicant123", 12);
  const applicant = await prisma.user.upsert({
    where: { email: "applicant@example.com" },
    update: {},
    create: {
      firstName: "Jane",
      lastName: "Applicant",
      email: "applicant@example.com",
      password: applicantPassword,
      role: "APPLICANT",
      phone: "+1234567892",
      location: "Austin, TX",
      experience: "3-5 years",
      currentRole: "Frontend Developer",
      expectedSalary: "$90,000",
      portfolio: "https://jane-portfolio.com",
      linkedin: "https://linkedin.com/in/jane-applicant",
    },
  });

  // Create sample jobs
  const job1 = await prisma.job.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "FULL_TIME",
      salary: "$120k - $160k",
      description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern tools. We're looking for someone with 5+ years of experience.",
      requirements: "React, TypeScript, 5+ years experience, Modern web development",
      benefits: "Health insurance, 401k, Remote work options, Professional development",
      remote: true,
      status: "ACTIVE",
      employerId: employer.id,
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "FULL_TIME",
      salary: "$130k - $180k",
      description: "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences. Experience with SaaS products preferred.",
      requirements: "Product strategy, Leadership, SaaS experience, 3+ years",
      benefits: "Competitive salary, Equity, Health benefits, Flexible hours",
      remote: false,
      status: "ACTIVE",
      employerId: employer.id,
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "CONTRACT",
      salary: "$80k - $110k",
      description: "Create beautiful and intuitive user experiences for mobile and web applications. Portfolio review required.",
      requirements: "Figma, User Research, Mobile design, Portfolio",
      benefits: "Remote work, Flexible schedule, Creative freedom",
      remote: true,
      status: "ACTIVE",
      employerId: employer.id,
    },
  });

  // Create sample application
  const application = await prisma.application.upsert({
    where: { id: 1 },
    update: {},
    create: {
      jobId: job1.id,
      applicantId: applicant.id,
      status: "APPLIED",
      coverLetter: "I am excited to apply for the Senior Frontend Developer position at TechCorp Inc. With my 4 years of experience in React and TypeScript, I believe I can contribute significantly to your team.",
      resumePath: "sample-resume.pdf",
      coverLetterPath: "sample-cover-letter.pdf",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("👤 Admin user:", admin.email);
  console.log("🏢 Employer user:", employer.email);
  console.log("👨‍💼 Applicant user:", applicant.email);
  console.log("💼 Jobs created:", [job1.title, job2.title, job3.title]);
  console.log("📝 Application created for:", job1.title);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
