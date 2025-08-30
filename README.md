# SCMS - Student Classroom Management System

**A comprehensive web-based classroom management platform featuring real-time live sessions, interactive whiteboards, QR code attendance, assignment tracking, and performance analytics.**


## 📋 Table of Contents

* [🌟 Features](#-features)
* [🚀 Tech Stack](#-tech-stack)
* [🎯 System Overview](#-system-overview)
* [📁 Project Structure](#-project-structure)
* [🛠️ Installation](#️-installation)
* [🎮 Usage Guide](#-usage-guide)
* [💡 Key Functionalities](#-key-functionalities)
* [🔧 API Documentation](#-api-documentation)
* [📱 Screenshots](#-screenshots)
* [🌐 Browser Support](#-browser-support)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [👨‍💻 Author](#-author)

## 🌟 Features

### 👨‍💼 Admin Portal - Complete System Management

* 📊 **Dashboard** - Real-time system analytics with interactive charts and KPIs
* 🏫 **Class Management** - Create, edit, and manage classroom schedules and capacity
* 👥 **Student Details** - Comprehensive student information and enrollment management
* 👨‍🏫 **Faculty Details** - Teacher profiles, qualifications, and assignment management
* 🏢 **Department Details** - Academic department structure and hierarchy management
* 🔬 **Lab Management** - Laboratory resource allocation and scheduling system
* 📝 **Feedback & Complaints** - Student feedback collection and issue resolution tracking
* 📈 **Reports & Analytics** - Advanced reporting with data visualization and insights
* 💰 **Budget Management** - Financial tracking for departments and resources
* ⚙️ **System Settings** - Global configuration and customization options

### 👨‍🏫 Teacher Portal - Classroom Excellence

* 🏠 **Dashboard** - Teacher-specific analytics and quick access to daily tasks
* 🎥 **Live Session** - Real-time classroom sessions with screen sharing and recording
* 📱 **Attendance** - Multiple attendance tracking methods (QR, manual, proximity)
* 📝 **Test Management** - Create, schedule, and grade examinations with auto-grading
* 📋 **Assignments** - Assignment creation, distribution, and grading workflows
* 👥 **Student Profiles** - Detailed student performance and behavior tracking
* 📚 **Course Content** - Upload and organize educational materials and curricula
* 📦 **Resources** - Manage teaching aids, documents, and multimedia content
* 🔔 **Notifications** - Send announcements and alerts to students and parents
* ⚙️ **Settings** - Personal preferences and teaching configuration

### 🎓 Student Portal - Academic Success

* 🏠 **Dashboard** - Personalized academic overview with upcoming tasks and grades
* 📲 **Check-in** - Smart attendance with QR codes, geolocation, and face recognition
* 👥 **Live Class** - Join live sessions with interactive participation tools
* 📋 **Assignments** - View, download, and submit assignments with progress tracking
* 📊 **Grades** - Real-time grade viewing with detailed performance analytics
* 📝 **Test Assessment** - Online examination platform with instant results
* 👫 **Study Buddy** - Peer connection system for collaborative learning and study groups

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Socket.io-client** - Real-time bidirectional communication
- **Chart.js** - Interactive data visualization
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Socket.io** - Real-time communication server
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing and security

### Database
- **MongoDB** - NoSQL document database
- **MongoDB Atlas** - Cloud database service

### Additional Tools
- **Nodemailer** - Email service integration
- **QR Code Generator** - Attendance QR code creation
- **File Upload** - Document and media handling
- **WebRTC** - Real-time video/audio communication

## 🎯 System Overview

SCMS is a comprehensive classroom management solution designed to digitize and streamline educational processes. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides seamless integration of attendance tracking, live sessions, assignment management, and performance analytics.

### 🎪 Key Highlights

* ✅ **Full-Stack Solution** - Complete MERN stack implementation
* 🔄 **Real-time Updates** - Live synchronization across all modules
* 📱 **Mobile Responsive** - Optimized for all device sizes
* 🎨 **Modern UI/UX** - Clean, intuitive, and professional design
* ⚡ **High Performance** - Optimized database queries and caching
* 🔐 **Secure Authentication** - JWT-based security with role management
* 🌐 **Scalable Architecture** - Microservices-ready design pattern

## 📁 Project Structure

```
scms/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin portal pages
│   │   │   ├── teacher/       # Teacher portal pages
│   │   │   └── student/       # Student portal pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   └── App.js             # Main app component
│   └── package.json
├── server/                     # Node.js backend
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── uploads/              # File storage
│   ├── config/               # Configuration files
│   └── server.js             # Express server
├── docs/                      # Documentation
├── .gitignore
├── README.md
└── package.json
```

## 🛠️ Installation

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**
- **Git**

### 🔧 Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/scms.git
   cd scms
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Configure environment variables
   nano .env
   ```

3. **Environment Configuration**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/scms
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scms
   
   # JWT Secret
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   # Email Configuration (Optional)
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   # Upload Configuration
   MAX_FILE_SIZE=10485760  # 10MB
   UPLOAD_PATH=./uploads
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> .env
   ```

5. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

6. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

### 🐳 Docker Setup (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 🎮 Usage Guide

### 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 **Admin** | admin@scms.edu | admin123 |
| 👨‍🏫 **Teacher** | teacher@scms.edu | teacher123 |
| 🎓 **Student** | student@scms.edu | student123 |

### 🚀 First Time Setup

1. **Admin Setup**
   - Login as admin
   - Configure system settings
   - Create departments and classes
   - Add faculty members
   - Enroll students

2. **Teacher Onboarding**
   - Login with teacher credentials
   - Complete profile setup
   - Create first course
   - Set up classroom

3. **Student Registration**
   - Login with student credentials
   - Complete profile
   - Join assigned classes

## 💡 Key Functionalities

### 🔥 Real-time Features

- **Live Sessions** - WebRTC-powered video sessions with screen sharing
- **Interactive Whiteboard** - Collaborative drawing and annotation tools
- **Real-time Chat** - Instant messaging during live sessions
- **Live Polls** - Interactive polling and quizzes
- **Hand Raising** - Virtual hand raising system

### 📊 Analytics & Reporting

- **Performance Dashboards** - Real-time academic performance metrics
- **Attendance Analytics** - Comprehensive attendance tracking and reporting
- **Grade Visualization** - Interactive charts and progress tracking
- **Behavioral Analytics** - Student engagement and participation metrics

### 🎯 Smart Attendance

- **QR Code Scanning** - Generate and scan QR codes for attendance
- **Geolocation Tracking** - Location-based attendance verification
- **Face Recognition** - AI-powered facial recognition attendance
- **Manual Override** - Teacher manual attendance marking

## 🔧 API Documentation

### Authentication Endpoints

```javascript
POST /api/auth/login         # User login
POST /api/auth/register      # User registration
POST /api/auth/logout        # User logout
GET  /api/auth/profile       # Get user profile
PUT  /api/auth/profile       # Update user profile
```

### Admin Endpoints

```javascript
GET    /api/admin/dashboard           # Dashboard analytics
GET    /api/admin/users              # Get all users
POST   /api/admin/users              # Create user
PUT    /api/admin/users/:id          # Update user
DELETE /api/admin/users/:id          # Delete user
GET    /api/admin/departments        # Get departments
POST   /api/admin/departments        # Create department
GET    /api/admin/reports            # Generate reports
```

### Teacher Endpoints

```javascript
GET    /api/teacher/dashboard        # Teacher dashboard
GET    /api/teacher/classes          # Get assigned classes
POST   /api/teacher/sessions         # Create live session
GET    /api/teacher/attendance       # Attendance records
POST   /api/teacher/assignments      # Create assignment
GET    /api/teacher/students         # Get student list
```

### Student Endpoints

```javascript
GET    /api/student/dashboard        # Student dashboard
POST   /api/student/checkin          # Mark attendance
GET    /api/student/assignments      # Get assignments
POST   /api/student/submissions      # Submit assignment
GET    /api/student/grades           # Get grades
GET    /api/student/sessions         # Get live sessions
```

## 📦 Core Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "socket.io": "^4.7.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5",
  "nodemailer": "^6.9.4",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.10.0"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "socket.io-client": "^4.7.2",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "qrcode": "^1.5.3",
  "react-webcam": "^7.1.1",
  "tailwindcss": "^3.3.3"
}
```

## 🏗️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: ['admin', 'teacher', 'student'],
  department: ObjectId,
  profile: {
    avatar: String,
    phone: String,
    address: String,
    bio: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Class Model
```javascript
{
  _id: ObjectId,
  name: String,
  department: ObjectId,
  teacher: ObjectId,
  students: [ObjectId],
  schedule: {
    days: [String],
    startTime: String,
    endTime: String,
    room: String
  },
  isActive: Boolean,
  createdAt: Date
}
```

### Attendance Model
```javascript
{
  _id: ObjectId,
  student: ObjectId,
  class: ObjectId,
  date: Date,
  status: ['present', 'absent', 'late'],
  method: ['qr', 'manual', 'face', 'geo'],
  timestamp: Date,
  location: {
    latitude: Number,
    longitude: Number
  }
}
```

## 🎨 UI Components

### Reusable Components

- **Dashboard Cards** - Analytics display components
- **Data Tables** - Sortable and filterable tables
- **Charts** - Interactive data visualization
- **Modal System** - Flexible popup system
- **Form Components** - Standardized form inputs
- **Navigation** - Role-based navigation system

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permission system
- **Password Encryption** - Bcrypt password hashing
- **Rate Limiting** - API request rate limiting
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Cross-origin request security

## 📱 Mobile Responsiveness

- **Responsive Design** - Mobile-first approach
- **Touch Optimized** - Touch-friendly interactions
- **Progressive Web App** - PWA capabilities
- **Offline Support** - Basic offline functionality

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run integration tests
npm run test:integration
```

## 📈 Performance Optimization

- **Database Indexing** - Optimized MongoDB queries
- **Caching Strategy** - Redis caching for frequently accessed data
- **Image Optimization** - Compressed image uploads
- **Code Splitting** - React lazy loading
- **Bundle Optimization** - Webpack optimization

## 🌐 Browser Support

- **Chrome** (v90+)
- **Firefox** (v88+)
- **Safari** (v14+)
- **Edge** (v90+)
- **Mobile Browsers** - iOS Safari, Chrome Mobile

## 🚀 Deployment

### Production Deployment

```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
FRONTEND_URL=https://yourdomain.com
```

## 🔮 Future Enhancements

- **AI-Powered Insights** - Machine learning for performance prediction
- **Mobile App** - Native iOS and Android applications
- **API Integration** - LMS integration capabilities
- **Advanced Analytics** - Predictive analytics and recommendations
- **Blockchain Certificates** - Secure certificate verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **MongoDB** - For the flexible database solution
- **Express.js** - For the robust backend framework
- **Socket.io** - For real-time communication capabilities
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

For support, email support@scms.edu or join our Slack channel.

---

**Made with ❤️ by [Your Name]**

*SCMS - Empowering Education Through Technology*
