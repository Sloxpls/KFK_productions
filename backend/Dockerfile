FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the backend directory into /app/backend
COPY backend /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Set PYTHONPATH to include /app and /app/backend
ENV PYTHONPATH=/app:/app/backend

# Expose Flask's default port
EXPOSE 5000

# Run the application
CMD ["python", "backend/app.py"]
