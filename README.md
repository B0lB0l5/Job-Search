# **Job Search App**

## 📋 Project Overview
The **Job Search App** is a full-stack application designed to connect job seekers with relevant opportunities and streamline the hiring process for companies. This app supports user and company profiles, job listings, job applications, and advanced filters for efficient job searches.

## 🚀 Features
- **Customized Job Search Filters** - Filter jobs by working time, location, title, and skills to find the best match.
- **User and Company Management** - Secure handling of user data, company profiles, and job applications.
- **Detailed Job Listings** - Display comprehensive job descriptions, required skills, and location options.
- **Excel Report Generation** - Create Excel sheets of all applications for specific jobs by date.

## 📂 Collections

### **User Collection**
Stores all necessary information for job seekers and company HRs.
- `firstName`, `lastName`, `username` (firstName + lastName)
- `email` (unique), `password`
- `recoveryEmail` (optional), `DOB`
- `mobileNumber` (unique)
- `role` (User or Company_HR)
- `status` (online or offline)

### **Company Collection**
Contains the data for each company using the platform.
- `companyName` (unique), `description`
- `industry`, `address`
- `numberOfEmployees` (range format, e.g., 11-20)
- `companyEmail` (unique), `companyHR` (userId)

### **Job Collection**
Describes job postings with key details and requirements.
- `jobTitle`, `jobLocation` (onsite, remote, hybrid)
- `workingTime` (part-time, full-time)
- `seniorityLevel` (Junior, Mid-Level, Senior, etc.)
- `jobDescription`, `technicalSkills`, `softSkills`
- `addedBy` (companyHRId)

### **Application Collection**
Tracks each job application, associating users with jobs.
- `jobId`, `userId`
- `userTechSkills`, `userSoftSkills`
- `userResume` (PDF format, uploaded to Cloudinary)

## 📑 API Endpoints

### **User APIs**
- **Sign Up** - Register a new user.
- **Sign In** - Login using `email`, `recoveryEmail`, or `mobileNumber`.
- **Update Account** - Update user information (email, mobileNumber, etc.).
- **Delete Account** - Remove user account (only by the owner).
- **Get User Account Data** - Access personal account details (owner only).
- **Get Profile Data** - Fetch public profile data for other users.
- **Update Password** - Change the user's password.
- **Forget Password** - Password recovery with OTP.
- **Get Accounts by Recovery Email** - Retrieve all accounts linked to a recovery email.

### **Company APIs**
- **Add Company** - Register a company (Company_HR only).
- **Update Company Data** - Modify company profile data (Company_HR only).
- **Delete Company** - Remove company profile (Company_HR only).
- **Get Company Data** - Retrieve company details and related job postings.
- **Search Company by Name** - Look up companies by name.
- **Get Applications for Specific Job** - View applications for a specific job posted by the company.

### **Jobs APIs**
- **Add Job** - Post a new job (Company_HR only).
- **Update Job** - Edit job details (Company_HR only).
- **Delete Job** - Remove job listing (Company_HR only).
- **Get All Jobs with Company Info** - List jobs with associated company details.
- **Get Jobs by Company** - Retrieve jobs posted by a specific company.
- **Filter Jobs** - Search jobs by workingTime, jobLocation, seniorityLevel, jobTitle, and technicalSkills.
- **Apply to Job** - Submit an application for a job.

### **Excel Report API**
- Generate an Excel report of all job applications for a specific company on a specific day.

## 🛠️ Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Storage**: Cloudinary for resume uploads
- **Authentication**: JWT and bcrypt
- **Excel Reporting**: ExcelJS or a similar library for Excel export

## 🔒 Authentication & Authorization
- Role-based access control for endpoints.
- JWT tokens for user authentication.
- Company_HR role required for managing company data and jobs.
