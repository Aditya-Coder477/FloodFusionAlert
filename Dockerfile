# 1. Use Python 3.9 or 3.10
FROM python:3.9-slim

# 2. Install gcc (seems like your build needs it based on logs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 3. Set working directory
WORKDIR /app

# 4. Copy requirements from the backend folder
# [FIX IS HERE]: We point to "backend/requirements.txt"
COPY backend/requirements.txt .

# 5. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the entire project (backend + models)
COPY . .

# 7. Set python path so imports work correctly
ENV PYTHONPATH=/app

# 8. Run the app pointing to the backend module
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]

