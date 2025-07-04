# ThreadComm

A full-stack real-time dispute resolution and chat application for Investors, Issuers, and Admins.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Backend (Node.js/Express)](#backend-nodejsexpress)
  - [Setup](#backend-setup)
  - [Models](#backend-models)
  - [API Endpoints](#backend-api-endpoints)
  - [Socket.IO Events](#backend-socketio-events)
- [Frontend (React)](#frontend-react)
  - [Setup](#frontend-setup)
  - [Main Components & Pages](#frontend-main-components--pages)
  - [Authentication Flow](#frontend-authentication-flow)
  - [Thread & Messaging Flow](#frontend-thread--messaging-flow)
- [Usage Guide](#usage-guide)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Overview

ThreadComm is a real-time chat and dispute resolution platform. It allows Investors and Issuers to create threads (disputes) and chat with Admins. Admins can manage and close threads. The app uses a Node.js/Express backend with MongoDB and a React frontend with Socket.IO for real-time messaging.

## Features

- User authentication (Investor, Issuer, Admin roles)
- Create, view, and manage dispute threads
- Real-time chat within threads
- Admin controls to close threads
- Responsive, modern UI (React + TailwindCSS)

## Project Structure

```
threadcomm/
  backend/      # Express backend API & Socket.IO server
  frontend/     # React frontend app
```

---

## Backend (Node.js/Express)

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set up environment variables (see [Environment Variables](#environment-variables)).
3. Start the server:
   ```bash
   npm start
   ```
   The backend runs on `http://localhost:3000` by default.

### Backend Models

- **User**
  - `role`: 'Investor' | 'Issuer' | 'Admin'
  - `email`: String (unique)
  - `password`: String (hashed)
- **DisputeThread**
  - `creator`: User reference
  - `status`: 'open' | 'closed'
  - `metadata`: Object (e.g., title)
  - `participants`: [User references]
- **Message**
  - `thread`: DisputeThread reference
  - `sender`: User reference
  - `content`: String
  - `timestamp`: Date

### Backend API Endpoints

#### Auth

- `POST /auth/register` — Register a new user
  - Body: `{ email, password, role }`
- `POST /auth/login` — Login
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

#### Threads

- `POST /threads` — Create a new thread (Investor/Issuer only)
  - Body: `{ metadata }` (e.g., `{ title }`)
  - Auth: Bearer token
- `GET /threads` — List threads
  - Admin: all threads
  - Investor/Issuer: only their threads
  - Auth: Bearer token
- `GET /threads/:id` — Get thread by ID
  - Auth: Bearer token
- `GET /threads/:id/messages` — Get messages for a thread
  - Auth: Bearer token
- `PATCH /threads/:id` — Update thread status (Admin only)
  - Body: `{ status }` (e.g., `{ status: 'closed' }`)
  - Auth: Bearer token

#### Users

- `GET /users` — (Demo route, returns a placeholder response)

#### Root

- `GET /` — (Demo route, renders index page)

### Backend Socket.IO Events

- **Client emits:**
  - `join-thread` — Join a thread room for real-time updates
    - Payload: `threadId`
  - `send-message` — Send a message in a thread
    - Payload: `{ threadId, content }`
- **Server emits:**
  - `receive-message` — Broadcasts a new message to all clients in the thread
    - Payload: `{ threadId, sender, content, timestamp }`

---

## Frontend (React)

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default (Vite).

### Main Components & Pages

- **Login / Signup** — User authentication
- **Home** — Redirects to AdminDashboard or UserDashboard based on role
- **AdminDashboard** — Admin view: list all threads, chat, close threads
- **UserDashboard** — Investor/Issuer view: list own threads, create thread, chat
- **ChatWindow** — Real-time chat UI for a thread
- **SidePanel** — Thread list and filters
- **ThreadForm** — Create a new thread (Investor/Issuer)

### Authentication Flow

- Users sign up or log in (role: Investor, Issuer, Admin)
- JWT token is stored in localStorage
- Authenticated requests include the token in the `Authorization` header

### Thread & Messaging Flow

- Investors/Issuers create threads and send initial messages
- Admins see all threads, can join and close them
- Real-time chat is handled via Socket.IO
- Messages are fetched via REST and updated in real-time via sockets

---

## Usage Guide

1. **Register** as Investor, Issuer, or Admin
2. **Login**
3. **Create a thread** (Investor/Issuer) or **view threads** (Admin)
4. **Chat** in real-time within a thread
5. **Admin** can close threads when resolved

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

---

## License

MIT
