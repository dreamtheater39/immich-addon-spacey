#!/bin/bash

# Start FastAPI backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Serve frontend with python http.server
cd frontend
python3 -m http.server 5173 --bind 0.0.0.0
