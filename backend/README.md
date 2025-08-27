# TalentHub Backend API

A comprehensive backend API for the TalentHub job portal platform, built with Node.js, Express.js, and Prisma ORM.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for users with different roles (Applicant, Employer, Admin)
- **Job Management**: Create, read, update, and delete job postings
- **Application System**: Apply for jobs with file uploads (resume, cover letter)
- **File Upload**: Support for PDF, DOC, and DOCX files
- **Search & Filtering**: Advanced job search with multiple criteria
- **Pagination**: Efficient data pagination for large datasets
- **Admin Panel**: Comprehensive admin dashboard with statistics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/talenthub"
   DIRECT_URL="postgresql://username:password@localhost:5432/talenthub"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
   JWT_EXPIRES_IN="7d"
   
   # Server Configuration
   PORT=8000
   NODE_ENV="development"
   
   # File Upload Configuration
   UPLOAD_PATH="./uploads"
   MAX_FILE_SIZE=10485760
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employer",
  "phone": "+1234567890",
  "location": "New York, NY",
  "experience": "5+ years",
  "currentRole": "Software Engineer",
  "expectedSalary": "$100,000",
  "portfolio": "https://portfolio.com",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication).

### Jobs

#### GET `/api/jobs`
Get all jobs with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for title, company, or description
- `type`: Job type filter (Full-time, Part-time, Contract, Internship)
- `location`: Location filter (remote, onsite, or specific location)
- `status`: Job status (default: ACTIVE)

#### GET `/api/jobs/:id`
Get a specific job by ID.

#### POST `/api/jobs`
Create a new job (employer only).

**Request Body:**
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "type": "Full-time",
  "salary": "$120k - $160k",
  "description": "Job description here...",
  "requirements": "Requirements here...",
  "benefits": "Benefits here...",
  "remote": true
}
```

#### PUT `/api/jobs/:id`
Update a job (employer only).

#### DELETE `/api/jobs/:id`
Delete a job (employer only).

#### GET `/api/jobs/employer/my-jobs`
Get jobs posted by the current employer.

### Applications

#### POST `/api/applications`
Apply for a job (applicant only).

**Request Body (multipart/form-data):**
- `jobId`: Job ID to apply for
- `coverLetter`: Cover letter text
- `resume`: Resume file (required)
- `coverLetterFile`: Cover letter file (optional)
- Additional user profile fields

#### GET `/api/applications/my-applications`
Get current user's applications (applicant only).

#### GET `/api/applications/job/:jobId`
Get applications for a specific job (employer only).

#### PATCH `/api/applications/:id/status`
Update application status (employer only).

**Request Body:**
```json
{
  "status": "SHORTLISTED"
}
```

#### GET `/api/applications/:id`
Get a specific application by ID.

### Users

#### GET `/api/users/profile`
Get current user profile.

#### PUT `/api/users/profile`
Update current user profile.

#### PUT `/api/users/change-password`
Change user password.

#### GET `/api/users`
Get all users (admin only).

#### GET `/api/users/:id`
Get user by ID (admin only).

#### PATCH `/api/users/:id/role`
Update user role (admin only).

#### DELETE `/api/users/:id`
Delete user (admin only).

#### GET `/api/users/stats/overview`
Get system statistics (admin only).

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 👥 User Roles

- **APPLICANT**: Can apply for jobs and manage their applications
- **EMPLOYER**: Can post jobs and manage applications
- **ADMIN**: Full system access and user management

## 📁 File Uploads

- **Supported Formats**: PDF, DOC, DOCX
- **Maximum Size**: 10MB (configurable)
- **Storage**: Local file system (`./uploads` directory)
- **Access**: Files are served at `/uploads/filename`

## 🗄️ Database Schema

### Users
- Basic info (name, email, password)
- Role-based permissions
- Professional details (experience, portfolio, etc.)

### Jobs
- Job details (title, company, location, type)
- Requirements and benefits
- Status management (Active, Closed, Draft)

### Applications
- Job application details
- File attachments (resume, cover letter)
- Status tracking (Applied, Shortlisted, Rejected, Hired)

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Seed database with sample data
```

### Project Structure

```
backend/
├── middleware/          # Authentication and authorization middleware
├── routes/             # API route handlers
├── uploads/            # File upload directory
├── prisma/             # Database schema and migrations
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `DIRECT_URL` | Direct database connection | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `development` |
| `MAX_FILE_SIZE` | Maximum file upload size | `10485760` (10MB) |

## 🧪 Testing

The API includes sample data for testing:

- **Admin User**: `admin@talenthub.com` / `admin123`
- **Employer User**: `employer@techcorp.com` / `employer123`
- **Applicant User**: `applicant@example.com` / `applicant123`

## 📊 Health Check

Check API status at: `GET /health`

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Update documentation for new endpoints

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions, please check the documentation or create an issue in the repository.
