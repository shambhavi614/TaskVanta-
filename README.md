# TaskFlow — Collaborative Project Management Platform

![TaskFlow](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.12-orange?style=flat-square&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, fast, and intuitive collaborative project management platform that enables teams to create projects, assign tasks, track progress, and manage team members with real-time synchronization. Built with cutting-edge technologies for optimal performance and user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Actions](#api-actions)
- [Authentication & Authorization](#authentication--authorization)
- [Performance Optimization](#performance-optimization)
- [Security & Firestore Rules](#security--firestore-rules)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

TaskFlow is a comprehensive project management solution designed for modern teams. It provides a seamless interface for creating and managing projects, assigning tasks, collaborating with team members, and tracking project progress with real-time analytics. The platform emphasizes user experience with smooth animations, intuitive interfaces, and responsive design across all devices.

### Why TaskFlow?

- ✅ **Real-time Collaboration** — Instant updates across all team members
- ✅ **Intuitive UI/UX** — Beautiful, animated interface with smooth interactions
- ✅ **Mobile Responsive** — Works seamlessly on desktop, tablet, and mobile
- ✅ **Scalable Architecture** — Built on Firebase for unlimited scalability
- ✅ **Role-Based Access** — Granular permission controls for secure teamwork
- ✅ **Production-Ready** — Enterprise-grade security and performance optimization

---

## 🚀 Key Features

### 1. **Project Management**
- Create and manage multiple projects within your workspace
- Add detailed project descriptions and metadata
- View all projects you're a member of with quick stats
- Track project creation and ownership
- Delete projects (admin only)

### 2. **Task Tracking & Kanban Board**
- Organize tasks across three intuitive statuses: **To Do**, **In Progress**, and **Done**
- Create tasks with rich details:
  - Task title and comprehensive description
  - Priority levels: Low, Medium, High, Urgent
  - Due dates with automatic overdue detection
  - Task assignment to team members
  - Creator tracking for audit purposes
- Visual priority indicators with color-coded borders
- Status-based filtering and organization
- Kanban-style drag-and-drop interface
- Task completion tracking

### 3. **Team Collaboration**
- Invite team members to projects
- Assign tasks to specific team members
- View team member profiles and contact information
- Member activity and contribution tracking
- Role-based team management

### 4. **Role-Based Access Control**
- **Admin Role**: Full project control, member management, task creation/deletion
- **Member Role**: Can create and update tasks, view project details
- Granular permission system enforced at both application and database levels
- Secure role validation on all sensitive operations

### 5. **Dashboard Analytics**
- Real-time statistics overview:
  - Total active projects
  - Total team members across all projects
  - Active and completed tasks
  - Team productivity metrics
- Visual stat cards with icons and animated counters
- Quick project overview with member and task counts
- Done task percentage tracking

### 6. **User Authentication**
- Email/Password registration and login
- Google OAuth integration for seamless single sign-on
- Secure password validation (minimum 6 characters)
- User profile management with full names and avatars
- Session persistence with secure cookies
- Automatic profile creation on signup

### 7. **Real-time Updates**
- Firebase Firestore for instant data synchronization
- Live task status updates across all team members
- Automatic UI refresh on data changes
- Optimistic updates for smooth user experience
- Efficient caching strategy with Next.js revalidation

### 8. **Modern UI/UX**
- Dark theme with carefully designed color palette
- Smooth Framer Motion animations throughout
- Responsive design for all screen sizes
- Accessible components and typography
- Intuitive navigation with sidebar and header
- Loading states and error handling
- Glassmorphic design elements

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) — Latest React-based framework with server components
- **UI Library**: React 19 — Modern, efficient component library
- **Language**: TypeScript 5 — Type-safe development
- **Styling**: 
  - Tailwind CSS — Utility-first CSS framework
  - CSS Variables — Custom design system
  - Inline Styles (React) — Dynamic styling
- **Animations**: Framer Motion 11.15 — Industry-leading animation library
- **Icons**: 
  - Lucide React — Beautiful SVG icon library
  - Heroicons — Tailwind UI icons

### Backend & Data
- **Authentication**: Firebase Authentication — Secure user management
- **Database**: Firebase Firestore — Real-time NoSQL database
- **Server Actions**: Next.js Server Actions — Direct backend logic in components
- **Type Safety**: Firebase TypeScript SDK

### Developer Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Build Optimization**: Next.js Bundle Analyzer
- **PostCSS**: CSS processing and autoprefixing
- **Font**: Inter from Google Fonts

### Infrastructure
- **Performance**: Optimized bundle size with experimental optimizePackageImports

---

## 📁 Project Structure

```
task-manager/
├── app/                           # Next.js App Router directory
│   ├── globals.css               # Global styles and CSS variables
│   ├── layout.tsx                # Root layout with auth provider
│   ├── page.tsx                  # Landing page
│   ├── actions/                  # Server actions
│   │   ├── auth.ts              # Authentication actions
│   │   ├── projects.ts          # Project management actions
│   │   └── tasks.ts             # Task management actions
│   ├── api/                      # API routes
│   │   └── projects/
│   │       └── add-member/      # Add team member endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Registration page
│   └── dashboard/               # Authenticated dashboard
│       ├── layout.tsx           # Dashboard layout with sidebar
│       ├── loading.tsx          # Loading UI skeleton
│       ├── page.tsx             # Dashboard homepage (analytics)
│       ├── projects/            # Projects section
│       │   ├── page.tsx         # All projects list
│       │   ├── new/page.tsx     # Create new project
│       │   └── [id]/            # Individual project pages
│       │       ├── page.tsx     # Project board (Kanban)
│       │       └── loading.tsx  # Project loading state
│       └── settings/            # User settings page
│           └── page.tsx
│
├── components/                    # Reusable React components
│   ├── Header.tsx               # Top navigation header
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── AnimatedButton.tsx        # Animated button component
│   ├── AnimatedCard.tsx          # Animated card container
│   ├── AnimatedContainer.tsx     # Generic animation wrapper
│   └── AnimatedList.tsx          # Animated list component
│
├── lib/                          # Utility libraries and hooks
│   ├── cssVars.ts               # CSS variable exports
│   ├── transitions.ts           # Animation configurations
│   └── firebase/                # Firebase integration
│       ├── auth.ts              # Authentication functions
│       ├── config.ts            # Firebase configuration
│       ├── firestore.ts         # Firestore database functions
│       ├── projects.ts          # Project-specific functions
│       ├── tasks.ts             # Task-specific functions
│       ├── cache.ts             # Caching utilities
│       ├── AuthContext.tsx      # React context for auth state
│       └── types.ts             # TypeScript interfaces
│
├── middleware.ts                 # Next.js middleware (auth guard)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── firestore.rules              # Firestore security rules
├── package.json                 # Project dependencies
└── README.md                    # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+ or later
- **npm** 9+ or later
- A Firebase account
- A code editor (VS Code recommended)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Firebase

Visit [Firebase Console](https://console.firebase.google.com):

1. Create a new project or select an existing one
2. Navigate to **Authentication**:
   - Enable **Email/Password** provider
   - Enable **Google** provider (optional but recommended)
3. Navigate to **Firestore Database**:
   - Create a new Firestore database in production mode
#### 3. Set Up Firebase

Visit [Firebase Console](https://console.firebase.google.com):

1. Create a new project or select an existing one
2. Navigate to **Authentication**:
   - Enable **Email/Password** provider
   - Enable **Google** provider (optional but recommended)
3. Navigate to **Firestore Database**:
   - Create a new Firestore database in production mode
   - Set region to closest location
4. Copy your Firebase configuration

#### 4. Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### 5. Deploy Firestore Security Rules

In Firebase Console, go to **Firestore Database** → **Rules** and replace with content from `firestore.rules`:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/update their own profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId;
    }
    // Authenticated users can manage projects
    match /projects/{projectId} {
      allow read, create, update, delete: if request.auth != null;
    }
    // Authenticated users can manage members
    match /project_members/{membershipId} {
      allow read, create, update, delete: if request.auth != null;
    }
    // Authenticated users can manage tasks
    match /tasks/{taskId} {
      allow read, create, update, delete: if request.auth != null;
    }
  }
}
```

#### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### Creating Your First Project

1. **Sign Up**: Create an account using email or Google
2. **Access Dashboard**: You'll land on the main dashboard with analytics
3. **Create Project**: Click "New Project" button
4. **Fill Details**: Enter project name and description
5. **Confirm**: Project is created with you as admin

### Managing Tasks

1. **Open Project**: Select a project from your projects list
2. **Create Task**: Click "Add Task" button in Kanban board
3. **Fill Task Details**:
   - Title (required)
   - Description (optional)
   - Priority level (Low/Medium/High/Urgent)
   - Due date (optional)
   - Assign to team member
4. **Update Status**: Drag task between columns or use dropdown
5. **View Details**: Click task card to see full details and make edits

### Team Collaboration

1. **Invite Members**: In project settings, add member email addresses
2. **Set Roles**: Assign Admin or Member role
3. **Assign Tasks**: Create tasks and assign to team members
4. **Track Progress**: Monitor task completion in real-time
5. **View Analytics**: Check dashboard for team productivity metrics

### Dashboard Features

- **Overview Stats**: See total projects, members, and tasks at a glance
- **Quick Actions**: Create new projects or access recent ones
- **Task Summary**: View task completion rates and distribution
- **Member List**: See all team members across projects

---

## 🏗️ Architecture

### Application Flow

```
User Request
    ↓
Middleware (Auth Guard)
    ↓
Next.js Route Handler
    ↓
Server Action (if applicable)
    ↓
Firebase Authentication/Firestore
    ↓
Response → Client Component → React Rendering → Animation
```

### Component Architecture

- **Page Components**: Handle routing and data fetching
- **Layout Components**: Provide consistent structure (Header, Sidebar)
- **Animated Components**: Reusable animation wrappers
- **Server Actions**: Handle backend logic without API routes

### State Management

- **React Context API**: Authentication state via `AuthContext`
- **Server State**: Firebase Firestore as source of truth
- **Client State**: React `useState` for UI interactions
- **Cache Strategy**: Next.js `revalidatePath` for automatic refresh

### Real-time Sync

- Firebase listeners automatically update components
- Optimistic updates for better UX
- Conflict resolution through timestamps
- Efficient data fetching with indexed queries

---

## 🗄️ Database Schema

### Firestore Collections

#### **users**
Stores user profile information.

```typescript
{
  id: string (user UID)
  email: string
  fullName: string
  avatarUrl: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### **projects**
Stores project metadata.

```typescript
{
  id: string
  name: string
  description: string
  createdBy: string (user UID)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### **project_members**
Junction collection linking users to projects with roles.

```typescript
{
  id: string
  projectId: string
  userId: string (user UID)
  role: 'admin' | 'member'
  joinedAt: Timestamp
}
```

#### **tasks**
Stores task information linked to projects.

```typescript
{
  id: string
  projectId: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: Timestamp | null
  assignedTo: string | null (user UID)
  createdBy: string (user UID)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## ⚡ API Actions

### Authentication Actions (`app/actions/auth.ts`)

```typescript
signOut() → Promise<void>
// Signs out current user and clears auth token
```

### Project Actions (`app/actions/projects.ts`)

```typescript
createProject(name: string, description: string) 
  → Promise<{ data?: Project; error?: string }>
// Creates new project with authenticated user as admin

getProjects() 
  → Promise<Project[]>
// Fetches all projects for current user with stats

getProject(id: string) 
  → Promise<Project | null>
// Fetches single project with members and tasks
```

### Task Actions (`app/actions/tasks.ts`)

```typescript
createTask(projectId, title, description, priority, dueDate, assignedTo)
  → Promise<{ data?: Task; error?: string }>
// Creates new task in project

getTasks(projectId: string)
  → Promise<Task[]>
// Fetches all tasks for a project

updateTaskStatus(taskId, status, projectId)
  → Promise<{ success?: boolean; error?: string }>
// Updates task status (used for Kanban drag-drop)

updateTask(taskId, projectId, updates)
  → Promise<{ success?: boolean; error?: string }>
// Updates task details (title, description, priority, etc)

deleteTask(taskId, projectId)
  → Promise<{ success?: boolean; error?: string }>
// Deletes a task from project
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**: User creates account with email/password or Google
2. **Profile Creation**: User profile automatically created in Firestore
3. **Token Storage**: Firebase session stored in secure cookie
4. **Middleware Check**: Every request validated via middleware
5. **Context Provider**: Auth state managed globally via React Context

### Authorization Model

- **Project Level**: Role-based (Admin/Member)
- **Task Level**: Created by users can edit own tasks
- **Database Level**: Firestore rules enforce access
- **UI Level**: Features hidden/disabled based on role

### Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create Project | ✅ | ✅ |
| Delete Project | ✅ | ❌ |
| Add Team Members | ✅ | ❌ |
| Create Task | ✅ | ✅ |
| Update Task | ✅ | ✅ |
| Delete Task | ✅ | ✅* |
| Update Project | ✅ | ❌ |
| View Analytics | ✅ | ✅ |

*Members can only delete own tasks

---

## ⚙️ Performance Optimization

### Frontend Optimization
- **Next.js Image**: Automatic image optimization
- **Code Splitting**: Route-based automatic code splitting
- **Memoization**: React `memo` for component optimization
- **Lazy Loading**: Components loaded on demand

### Bundle Optimization
- **Tree Shaking**: Unused code automatically removed
- **Package Import Optimization**: Framer Motion & Firebase imports optimized
- **CSS Optimization**: Tailwind purges unused styles

### Database Optimization
- **Indexes**: Firestore queries indexed for fast retrieval
- **Query Batching**: Multiple documents fetched efficiently
- **Caching**: Next.js revalidation reduces unnecessary queries
- **Denormalization**: Common data cached at document level

### Network Optimization
- **Server Actions**: Direct database calls without HTTP overhead
- **Streaming**: Partial page rendering while data loads
- **Compression**: Automatic gzip compression

---

## 🔒 Security & Firestore Rules

### Firestore Security Rules

The application uses fine-grained Firestore security rules:

```plaintext
- Users: Read by any authenticated user, write only own profile
- Projects: Read by authenticated users, create by any, delete by any
- ProjectMembers: Full access to authenticated users (app enforces roles)
- Tasks: Full access to authenticated users (app enforces access)
```

### Best Practices Implemented

✅ **Authentication Required**: All protected routes validate auth token
✅ **Input Validation**: Server-side validation on all actions
✅ **Environment Variables**: Sensitive config in .env.local
✅ **Password Security**: Minimum 6 characters enforced
✅ **Cookie Security**: SameSite=Lax for CSRF protection
✅ **SSL/TLS**: Enforced in production
✅ **Data Encryption**: Firebase handles at-rest encryption

---

## 🚀 Deployment

### Deploy to Railway

Railway provides a simple, modern deployment experience perfect for Next.js applications.

1. **Push to GitHub**: Ensure code is in a GitHub repository
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect Railway to GitHub**:
   - Visit [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize Railway with your GitHub account
   - Select your repository

3. **Configure Environment Variables**:
   - In Railway project dashboard, go to **Variables**
   - Add all Firebase keys:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

4. **Deploy**:
   - Railway automatically builds and deploys on push to main
   - View deployment URL in Railway dashboard
   - Domain format: `project-name-production.up.railway.app`

5. **Configure Custom Domain (Optional)**:
   - Go to **Settings** → **Custom Domain**
   - Add your domain and update DNS records
   - Railway provides SSL/TLS automatically

### Alternative: Deploy to Vercel

If you prefer Vercel, here's the setup:

1. **Push to GitHub**: Ensure code is in a GitHub repository
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repository
   - Select task-manager project

3. **Configure Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add all Firebase keys from `.env.local`

4. **Deploy**:
   - Vercel automatically deploys on push to main
   - View deployment at `your-project.vercel.app`

### Deploy Firestore Rules

```bash
# Using Firebase CLI (for both Railway and Vercel)
npm install -g firebase-tools
firebase login
firebase init # Select Firestore
firebase deploy
```

### Production Checklist

- [ ] Firebase project in production mode
- [ ] All environment variables configured in deployment platform
- [ ] Firestore security rules deployed
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled in deployment dashboard
- [ ] Error tracking configured
- [ ] Backup strategy established
- [ ] Database automated backups enabled
- [ ] SSL/TLS certificate active

---

## 👥 Contributing

We welcome contributions from the community!

### Getting Started

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use meaningful variable names
- Add comments for complex logic
- Format code with Prettier
- Test before submitting PR

### Reporting Issues

Use GitHub Issues to report bugs:
- Describe the issue clearly
- Include steps to reproduce
- Provide environment details
- Attach screenshots if applicable

---

## 🐛 Troubleshooting

### Common Issues

#### **"Firebase not initialized" Error**
**Solution**: Ensure `.env.local` is configured with correct Firebase keys. Restart dev server.

#### **Authentication Not Persisting**
**Solution**: Check browser cookies are enabled. Verify `SameSite=Lax` in auth middleware.

#### **Firestore Queries Returning Empty**
**Solution**: 
- Verify Firestore rules are deployed
- Check database has correct data
- Ensure user has proper permissions

#### **Animations Not Showing**
**Solution**: 
- Check Framer Motion is installed: `npm list framer-motion`
- Verify `'use client'` directive in animated components
- Check browser supports CSS transforms

#### **Build Fails with TypeScript Errors**
**Solution**: 
- Run `npm run lint` to see all errors
- Next.js ignores build errors by default (next.config.ts)
- Add `// @ts-ignore` for deliberate overrides

#### **Images Not Loading**
**Solution**: 
- Check Supabase URL is in `remotePatterns` in next.config.ts
- Verify image URL is HTTPS
- Check CORS headers if external source

### Performance Issues

**Slow Page Load**:
- Check Network tab in DevTools
- Verify Firestore queries are indexed
- Enable caching strategy

**High Bundle Size**:
- Analyze with `npm run bundle-analyze`
- Remove unused dependencies
- Check for duplicate packages

### Getting Help

- **Documentation**: Check [Next.js](https://nextjs.org), [Firebase](https://firebase.google.com/docs), [React](https://react.dev) docs
- **Community**: Ask on Stack Overflow with tags `nextjs`, `firebase`, `typescript`
- **Issues**: Search existing GitHub issues for solutions

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server on :3000

# Production
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run clean           # Clean .next & cache
npm run rebuild         # Full clean rebuild

# Analysis
npm run bundle-analyze  # Analyze bundle size
```

---

## 📦 Dependencies

### Key Packages

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.1.6 | React framework |
| react | 19.0.0 | UI library |
| firebase | 12.12.1 | Backend services |
| framer-motion | 11.15.0 | Animations |
| tailwindcss | 3.4.1 | Styling |
| typescript | 5 | Type safety |

See [package.json](package.json) for complete dependency list.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Firebase](https://firebase.google.com)
- Animated with [Framer Motion](https://www.framer.com/motion)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev) & [Heroicons](https://heroicons.com)

---

## 📞 Support

For questions or support, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search [Existing Issues](https://github.com/yourusername/task-manager/issues)
3. Create a [New Issue](https://github.com/yourusername/task-manager/issues/new)
4. Contact: [your-email@example.com]

---

**Made with ❤️ by Your Team**

Last Updated: April 2026
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🔥 Firebase Setup

### 1. Enable Authentication

1. Go to Firebase Console → Authentication
2. Enable **Email/Password** sign-in method

### 2. Create Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click **Create database**
3. Choose **Production mode**
4. Select your preferred location

### 3. Set Firestore Security Rules

Go to Firestore → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserId() {
      return request.auth.uid;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && getUserId() == userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.createdBy == getUserId();
      allow update, delete: if isAuthenticated();
    }
    
    // Project members collection
    match /project_members/{membershipId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
  }
}
```

## 📁 Project Structure

```
task-manager/
├── app/
│   ├── actions/          # Server actions (legacy)
│   ├── auth/            # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/       # Dashboard pages
│   │   ├── projects/
│   │   ├── settings/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         # Landing page
├── components/          # Reusable components
│   ├── Header.tsx
│   └── Sidebar.tsx
├── lib/
│   └── firebase/        # Firebase configuration
│       ├── auth.ts      # Auth functions
│       ├── config.ts    # Firebase init
│       ├── firestore.ts # Database functions
│       ├── projects.ts  # Project operations
│       ├── tasks.ts     # Task operations
│       ├── types.ts     # TypeScript types
│       └── AuthContext.tsx
├── middleware.ts        # Auth middleware
└── package.json
```

## 🗄️ Database Structure

### Collections

#### 1. **users**
```typescript
{
  id: string              // Firebase Auth UID
  email: string
  fullName: string
  avatarUrl: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 2. **projects**
```typescript
{
  id: string              // Auto-generated
  name: string
  description: string
  createdBy: string       // User ID
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 3. **project_members**
```typescript
{
  id: string              // Auto-generated
  projectId: string
  userId: string
  role: 'admin' | 'member'
  joinedAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 4. **tasks**
```typescript
{
  id: string              // Auto-generated
  projectId: string
  title: string
  description: string
  dueDate: Timestamp | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'done'
  assignedTo: string | null
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🔐 Authentication Flow

1. User signs up with email/password
2. Firebase creates auth account
3. App creates user profile in Firestore
4. User can login and access dashboard
5. Auth state managed by `AuthContext`

## 🎯 Key Features Explained

### Project Management
- Create projects with name and description
- Creator automatically becomes admin
- Admins can add/remove members
- Members can view and contribute

### Task Management
- Create tasks within projects
- Set priority (low, medium, high, urgent)
- Set due dates
- Assign to team members
- Track status (todo, in progress, done)

### Dashboard
- View all projects
- See task statistics
- Track overdue tasks
- Monitor team progress

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
npm run build
```

## 🐛 Troubleshooting

### "Not authenticated" error
- Make sure you're logged in
- Check Firebase Auth is enabled
- Verify environment variables

### "Permission denied" error
- Check Firestore Security Rules
- Ensure user has proper role
- Verify user is project member

### Tasks not loading
- Check project membership
- Verify Firestore indexes
- Check browser console for errors

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for internal use. All rights reserved.

## 🙏 Acknowledgments

- Built with Next.js 15
- Powered by Firebase
- Styled with modern CSS

---

**Last Updated:** 2026-04-30  
**Version:** 1.0.0  
**Built with** ❤️ **using Next.js & Firebase**
