# <img src="./public/paperloom.png" alt="paperloom Logo" class="w-10 h-10 pr-2 inline-block" style="height: 86px; vertical-align: middle;" />

# Paperloom - PDF Management & Collaboration System

## Overview

Paperloom is a web application designed for seamless PDF management and collaboration. This system enables users to sign up, upload PDFs, share documents securely, and collaborate through comments. Built with modern web technologies, Paperloom provides an intuitive interface for managing PDF documents efficiently.

[![Live Demo](https://img.shields.io/badge/DEMO-LIVE-brightgreen)](https://your-deployment-link.com)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

### Core Functionality

- **User Authentication**: Secure signup / login with JWT
- **PDF Upload**: Secure file upload with validation
- **Dashboard**: Central hub for managing documents
- **File Sharing**: Generate unique shareable links
- **Collaborative Commenting**: Add comments on shared documents
- **PDF Viewer**: User-friendly document interface

### Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- File access controls
- Secure file storage

### Good-to-Have Features

- Password reset functionality
- Email notifications on file sharing
- Comment replies and threading
- Basic text formatting in comments

## Technology Stack

### Frontend

- **React** (v18) - UI framework
- **Next.js** (v14.2.26) - React framework
- **Tailwind CSS** - Styling framework
- **daisyUI** - Component library
- **react-hot-toast** - Notifications

### Backend

- **Next.js API Routes** - Server-side logic
- **Prisma** (v6.8.2) - ORM
- **PostgreSQL** - Database
- **Redis** (via ioredis) - Caching

### Services

- **Uploadthing** - File upload service
- **Nodemailer** - Email functionality
- **Kafka** (via kafkajs) - Message queueing
- **JSON Web Tokens** - Authentication

## Getting Started

Follow these instructions to set up Paperloom locally:

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Redis server
- Kafka (optional for background tasks)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/paperloom.git
   cd paperloom
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/paperloom?schema=public"
   JWT_SECRET="your_jwt_secret_here"
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"
   REDIS_URL="redis://localhost:6379"
   SMTP_HOST="your_email_host"
   SMTP_PORT=587
   SMTP_USER="your_email_user"
   SMTP_PASS="your_email_password"
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser at `http://localhost:3000`

## Project Structure

```
paperloom/
├── prisma/            # Database schema
├── src/
│   ├── app/           # Next.js application routes
│   ├── components/    # React components
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript types
│   └── styles/        # Global styles
├── public/            # Static assets
├── .env.example       # Environment variables template
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Deployment

Paperloom is deployed on Vercel. The deployment process is automated through GitHub integration:

1. Push changes to the `main` branch
2. Vercel automatically builds and deploys the application
3. Database migrations are applied via the build script:
   ```bash
   npm run build
   ```

## Deliverables

1. **Working Application**: [Live Demo](https://your-deployment-link.com)
2. **Feature Showcase Videos**:
   - [User Authentication & Dashboard Walkthrough](video-link-1)
   - [PDF Upload & Sharing Demo](video-link-2)
   - [Collaborative Commenting Features](video-link-3)
3. **Source Code**: [GitHub Repository](https://github.com/your-username/paperloom)

## Future Enhancements

1. Document versioning system
2. PDF annotation tools
3. Real-time collaboration features
4. Advanced search functionality
5. User roles and permissions
6. Mobile application integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ for the Spotdraft Junior Engineer Task**  
[Project Documentation](https://your-documentation-link.com) | [Developer Portfolio](https://your-portfolio.com)
