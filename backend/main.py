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
    print("----------------------------------------")
    print("HEALTH_CHECK : Checking if the backend service is running and healthy")
    print("----------------------------------------")
    return {"status": "healthy", "service": "ADIF Backend API"}

@app.get("/patients")
async def get_patients():
    """Fetch patients information from the data folder."""
    print("----------------------------------------")
    print("GET_PATIENTS : Reading patients data from the file : patients-data.json")
    print("----------------------------------------")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "patients-data.json")
    try:
        with open(json_path, "r") as f:
            response = json.load(f)
        return response
    except FileNotFoundError:
        return {"error": "Patients data not found", "patients": []}

@app.get("/doctors")
async def get_doctors():
    """Fetch all doctors information."""
    print("----------------------------------------")
    print("GET_DOCTORS : Reading doctors data from the file : doctors-data.json")
    print("----------------------------------------")
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "doctors-data.json")
    
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
        
        return {
            "doctors": data.get("doctors", []),
            "summary": data.get("summary", {})
        }
        
    except FileNotFoundError:
        return {
            "error": "Doctors data not found", 
            "doctors": [],
            "summary": {}
        }

@app.get("/doctors/analytics")
async def get_doctors_analytics():
    """Return pre-calculated analytics for doctors charts."""
    print("----------------------------------------")
    print("GET_DOCTORS_ANALYTICS : Calculating analytics and charts data from doctors-data.json")
    print("----------------------------------------")
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
    print("----------------------------------------")
    print("GET_DOCTORS_SUMMARY : Calculating summary statistics from doctors-data.json")
    print("----------------------------------------")
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

@app.post("/patient-info")
async def process_patient_file(file: UploadFile = File(...)):
    """Process uploaded file and return patient information."""
    print("----------------------------------------")
    print(f"PROCESS_PATIENT_FILE : Processing uploaded file and returning patient info from : {file.filename}")
    print("----------------------------------------")
    
    # For now, return mock patient info
    # In a real implementation, you would parse the uploaded file here
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "patient-info.json")
    
    try:
        with open(json_path, "r") as f:
            patient_info = json.load(f)
        
        # Add file processing info
        response = {
            **patient_info,
            "processed_file": file.filename,
            "processing_time": random.randint(100, 500),
            "status": "success"
        }
        return response
    except FileNotFoundError:
        return {
            "error": "Patient info template not found",
            "processed_file": file.filename,
            "status": "error"
        }

@app.post("/book-appointment")
async def book_appointment(appointment_data: dict):
    """Book a doctor's appointment and save to file."""
    print("----------------------------------------")
    print("BOOK_APPOINTMENT : Booking doctor appointment and saving to file : doctors-appointments.json")
    print("----------------------------------------")
    
    try:
        # Create data directory if it doesn't exist
        data_dir = os.path.join(os.path.dirname(__file__), "data")
        os.makedirs(data_dir, exist_ok=True)
        
        # File path for appointments
        appointments_file = os.path.join(data_dir, "doctors-appointments.json")
        
        # Load existing appointments or create new list
        existing_appointments = []
        if os.path.exists(appointments_file):
            with open(appointments_file, "r") as f:
                existing_appointments = json.load(f)
        
        # Add new appointment
        appointment_id = f"APT{len(existing_appointments) + 1:04d}"
        new_appointment = {
            "id": appointment_id,
            **appointment_data,
            "status": "confirmed",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        }
        
        existing_appointments.append(new_appointment)
        
        # Save to file
        with open(appointments_file, "w") as f:
            json.dump(existing_appointments, f, indent=2)
        
        print(f"Appointment booked successfully: {appointment_id}")
        
        return {
            "status": "success",
            "message": "Appointment booked successfully",
            "appointment_id": appointment_id,
            "appointment": new_appointment
        }
        
    except Exception as e:
        print(f"Error booking appointment: {e}")
        return {
            "status": "error",
            "message": "Failed to book appointment",
            "error": str(e)
        }
