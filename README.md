# ADIF File Visualizer Assignment

## What is the Product About?

The **ADIF File Visualizer** is a full-stack web application designed to simulate the inference and visualization of healthcare analytics data. Users can upload any file (for demo purposes, the file content is not processed), and the system returns a mock dataset representing healthcare patient analytics. The frontend then visualizes this data through interactive dashboards and charts, providing insights such as age distribution, diagnosis breakdown, vital sign trends, and more.

This product demonstrates:
- A simulated file inference workflow.
- Modern data visualization techniques for healthcare analytics.
- Seamless integration between a FastAPI backend and a Next.js/React frontend.

---

## Tech Stack

### Backend
- **Language:** Python 3.11
- **Framework:** FastAPI
- **Server:** Uvicorn
- **Containerization:** Docker, Docker Compose
- **Other:** CORS middleware, Python standard libraries

### Frontend
- **Framework:** Next.js (React 19)
- **Visualization:** D3.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript

---

## How to Run the Backend (Docker Compose)

1. **Ensure Docker and Docker Compose are installed.**
2. **From the project root, run:**
   ```bash
   docker-compose up --build
   ```
   This will build the backend image and start the service as defined in `docker-compose.yml`.
3. **Access the backend API at:** [http://localhost:8000](http://localhost:8000)

---

## How to Run the Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000)

> **Note:** The frontend expects the backend to be running at `http://localhost:8000`. You can configure the API URL using the `NEXT_PUBLIC_API_URL` environment variable if needed.

---

## Product Flow

1. **User uploads a file** on the frontend landing page.
2. **Frontend sends the file** to the backend via a `POST /upload` API call.
3. **Backend returns mock healthcare analytics data** (from `backend/data/healthcare-data.json`), simulating an inference process.
4. **Frontend stores the data** in `localStorage` and redirects the user to the dashboard.
5. **Dashboard visualizes the data** using D3.js charts and metrics.

---

## Visualization & Simulation Data

- **Data Source:** The backend always returns the same mock data, regardless of the uploaded file.
- **Data Structure:** The response includes a filename, simulated processing time, and a list of patient records (with age, gender, diagnosis, length of stay, readmission status, and vital signs).
- **Visualization:** The frontend dashboard (in `HealthcareDashboard.tsx`) displays:
  - Age distribution (bar chart)
  - Diagnosis distribution (bar chart)
  - Vital signs trends (line chart)
  - Readmission rates, average age, and other metrics
- **Simulation:** The upload process includes a loading animation to simulate real inference, and the dashboard is populated with the mock data for visualization.

---
