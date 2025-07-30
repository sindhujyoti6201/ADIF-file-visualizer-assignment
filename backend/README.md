# ADIF Healthcare Backend Service

## About
This is the backend service for the ADIF Healthcare Dashboard. It is built using [FastAPI](https://fastapi.tiangolo.com/) and provides a comprehensive healthcare analytics API with support for doctors, patients, and 3D visualization data.

## Dependencies
- **fastapi**: Modern web framework for building APIs
- **uvicorn[standard]**: ASGI server for running FastAPI
- **python-multipart**: For handling file uploads
- **pydantic**: Data validation and settings management

All dependencies are listed in `requirements.txt`.

## API Documentation
See `swagger-apis.json`.

## Tech Stack
- **FastAPI** - Modern Python web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI applications
- **Python-multipart** - For handling file uploads
- **Pydantic** - Data validation and settings management

## Running the APIs

### Without Docker
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### With Docker
```bash
# From project root
docker-compose up --build

# Or individually
docker build -t adif-healthcare-backend .
docker run -p 8000:8000 adif-healthcare-backend
```

## APIs in main.py

### GET /health
- **Input**: None
- **Output**: Service status and health information
- **Significance**: Monitoring endpoint for service health checks

### GET /patients
- **Input**: None
- **Output**: JSON with patient records, health metrics, and vital signs
- **Significance**: Provides comprehensive patient data for healthcare analytics

### GET /doctors
- **Input**: None
- **Output**: JSON with doctors data, specialties, ratings, and summary statistics
- **Significance**: Centralized doctors database with analytics for healthcare management

### GET /doctors/analytics
- **Input**: None
- **Output**: Pre-calculated analytics including specialization distribution, department distribution, rating distribution, and experience vs success data
- **Significance**: Provides chart-ready data for doctors analytics dashboard

### GET /doctors/summary
- **Input**: None
- **Output**: Summary statistics including average experience, ratings, success rates, departments, and specializations
- **Significance**: Quick overview metrics for doctors performance and distribution

### POST /patient-info
- **Input**: File upload (multipart/form-data)
- **Output**: Processed patient information with health insights and recommendations
- **Significance**: Processes uploaded patient files and extracts relevant health data

### POST /book-appointment
- **Input**: JSON with appointment details (patient info, doctor, date, etc.)
- **Output**: Confirmation with appointment ID and booking status
- **Significance**: Handles appointment booking and saves to persistent storage

## Data Files
- `data/doctors-data.json` - Comprehensive doctors database with specialties, ratings, and availability
- `data/patients-data.json` - Patient records with health metrics and vital signs
- `data/patient-info.json` - Detailed patient information for processing
- `data/healthcare-data.json` - Legacy healthcare analytics data

## Deployment
See `setup.md`.