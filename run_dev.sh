# Description: Run the frontend and backend servers in development mode
# Store process IDs
npm run dev & VITE_PID=$!
cd ../backend && python3 app.py & FLASK_PID=$!

# Kill processes on script exit
trap 'kill $VITE_PID $FLASK_PID; exit' SIGINT

# Wait for processes
wait