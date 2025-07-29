"""FastAPI service for ADIF take‑home."""
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import asyncio, random, uuid, time
import os, json

app = FastAPI(title="ADIF Mock Inference API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "ADIF Backend API"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    print("I AM INSIDE THE BACKEND SERVER")
    """Process uploaded file and return basic response."""
    # For now, just return a success response
    # The actual file processing logic can be added here later
    response = {
        "status": "success",
        "message": "File uploaded successfully",
        "filename": file.filename
    }
    return response

@app.get("/patients")
async def get_patients():
    """Fetch patients information from the data folder."""
    print("Fetching patients information...")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "healthcare-data.json")
    try:
        with open(json_path, "r") as f:
            response = json.load(f)
        return response
    except FileNotFoundError:
        return {"error": "Patients data not found", "patients": []}

@app.get("/doctors")
async def get_doctors(
    search: str = None,
    department: str = None,
    specialization: str = None,
    page: int = 1,
    limit: int = 60
):
    """Fetch doctors information with filtering and pagination."""
    print("Fetching doctors information...")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "doctors-data.json")
    
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
        
        doctors = data.get("doctors", [])
        
        # Apply filters
        filtered_doctors = doctors
        
        if search:
            search_lower = search.lower()
            filtered_doctors = [
                doctor for doctor in filtered_doctors
                if (search_lower in doctor["name"].lower() or
                    search_lower in doctor["specialization"].lower() or
                    search_lower in doctor["department"].lower())
            ]
        
        if department and department != "all":
            filtered_doctors = [
                doctor for doctor in filtered_doctors
                if doctor["department"] == department
            ]
        
        if specialization and specialization != "all":
            filtered_doctors = [
                doctor for doctor in filtered_doctors
                if doctor["specialization"] == specialization
            ]
        
        # Calculate pagination
        total_records = len(filtered_doctors)
        total_pages = (total_records + limit - 1) // limit
        start_index = (page - 1) * limit
        end_index = start_index + limit
        
        # Apply pagination
        paginated_doctors = filtered_doctors[start_index:end_index]
        
        return {
            "doctors": paginated_doctors,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_records": total_records,
                "has_next": page < total_pages,
                "has_prev": page > 1,
                "limit": limit
            },
            "summary": data.get("summary", {})
        }
        
    except FileNotFoundError:
        return {
            "error": "Doctors data not found", 
            "doctors": [],
            "pagination": {
                "current_page": 1,
                "total_pages": 0,
                "total_records": 0,
                "has_next": False,
                "has_prev": False,
                "limit": limit
            }
        }

@app.get("/doctors/analytics")
async def get_doctors_analytics():
    """Return pre-calculated analytics for doctors charts."""
    print("Fetching doctors analytics...")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "doctors-data.json")
    
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
        
        doctors = data.get("doctors", [])
        
        # Calculate specialization distribution
        specialization_counts = {}
        for doctor in doctors:
            spec = doctor["specialization"]
            specialization_counts[spec] = specialization_counts.get(spec, 0) + 1
        
        specialization_distribution = [
            {"specialization": spec, "count": count}
            for spec, count in specialization_counts.items()
        ]
        
        # Calculate department distribution
        department_counts = {}
        for doctor in doctors:
            dept = doctor["department"]
            department_counts[dept] = department_counts.get(dept, 0) + 1
        
        department_distribution = [
            {"department": dept, "count": count}
            for dept, count in department_counts.items()
        ]
        
        # Calculate rating distribution
        rating_groups = {}
        for doctor in doctors:
            rating_key = f"{doctor['rating']:.1f}"
            rating_groups[rating_key] = rating_groups.get(rating_key, 0) + 1
        
        rating_distribution = [
            {"rating": rating, "count": count}
            for rating, count in rating_groups.items()
        ]
        
        # Calculate experience vs success rate data
        experience_vs_success = [
            {
                "experience": doctor["experience"],
                "successRate": doctor["successRate"],
                "rating": doctor["rating"],
                "name": doctor["name"]
            }
            for doctor in doctors
        ]
        
        return {
            "specialization_distribution": specialization_distribution,
            "department_distribution": department_distribution,
            "rating_distribution": rating_distribution,
            "experience_vs_success": experience_vs_success
        }
        
    except FileNotFoundError:
        return {
            "error": "Doctors data not found",
            "specialization_distribution": [],
            "department_distribution": [],
            "rating_distribution": [],
            "experience_vs_success": []
        }

@app.get("/doctors/summary")
async def get_doctors_summary():
    """Return summary statistics for doctors."""
    print("Fetching doctors summary...")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "doctors-data.json")
    
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
        
        doctors = data.get("doctors", [])
        summary = data.get("summary", {})
        
        # Calculate additional summary stats
        if doctors:
            avg_experience = sum(d["experience"] for d in doctors) / len(doctors)
            avg_rating = sum(d["rating"] for d in doctors) / len(doctors)
            avg_success_rate = sum(d["successRate"] for d in doctors) / len(doctors)
            
            departments = list(set(d["department"] for d in doctors))
            specializations = list(set(d["specialization"] for d in doctors))
            
            return {
                **summary,
                "calculated_stats": {
                    "average_experience": round(avg_experience, 1),
                    "average_rating": round(avg_rating, 1),
                    "average_success_rate": round(avg_success_rate, 1),
                    "departments": departments,
                    "specializations": specializations
                }
            }
        else:
            return summary
            
    except FileNotFoundError:
        return {
            "error": "Doctors data not found",
            "totalDoctors": 0,
            "calculated_stats": {
                "average_experience": 0,
                "average_rating": 0,
                "average_success_rate": 0,
                "departments": [],
                "specializations": []
            }
        }

@app.get("/patient-info")
async def get_patient_info():
    """Fetch patient information from the data folder."""
    print("Fetching patient information...")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "patient-info.json")
    try:
        with open(json_path, "r") as f:
            response = json.load(f)
        return response
    except FileNotFoundError:
        return {"error": "Patient info data not found", "patient": {}}