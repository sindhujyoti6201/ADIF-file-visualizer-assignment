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

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    print("I AM INSIDE THE BACKEND SERVER")
    """Read from sample-dat.json in the data folder and return its contents as the response."""
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    json_path = os.path.join(data_dir, "healthcare-data.json")
    with open(json_path, "r") as f:
        response = json.load(f)
    return response