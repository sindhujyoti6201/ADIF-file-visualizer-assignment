# ADIF Healthcare Dashboard

A comprehensive healthcare analytics and patient management system with **3D visualization capabilities** and real-time data processing.

## ✨ Features

- **📁 File Upload**: Upload patient reports to get detailed disease insights and analytics
- **🏥 Doctors Dashboard**: Comprehensive doctor management with analytics and filtering
- **👥 Patients Dashboard**: Patient records and data visualization
- **🎯 3D Human Body Visualization**: Interactive 3D models of brain, heart, lungs, spine, and digestive system
- **📊 Interactive Analytics**: Age distribution, diagnosis breakdown, vital signs trends
- **🔔 Toast Notifications**: Real-time user feedback during processing
- **📱 Responsive Design**: Modern UI with smooth animations
- **⚡ Real-time Processing**: Live data processing with progress indicators
- **🎨 Modern UI**: Beautiful gradient backgrounds and smooth transitions

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose (for backend)
- Node.js 18+ and npm (for frontend)
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ADIF-file-visualizer-assignment
   ```

2. **Start the backend (Docker)**
   ```bash
   docker-compose up --build
   ```

3. **Start the frontend (Local)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🏥 Dashboard Features

### Main Dashboard
- **Upload Patient Reports**: Drag and drop or click to upload medical files
- **Real-time Processing**: Live progress indicators during data analysis
- **Healthcare Analytics**: Comprehensive patient data insights
- **Quick Actions**: Direct access to doctors and patients dashboards

### Doctors Dashboard
- **Doctor Profiles**: Detailed information about healthcare professionals
- **Analytics**: Performance metrics and patient statistics
- **Filtering**: Search and filter doctors by specialty, location, etc.
- **Appointment Booking**: Direct integration for scheduling

### Patients Dashboard
- **Patient Records**: Comprehensive patient data management
- **Health Analytics**: Vital signs, diagnosis, and treatment history
- **Insights**: Data-driven insights and trends
- **Visualization**: Interactive charts and graphs

### 3D Visualization
- **Interactive Models**: Brain, Heart, Lungs, Spine, Digestive System
- **3D Controls**: Zoom, rotate, and pan with mouse/touch
- **Educational Content**: Detailed descriptions of each body part
- **Responsive Design**: Works on desktop and mobile devices

## 🔔 Toast Notification System

Enhanced user experience with real-time feedback:

- **File Selection**: Confirmation when file is selected
- **Upload Progress**: Loading indicators during file upload
- **Processing Status**: Real-time updates during data processing
- **Success Messages**: Confirmation when data is processed successfully
- **Error Handling**: Clear error messages for failed operations
- **Navigation**: Notifications when switching between dashboards

## 📊 Analytics Features

### Key Metrics
- Total Doctors Count
- Total Patients Count
- Appointments Today
- Files Uploaded

### 2D Visualizations
- **Age Distribution**: Bar chart showing patient age groups
- **Diagnosis Distribution**: Breakdown of medical diagnoses
- **Vital Signs Trends**: Heart rate trends over time
- **Gender Distribution**: Pie chart of patient gender
- **Length of Stay Analysis**: Patient stay duration patterns

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **3D Graphics**: Three.js, React Three Fiber
- **Charts**: D3.js
- **Styling**: Inline styles with modern design
- **Notifications**: React Hot Toast
- **Backend**: FastAPI (Python)
- **Containerization**: Docker (Backend only)

## 📁 Project Structure

```
ADIF-file-visualizer-assignment/
├── backend/                 # FastAPI backend service (Dockerized)
│   ├── data/               # Healthcare data files
│   │   ├── doctors-data.json
│   │   ├── patients-data.json
│   │   └── patient-info.json
│   ├── main.py             # FastAPI application
│   ├── Dockerfile          # Backend container configuration
│   └── setup.md            # Detailed setup guide
├── frontend/               # Next.js frontend application (Local)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── DoctorsDashboard.tsx
│   │   │   ├── PatientsDashboard.tsx
│   │   │   ├── DoctorsTable.tsx
│   │   │   ├── PatientsTable.tsx
│   │   │   └── DoctorProfileModal.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx           # Main dashboard
│   │   │   ├── doctors.tsx         # Doctors dashboard
│   │   │   ├── patients.tsx        # Patients dashboard
│   │   │   ├── visualization.tsx   # 3D visualization
│   │   │   └── patient-info-dashboard.tsx
│   │   └── services/
│   │       └── api.ts
│   ├── public/
│   │   └── models/
│   │       └── human-body/         # 3D model files
│   └── package.json
├── docker-compose.yml      # Backend service orchestration
└── README.md              # This file
```

## 🎨 UI/UX Improvements

### Modern Design
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: 60fps rendering for fluid experience
- **Interactive Elements**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes

### 3D Visualization
- **Interactive Controls**: Mouse and touch support for exploration
- **Model Selection**: Easy switching between body parts
- **Educational Content**: Detailed descriptions and information
- **Performance Optimized**: Efficient rendering with proper cleanup

### Toast Notifications
- **Success Toasts**: Green notifications for successful operations
- **Error Toasts**: Red notifications for errors with clear messages
- **Loading Toasts**: Persistent loading indicators during processing
- **Info Toasts**: Blue notifications for informational messages

## 🚀 Deployment

### Local Development
```bash
# Start backend
docker-compose up --build

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Production Deployment
```bash
# Build and push Docker images (Backend only)
docker build -t sidutta/adif-file-visualizer-assignment-server:v1 ./backend
docker push sidutta/adif-file-visualizer-assignment-server:v1

# Deploy backend with docker-compose
docker-compose up -d

# Deploy frontend (build and serve static files)
cd frontend
npm run build
npm start
```

## 📈 API Endpoints

- `GET /health` - Health check endpoint
- `POST /upload` - File upload endpoint
- `GET /doctors` - Get doctors data
- `GET /patients` - Get patients data
- `POST /patient-info` - Process patient information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Latest Features Added:**

- ✅ **3D Human Body Visualization** with interactive models
- ✅ **Doctors Dashboard** with comprehensive analytics
- ✅ **Patients Dashboard** with health data visualization
- ✅ **Modern UI Design** with gradients and animations
- ✅ **Enhanced Navigation** with improved user experience
- ✅ **Real-time Processing** with progress indicators
- ✅ **Toast Notification System** with React Hot Toast
- ✅ **Responsive Design** for all screen sizes
