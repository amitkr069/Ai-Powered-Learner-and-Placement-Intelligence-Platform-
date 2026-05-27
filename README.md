# Learner Intelligence Frontend

Frontend application for the AI Powered Learner & Placement Intelligence Platform.

Built using React.js and Vite with a modern dark-themed dashboard UI.

---

# Features

- Admin Dashboard
- Learner Management
- CSV Upload UI
- Mentor Dashboard
- Assessment Management
- AI Prediction UI
- Analytics Dashboard
- Real-time Notifications UI
- Responsive Design
- Modern Dark Theme

---

# Tech Stack

- React.js
- Vite
- React Router DOM
- Axios
- Recharts
- Socket.IO Client
- CSS3

---

# Frontend Structure

```bash
learner-intelligence-frontend/

│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Setup Instructions

# 1️. Clone Repository

```bash
git clone <repository-url>
```

---

# 2️. Move to Frontend Folder

```bash
cd learner-intelligence-frontend
```

---

# 3️. Install Dependencies

```bash
npm install
```

---

# 4️. Run Development Server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

#  Available Pages

| Page | Route |
|---|---|
| Login | `/` |
| Admin Dashboard | `/admin` |
| Add Learner | `/add-learner` |
| CSV Upload | `/csv-upload` |
| Mentor Dashboard | `/mentor` |
| Assessment | `/assessment` |
| AI Prediction | `/prediction` |
| Analytics | `/analytics` |
| Notifications | `/notifications` |

---

#  Backend Integration

Frontend connects with:

- Spring Boot Backend APIs
- Node.js Socket.IO Server
- Python ML Prediction API

---

#  API Flow

```text
React Frontend
      ↓
Spring Boot APIs
      ↓
PostgreSQL
```

```text
React Frontend
      ↕
Socket.IO Server
```

```text
React Frontend
      ↓
Python ML API
```

---

#  Authentication

- JWT Token Based Authentication
- Protected Routes
- Role-based Access

---

#  Main Modules

- Dashboard UI
- Learner Forms
- Analytics Cards
- Prediction UI
- Notifications UI
- Assessment UI

---

#  Deployment Ready

Can be deployed using:

- Docker
- AWS EC2
- Nginx
- Jenkins CI/CD

---


