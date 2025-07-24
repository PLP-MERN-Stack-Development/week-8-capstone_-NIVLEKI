# Mental Wellness App



A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to help users track their mental health through mood tracking, journaling, and breathing exercises.

## Features

### Core Functionality
- **User Authentication** (JWT)
  - Secure registration/login
  - Password hashing with bcrypt
  - Protected routes
- **Mood Tracking**
  - Daily mood logging (happy, sad, angry, neutral, anxious)
  - Mood history visualization (last 7 days)
  - Prevention of duplicate daily logs
- **Journal System**
  - Create/edit/delete entries
  - Markdown support
  - Entry history
- **Breathing Exercises**
  - 4-7-8 breathing technique
  - Animated visual guide
  - Cycle counter
- **Dashboard**
  - Mood summary chart
  - Recent journal preview
  - Quick action buttons

## Tech Stack

### Frontend
- React.js
- React Router
- Chart.js (for mood charts)
- React Markdown (for journal entries)
- Tailwind CSS (styling)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (authentication)
- Bcrypt (password hashing)
- CORS (cross-origin requests)

## Installation

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas URI)
- npm or yarn

### Backend Setup
1. Navigate to backend folder:
   ```bash
   cd backend