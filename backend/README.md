# ADIF Healthcare Backend Service

## About
This is the backend service for the ADIF Healthcare Dashboard. It is built using [FastAPI](https://fastapi.tiangolo.com/) and provides a comprehensive healthcare analytics API with support for doctors, patients, and 3D visualization data. The backend exposes multiple API endpoints for healthcare data management and file processing.

## API Endpoints

### `POST /upload`
- **Description:** Accepts a file upload and returns mock healthcare analytics data from `data/healthcare-data.json`.
- **Request:**
  - Content-Type: `multipart/form-data`
  - Form field: `file` (any file)
- **Response:**
  - JSON object containing:
    - `filename`: Name of the data file
    - `processing_ms`: Simulated processing time in milliseconds
    - `patients`: List of patient records, each with fields like `id`, `age`, `gender`, `diagnosis`, `lengthOfStay`, `readmission`, and `vitalSigns` (heartRate, bloodPressure, temperature, oxygenSaturation)
- **Example Response:**
```json
{
  "filename": "healthcare-analytics-data.json",
  "processing_ms": 2500,
  "patients": [
    {
      "id": "P01",
      "age": 45,
      "gender": "Male",
      "diagnosis": "Cardiovascular Disease",
      "lengthOfStay": 8,
      "readmission": false,
      "vitalSigns": {
        "heartRate": 72,
        "bloodPressure": 140,
        "temperature": 37.2,
        "oxygenSaturation": 95
      }
    },
    // ... more patients ...
  ]
}
```

### `GET /doctors`
- **Description:** Returns comprehensive doctors data with analytics and summary information.
- **Response:**
  - JSON object containing:
    - `summary`: Summary statistics (totalDoctors, averageRating, etc.)
    - `doctors`: List of doctor records with detailed information
- **Example Response:**
```json
{
  "summary": {
    "totalDoctors": 25,
    "averageRating": 4.6,
    "totalSpecialties": 8,
    "activeDoctors": 23
  },
  "doctors": [
    {
      "id": "D01",
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiology",
      "rating": 4.8,
      "experience": 15,
      "patients": 150,
      "location": "New York",
      "availability": "Mon-Fri"
    },
    // ... more doctors ...
  ]
}
```

### `GET /patients`
- **Description:** Returns comprehensive patients data with health analytics.
- **Response:**
  - JSON object containing:
    - `summary`: Summary statistics (totalPatients, averageAge, etc.)
    - `patients`: List of patient records with health data
- **Example Response:**
```json
{
  "summary": {
    "totalPatients": 102,
    "averageAge": 45.2,
    "readmissionRate": 0.15,
    "averageLengthOfStay": 6.8
  },
  "patients": [
    {
      "id": "P01",
      "name": "John Smith",
      "age": 45,
      "gender": "Male",
      "diagnosis": "Cardiovascular Disease",
      "lengthOfStay": 8,
      "readmission": false,
      "vitalSigns": {
        "heartRate": 72,
        "bloodPressure": 140,
        "temperature": 37.2,
        "oxygenSaturation": 95
      }
    },
    // ... more patients ...
  ]
}
```

### `POST /patient-info`
- **Description:** Processes patient information from uploaded files and returns detailed health insights.
- **Request:**
  - Content-Type: `multipart/form-data`
  - Form field: `file` (patient report file)
- **Response:**
  - JSON object containing processed patient information and health analytics
- **Example Response:**
```json
{
  "patientId": "P123",
  "diagnosis": "Hypertension",
  "riskFactors": ["Age", "Family History"],
  "recommendations": ["Regular monitoring", "Lifestyle changes"],
  "vitalSigns": {
    "bloodPressure": 140,
    "heartRate": 72,
    "temperature": 37.2
  }
}
```

### `GET /health`
- **Description:** Health check endpoint for monitoring service status.
- **Response:**
  - JSON object with service status
- **Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Files

The backend uses several JSON data files for different healthcare scenarios:

- `data/doctors-data.json` - Comprehensive doctors database with specialties, ratings, and availability
- `data/patients-data.json` - Patient records with health metrics and vital signs
- `data/patient-info.json` - Detailed patient information for processing
- `data/healthcare-data.json` - Legacy healthcare analytics data

## Running the Backend Locally

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000).

5. **Access the API documentation:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Running the Backend with Docker Compose

1. **Ensure Docker and Docker Compose are installed on your system.**

2. **From the project root, run:**
   ```bash
   docker-compose up --build
   ```
   This will build the backend image and start the service as defined in `docker-compose.yml`.

3. **Access the API at:** [http://localhost:8000](http://localhost:8000)

## API Documentation

The backend provides automatic API documentation:

- **Swagger UI**: Interactive API documentation at `/docs`
- **ReDoc**: Alternative documentation at `/redoc`
- **OpenAPI Schema**: Available at `/openapi.json`

## Dependencies

- **fastapi**: Modern web framework for building APIs
- **uvicorn[standard]**: ASGI server for running FastAPI
- **python-multipart**: For handling file uploads
- **pydantic**: Data validation and settings management

All dependencies are listed in `requirements.txt`.

## Development

### Adding New Endpoints

1. **Create the endpoint function in `main.py`**
2. **Add proper request/response models using Pydantic**
3. **Include error handling and validation**
4. **Update this README with the new endpoint documentation**

### Data Management

- **Adding new data**: Update the corresponding JSON file in the `data/` directory
- **Data validation**: Use Pydantic models for request/response validation
- **Error handling**: Implement proper error responses for invalid data

### Testing

```bash
# Run tests (if implemented)
pytest

# Test specific endpoint
curl -X GET "http://localhost:8000/doctors"
curl -X GET "http://localhost:8000/patients"
curl -X POST "http://localhost:8000/upload" -F "file=@test_file.txt"
```

## Deployment

### Production Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t adif-healthcare-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 adif-healthcare-backend
   ```

3. **Using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Environment Variables

- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)
- `LOG_LEVEL`: Logging level (default: info)

## Monitoring and Health Checks

- **Health endpoint**: `GET /health` for service monitoring
- **Logging**: Structured logging for debugging and monitoring
- **Error handling**: Comprehensive error responses with proper HTTP status codes

---

**🎉 Latest Features Added:**

- ✅ **Comprehensive Doctors API** with analytics and filtering
- ✅ **Patients Data API** with health metrics
- ✅ **Patient Info Processing** for uploaded files
- ✅ **Enhanced File Upload** with detailed processing
- ✅ **Health Check Endpoint** for monitoring
- ✅ **Automatic API Documentation** with Swagger UI
- ✅ **Docker Support** for easy deployment
- ✅ **Data Validation** with Pydantic models