# ByteBharat

ByteBharat is a modern, visually immersive short-form learning platform. Inspired by the engaging experience of modern video reels, ByteBharat delivers educational content through a dynamic, responsive, and distraction-free interface. The platform emphasizes premium design, utilizing glassmorphism, fluid animations, and a high-end dark theme to create a state-of-the-art learning environment.

## Key Features

*   **Immersive Video Feed**: A scrollable, 9:16 vertical video feed optimized for seamless content consumption and high performance.
*   **Robust Authentication System**: Highly secure authentication utilizing JWT Access and Refresh Tokens. It features automatic refresh token rotation, global interceptors for seamless session continuation, and AES-256-CBC encryption for refresh tokens stored in the database.
*   **Learning Streaks**: Gamified learning tracking that increments a user's streak based on consecutive daily logins to encourage consistent engagement.
*   **Interactive Engagement**: Full suite of social learning tools including likes, comments, and sharing mechanisms.
*   **Notification System**: Real-time updates for user interactions and platform activities.
*   **Premium Aesthetic**: A dark-themed UI featuring curated color palettes, smooth micro-animations, and glassmorphic elements built with Tailwind CSS and Framer Motion.

## Technology Stack

### Frontend
*   React 19
*   Vite
*   Tailwind CSS v4
*   Framer Motion
*   React Router DOM
*   Axios

### Backend
*   Node.js
*   Express.js
*   MongoDB (with Mongoose)
*   JSON Web Tokens (JWT)
*   Bcrypt
*   Multer (for media handling)

## Project Structure

The project follows a standard client-server architecture.

```
ByteBharat/
├── backend/                  # Express.js server application
│   ├── src/
│   │   ├── config/           # Database and application configuration
│   │   ├── controllers/      # Request handlers and business logic
│   │   ├── middleware/       # Custom middleware (e.g., authentication checks)
│   │   ├── models/           # Mongoose database schemas
│   │   ├── routes/           # API route definitions
│   │   └── services/         # Dedicated services (e.g., cryptographic token handling)
│   ├── .env                  # Backend environment variables
│   └── server.js             # Application entry point
│
└── frontend/                 # Vite + React application
    ├── src/
    │   ├── assets/           # Static assets like images and global styles
    │   ├── components/       # Reusable UI components (VideoCard, Layout, etc.)
    │   ├── pages/            # Application views (Feed, Home, Login, Profile)
    │   └── services/         # Frontend services (e.g., Axios auth interceptors)
    └── package.json          # Frontend dependencies
```

## Prerequisites

Before running the application, ensure you have the following installed:
*   Node.js (v18 or higher recommended)
*   npm
*   MongoDB (running locally or a MongoDB Atlas URI)

## Installation and Setup

### 1. Clone the repository
Ensure you have cloned or downloaded the project repository to your local machine.

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure the environment.

```bash
cd backend
npm install
```

Create or verify the `.env` file in the `backend` directory. It requires the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bytebharat
JWT_SECRET=your_secure_jwt_secret
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
```

Start the backend development server:
```bash
npm run dev
```
The server will start on port 5000 and connect to the local MongoDB instance.

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

The frontend uses Vite environments. If needed, create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` (or the next available port like 5174).

## Current Development Status

This project is actively in development. Core architectures, including the secure authentication flow, foundational UI components, and the primary video feed mechanisms, are established. Future updates will focus on expanding content delivery features, enhancing user profiles, and optimizing media streaming.
