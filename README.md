# ADIF File Visualizer

A modern web application for visualizing ADIF (Amateur Data Interchange Format) files with advanced healthcare data visualization capabilities and **real-time user feedback**.

## ✨ Features

- **📁 File Upload**: Upload any file to trigger healthcare data simulation
- **📊 Interactive 2D Charts**: Age distribution, diagnosis breakdown, vital signs trends

- **🔔 Toast Notifications**: Real-time user feedback during processing
- **📱 Responsive Design**: Modern UI with smooth animations
- **🏥 Healthcare Analytics**: Comprehensive patient data analysis
- **⚡ Real-time Processing**: Live data processing with progress indicators

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
   - Backend API: http://localhost:8080



## 🔔 Toast Notification System

Enhanced user experience with real-time feedback:

- **File Selection**: Confirmation when file is selected
- **Upload Progress**: Loading indicators during file upload
- **Processing Status**: Real-time updates during data processing
- **Success Messages**: Confirmation when data is processed successfully
- **Error Handling**: Clear error messages for failed operations
- **Data Loading**: Notifications when healthcare data is loaded

## 📊 Dashboard Features

### Key Metrics
- Total Patients Count
- Average Age
- Readmission Rate
- Average Length of Stay

### 2D Visualizations
- **Age Distribution**: Bar chart showing patient age groups
- **Diagnosis Distribution**: Breakdown of medical diagnoses
- **Vital Signs Trends**: Heart rate trends over time
- **Gender Distribution**: Pie chart of patient gender
- **Age vs Length of Stay**: Scatter plot with readmission indicators



## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript

- **Charts**: D3.js
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **Backend**: FastAPI (Python)
- **Containerization**: Docker (Backend only)

## 📁 Project Structure

```
ADIF-file-visualizer-assignment/
├── backend/                 # FastAPI backend service (Dockerized)
│   ├── data/               # Healthcare data files
│   ├── main.py             # FastAPI application
│   ├── Dockerfile          # Backend container configuration
│   └── setup.md            # Detailed setup guide
├── frontend/               # Next.js frontend application (Local)
│   ├── src/
│   │   ├── components/
│   │   │   ├── HealthcareDashboard.tsx

│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx   # Updated with toast notifications
│   │   │   └── healthcare.tsx
│   │   └── services/
│   │       └── api.ts
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # Backend service orchestration
└── README.md              # This file
```

## 🔧 Development

### Backend Development
For detailed setup instructions, development workflow, and troubleshooting, see:
- [Backend Setup Guide](backend/setup.md) - Comprehensive setup and deployment guide

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 🎨 UI/UX Improvements

### Toast Notifications
- **Success Toasts**: Green notifications for successful operations
- **Error Toasts**: Red notifications for errors with clear messages
- **Loading Toasts**: Persistent loading indicators during processing
- **Info Toasts**: Blue notifications for informational messages

### 3D Visualization
- **Smooth Animations**: 60fps rendering for fluid experience
- **Interactive Controls**: Mouse and touch support for exploration
- **Responsive Design**: Adapts to different screen sizes
- **Performance Optimized**: Efficient rendering with proper cleanup

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 New Features Added:**

- ✅ **Toast Notification System** with React Hot Toast
- ✅ **Enhanced User Experience** with real-time feedback
- ✅ **Improved Error Handling** with clear user messages
- ✅ **Performance Optimizations** for smooth 3D rendering
- ✅ **Simplified Deployment** with frontend running locally
