FROM python:3.11-slim

# backend/Dockerfile
FROM python:3.11-slim

# For psycopg2 if you need Postgres
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


WORKDIR /app

# Copy requirements and install
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose port 5000 (for clarity, not mandatory for Compose)
EXPOSE 5000

CMD ["python", "app.py"]

