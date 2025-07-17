# ADIF File Visualizer Assignment

## Product Overview

The **ADIF File Visualizer** is a full-stack web application that simulates healthcare analytics inference and visualization. Users can upload any file (the content is not processed for demo purposes), and the system returns a mock dataset representing healthcare patient analytics. The frontend visualizes this data through interactive dashboards and charts, providing insights such as age distribution, diagnosis breakdown, vital sign trends, and more.

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
- **Containerization:** Docker, Docker Compose (optional)
- **Other:** CORS middleware, Python standard libraries

### Frontend
- **Framework:** Next.js (React 19)
- **Visualization:** D3.js
- **Styling:** Tailwind CSS, custom CSS-in-JS
- **Language:** TypeScript

---

## How to Run the Application

### 1. Clone the Repository
```bash
git clone <repo-url>
cd ADIF-file-visualizer-assignment
```

### 2. Running the Backend

#### **A. Using Docker Compose (Recommended)**
1. **Ensure Docker and Docker Compose are installed.**
   - [Install Docker](https://docs.docker.com/get-docker/)
   - [Install Docker Compose](https://docs.docker.com/compose/install/)
2. **From the project root, run:**
   ```bash
   docker-compose up --build
   ```
   This will build the backend image and start the service as defined in `docker-compose.yml`.
3. **Access the backend API at:** [http://localhost:8000](http://localhost:8000)

#### **B. Running Backend Manually (Without Docker)**
If you do **not** have Docker, you can run the backend directly:

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **(Optional but recommended) Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   - The backend will be available at [http://localhost:8000](http://localhost:8000)

**Troubleshooting:**
- If you get a `ModuleNotFoundError`, ensure you are in the correct directory and your virtual environment is activated.
- If `uvicorn` is not found, install it with `pip install uvicorn`.

---

### 3. Running the Frontend

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
   - The frontend will be available at [http://localhost:3000](http://localhost:3000)

**Environment Variables:**
- The frontend expects the backend to be running at `http://localhost:8000` by default.
- To change the backend API URL, set the `NEXT_PUBLIC_API_URL` environment variable in a `.env.local` file in the `frontend` directory:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

**Troubleshooting:**
- If you see errors about missing modules, ensure you ran `npm install`.
- If the dashboard does not load data, make sure the backend is running and accessible.

---

## Product Flow (Step-by-Step)

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

## Additional Notes

- **No real patient data is used or processed.** All data is simulated for demonstration purposes only.
- **Frontend and backend can be run independently** as long as the API URL is configured correctly.
- **For production deployment**, you may want to build the frontend (`npm run build`) and serve it with a production server.
- **If you encounter CORS issues**, ensure the backend is running and CORS middleware is enabled (it is by default in this project).

---

## Contact
For any issues or questions, please open an issue in the repository or contact the maintainer at sd6201@nyu.edu
