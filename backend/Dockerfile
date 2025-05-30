FROM python:3.11-slim

WORKDIR /app

COPY . /app/backend

RUN apt-get update && apt-get install -y \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r /app/backend/requirements.txt

ENV PYTHONPATH=/app:/app/backend

EXPOSE 5000

CMD ["python", "backend/app.py"]
