#!/bin/bash

# run.sh - Start both AgentChat backend and frontend

echo "Starting Backend API..."
cd backend
~/.local/bin/poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

echo "Starting Frontend React App..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "========================================="
echo " AgentChat PoC is now running!"
echo " Backend: http://localhost:8000"
echo " Frontend: http://localhost:5173"
echo " Press Ctrl+C to stop both servers."
echo "========================================="

# Trap termination signals to kill child processes
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM EXIT

# Wait for both background processes
wait $BACKEND_PID $FRONTEND_PID
