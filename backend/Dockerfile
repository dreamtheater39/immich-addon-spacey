FROM python:3.11-slim AS builder
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

FROM python:3.11-slim
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Explicitly copy backend directory to preserve correct structure
COPY . ./backend

# Expose port
EXPOSE 8000

# Set correct working directory and run app from correct path
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
