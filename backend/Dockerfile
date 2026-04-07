WORKDIR /app

# Install system dependencies for PostgreSQL and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Run migrations and collect static files
RUN python manage.py collectstatic --noinput || true

# Start gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8080"]