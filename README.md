# Unwind Wellness Platform

Unwind is a premium, holistic wellness platform designed to help users track, understand, and improve their mental health. It provides a comprehensive suite of tools for monitoring mood, managing stress, optimizing sleep, and practicing mindfulness.

## 🌟 Key Features

- **Personalized Dashboard**: A high-level overview of your mental well-being, featuring a dynamic **Mental Score** calculated from your recent activity.
- **Mood Tracking**: Log your daily emotional state with a beautiful, intuitive interface. Our system ensures your mood history is accurately pinned to your local calendar day.
- **Stress Management**: Track stress levels, identify stressors, and analyze the impact on your life with secure, authenticated logging.
- **Sleep Optimization**: Monitor your sleep quality, set personalized schedules, and use the integrated sleep timer to capture your biological rest patterns.
- **Mindfulness & Meditation**: Engage in timed mindfulness sessions with a variety of categories. Track your "Mindful Hours" and see your progress over time.
- **Health Journals**: Private space to reflect and document your thoughts, helping you identify patterns in your mental health journey.

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Zustand
- **Styling**: Modern CSS / TailwindCSS
- **Animations**: Framer Motion / Lucide React Icons

### **Backend**
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (via Neon / Render)
- **ORM**: Prisma
- **Security**: JWT-based Authentication with secure password hashing.

## 🚀 Recent Production Fixes

The platform has recently undergone a stability overhaul to address critical production issues:
- **Timezone Synchronization**: Resolved a bug where mood entries appeared on the wrong day by implementing local-date normalization.
- **Security Hardening**: Migrated all wellness modules (Stress, Sleep, Mindful) to a secure JWT-authenticated architecture.
- **Performance Optimization**: Eliminated dashboard flickering and excessive API calls by centralizing data fetching logic.
- **API Robustness**: Replaced manual `userId` passing with secure token-based identity extraction on the backend.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Unwind_mobile
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Configure your .env file with DATABASE_URL and JWT_SECRET
   npx prisma generate
   npm run start:dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Configure your .env.local with NEXT_PUBLIC_API_URL
   npm run dev
   ```

## 📄 License
This project is for academic and personal wellness tracking purposes.
