![TalentHub Hero](frontend/public/hero.png)

# TalentHub: A Mini Job Portal


**Building a Platform for Job Seekers and Employers**

[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)](https://talent-hub-blond.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://talent-hub-lzvy.onrender.com/health)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)

## 🚀 Live Demo

- **Frontend**: [https://talent-hub-blond.vercel.app/](https://talent-hub-blond.vercel.app/)
- **Backend API**: [https://talent-hub-lzvy.onrender.com/](https://talent-hub-lzvy.onrender.com/)
- **Health Check**: [https://talent-hub-lzvy.onrender.com/health](https://talent-hub-lzvy.onrender.com/health)

## 🎯 Project Objective

TalentHub is a comprehensive mini job portal platform designed to connect job seekers with employers. This full-stack application demonstrates essential skills in modern web development, including frontend design, backend API development, database management, and cloud deployment.

## ✨ Core Features

### 🔹 Frontend (Next.js + Tailwind CSS)
- **🏠 Landing Page**: Clean design with TalentHub branding and job listings
- **🔐 Authentication**: Complete login/registration system with JWT tokens
- **💼 Job Management**: 
  - Browse jobs with search, filtering, and pagination
  - Detailed job view pages
  - Employer job posting interface
- **📝 Application System**: 
  - Job application forms with file uploads (resume, cover letter)
  - Application tracking and status management
- **👥 User Dashboards**: 
  - **Applicants**: View applied jobs and application status
  - **Employers**: Manage job postings and review applications
  - **Admin**: Comprehensive dashboard with analytics and user management
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX
- **🌙 Dark Mode**: Built-in theme switching capability

### 🔹 Backend (Node.js + Express + Prisma)
- **🔒 Authentication**: JWT-based authentication with role-based access control
- **🛡️ Security**: Input validation, CORS configuration, and secure file uploads
- **📊 Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **📁 File Management**: Secure file upload handling for resumes and cover letters
- **🔄 Real-time Features**: Activity tracking and notifications system
- **⚡ Performance**: Optimized queries with pagination and filtering

### 🔹 Database Schema (PostgreSQL)
- **Users**: Complete user profiles with role-based permissions
- **Jobs**: Comprehensive job postings with status management
- **Applications**: Application tracking with file attachments
- **Relationships**: Proper foreign key relationships and constraints

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Custom API client with error handling
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Custom middleware
- **Deployment**: Render

### Database
- **Database**: PostgreSQL
- **Hosting**: Render PostgreSQL

## 🚀 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Jobs
```
GET    /api/jobs           # List all jobs (with filtering)
POST   /api/jobs           # Create new job (employer only)
GET    /api/jobs/:id       # Get job details
PUT    /api/jobs/:id       # Update job (employer only)
DELETE /api/jobs/:id       # Delete job (employer only)
```

### Applications
```
POST /api/applications     # Apply for a job
GET  /api/applications     # Get user's applications
PUT  /api/applications/:id # Update application status (employer/admin)
```

### Users
```
GET /api/users/profile     # Get user profile
PUT /api/users/profile     # Update user profile
GET /api/users/activities  # Get user activities
```

## 🎨 Branding & Design

- **Project Name**: TalentHub
- **Primary Color**: Blue (#1E40AF)
- **Secondary Color**: Green (#10B981)
- **Background**: Clean white/dark theme
- **Typography**: Modern, readable fonts
- **Logo**: Simple, professional text-based design

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd talenthub
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database URL and JWT secret in .env
npm run db:migrate
npm run db:seed
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Health Check: http://localhost:8000/health

## 🌐 Deployment

### Frontend (Vercel)
- Deployed at: https://talent-hub-blond.vercel.app/
- Environment variables configured for production API

### Backend (Render)
- Deployed at: https://talent-hub-lzvy.onrender.com/
- PostgreSQL database included
- Environment variables configured for CORS and JWT

## 🏆 Bonus Features Implemented

- ✅ **File Upload**: Resume and cover letter uploads with validation
- ✅ **Admin Panel**: Complete admin dashboard with analytics
- ✅ **Search/Filter**: Advanced job search with multiple filters
- ✅ **Dark Mode**: Seamless theme switching
- ✅ **Analytics**: Application statistics and user activity tracking
- ✅ **Responsive Design**: Mobile-optimized interface
- ✅ **Role-based Access**: Different interfaces for different user types
- ✅ **Real-time Updates**: Activity tracking and status updates
- ✅ **Professional UI**: Modern design with shadcn/ui components

## 📊 Project Highlights

- **Clean Architecture**: Well-structured codebase with separation of concerns
- **Type Safety**: TypeScript throughout the frontend with proper type definitions
- **Security**: Input validation, CORS configuration, and secure authentication
- **Performance**: Optimized queries, pagination, and efficient state management
- **User Experience**: Intuitive interface with proper error handling and loading states
- **Scalability**: Modular design that can easily accommodate new features

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30d
PORT=8000
NODE_ENV=production
CORS_ORIGINS=http://localhost:3000,https://talent-hub-blond.vercel.app
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://talent-hub-lzvy.onrender.com/api
```

## 📝 Test Credentials

For testing purposes, you can use these sample credentials:

**Employer Account:**
- Email: employer@techcorp.com
- Password: employer123

**Applicant Account:**
- Email: applicant@example.com
- Password: applicant123

**Admin Account:**
- Email:  admin@talenthub.com
- Password: admin123

## 🤝 Contributing

This project was built as a test/demonstration project showcasing full-stack development skills. The codebase follows best practices and is well-documented for easy understanding and extension.

## 📄 License

This project is created for demonstration purposes.

---

**Built with ❤️ using modern web technologies**
