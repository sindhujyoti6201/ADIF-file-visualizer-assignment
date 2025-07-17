# ADIF Backend Service

## About
This is the backend service for the ADIF File Visualizer assignment. It is built using [FastAPI](https://fastapi.tiangolo.com/) and provides a mock inference API for healthcare analytics data. The backend exposes a single API endpoint that allows clients to upload a file (the file is not processed) and returns a sample healthcare dataset. This service is intended for demonstration and integration with the frontend visualizer.

## API Endpoints

### `POST /upload`
- **Description:** Accepts a file upload (the file is not used) and returns mock healthcare analytics data from `data/healthcare-data.json`.
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

## Running the Backend Locally

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
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

## Running the Backend with Docker Compose

1. **Ensure Docker and Docker Compose are installed on your system.**
2. **From the project root, run:**
   ```bash
   docker-compose up --build
   ```
   This will build the backend image and start the service as defined in `docker-compose.yml`.
3. **Access the API at:** [http://localhost:8000](http://localhost:8000)

## Dependencies
- fastapi
- uvicorn[standard]
- python-multipart

All dependencies are listed in `requirements.txt`.