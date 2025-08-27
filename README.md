# 🎬 VideoVault

> Premium Video Editor Marketplace - Connecting clients with professional video editors

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-green?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org/)

## 🎯 Overview

VideoVault is a dark-themed, UI-focused marketplace that connects clients with professional video editors. Built for the modern creator economy, it offers seamless project management, secure payments, and a premium user experience.

**Live Demo:** [videovault.app](https://videovault.app) _(Coming Soon)_

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│  (Express.js)   │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Dark UI       │    │ • REST APIs     │    │ • User Profiles │
│ • Responsive    │    │ • JWT Auth      │    │ • Projects      │
│ • Interactive   │    │ • File Upload   │    │ • Bids & Reviews│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.x
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/videovault.git
cd videovault

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Environment setup
cp .env.example .env
# Configure your environment variables
```

### Development

```bash
# Terminal 1: Start Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 3000)
cd frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
videovault/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router (Next.js 14)
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── dashboard/   # User dashboards
│   │   │   ├── projects/    # Project pages
│   │   │   └── profiles/    # User profiles
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── forms/       # Form components
│   │   │   └── layout/      # Layout components
│   │   ├── lib/             # Utilities & API calls
│   │   ├── hooks/           # Custom React hooks
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js      # Authentication
│   │   │   ├── users.js     # User management
│   │   │   ├── projects.js  # Project CRUD
│   │   │   ├── bids.js      # Bidding system
│   │   │   └── payments.js  # Payment processing
│   │   ├── models/          # MongoDB models
│   │   │   ├── User.js      # User schema
│   │   │   ├── Project.js   # Project schema
│   │   │   ├── Bid.js       # Bid schema
│   │   │   └── Review.js    # Review schema
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js      # JWT verification
│   │   │   ├── roles.js     # Role-based access
│   │   │   └── validation.js# Input validation
│   │   ├── controllers/     # Business logic
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── docs/                    # Documentation
├── .gitignore
└── README.md
```

---

## 🎨 Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer + Cloudinary
- **Validation:** Joi
- **Payment:** Razorpay/Stripe

### Development Tools

- **Language:** TypeScript
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library
- **Version Control:** Git + GitHub

---

## 🌟 Key Features

### 👤 User Management

- **Dual Roles:** Client and Editor accounts
- **JWT Authentication:** Secure token-based auth
- **Profile System:** Detailed profiles with portfolios
- **Rating System:** 5-star reviews and feedback

### 📋 Project Management

- **Project Posting:** Detailed project requirements
- **Advanced Search:** Filter by budget, skills, timeline
- **File Sharing:** Reference materials and deliverables
- **Status Tracking:** Real-time project updates

### 💰 Bidding & Payments

- **Proposal System:** Editors submit detailed bids
- **Secure Payments:** Escrow-based transactions
- **Commission Model:** 15% platform fee
- **Multiple Payment:** Fixed price and hourly rates

### 🎯 User Experience

- **Dark Theme:** Modern, eye-friendly interface
- **Responsive Design:** Mobile-first approach
- **Real-time Updates:** Live notifications
- **Fast Performance:** Optimized for speed

---

## 🔐 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/videovault

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Environment
NODE_ENV=development
PORT=5000
```

---

## 📊 Database Schema

### User Model

```javascript
{
  email: String,
  password: String, // bcrypt hashed
  role: "client" | "editor",
  profile: {
    name: String,
    avatar: String,
    bio: String,
    skills: [String], // editor only
    hourlyRate: Number, // editor only
    company: String, // client only
    portfolio: [String] // editor only
  },
  ratings: { average: Number, total: Number },
  isVerified: Boolean,
  createdAt: Date
}
```

### Project Model

```javascript
{
  title: String,
  description: String,
  category: String,
  budget: { min: Number, max: Number, type: String },
  requirements: { duration: String, deliverables: [String] },
  client: ObjectId,
  status: "open" | "in_progress" | "completed",
  bids: [ObjectId],
  selectedEditor: ObjectId,
  deadline: Date,
  createdAt: Date
}
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build and deploy
npm run build
vercel --prod
```

### Backend (Railway/Render)

```bash
# Environment: NODE_ENV=production
# Build Command: npm install
# Start Command: npm start
```

### Database (MongoDB Atlas)

- Create cluster on [MongoDB Atlas](https://cloud.mongodb.com/)
- Whitelist IP addresses
- Update connection string in environment variables

---

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run all tests
npm run test:all
```

---

## 📈 Development Roadmap

### Phase 1: MVP (Weeks 1-8) ✅

- [x] Authentication system
- [x] User profiles (client/editor)
- [x] Project posting and browsing
- [x] Basic bidding system
- [x] Dark theme UI

### Phase 2: Core Features (Weeks 9-12)

- [ ] Payment integration (Razorpay)
- [ ] File upload and sharing
- [ ] Review and rating system
- [ ] Advanced search and filters
- [ ] Real-time notifications

### Phase 3: Advanced Features (Month 4+)

- [ ] Video conferencing integration
- [ ] AI-powered matching
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Premium subscriptions

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint + Prettier configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📞 Support & Contact

- **Email:** support@videovault.app
- **Discord:** [Join our community](https://discord.gg/videovault)
- **Issues:** [GitHub Issues](https://github.com/your-username/videovault/issues)
- **Documentation:** [docs.videovault.app](https://docs.videovault.app)

---

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Next.js** team for amazing developer experience
- **MongoDB** for flexible database solutions
- **Vercel** for seamless deployment

---
