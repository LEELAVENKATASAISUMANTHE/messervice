# Eligibility Service

This service provides eligibility checking functionality, integrates with Kafka, and connects to a Postgres database.

## Project Structure
- eligibility-service/ : Node.js Express app
- kafka.js : Kafka integration
- docker-compose.yml : Multi-service orchestration

## Usage

1. Build and run with Docker Compose:
   ```sh
   docker-compose up --build
   ```
2. Health check endpoint:
   - GET /health

## Environment Variables
Set in docker-compose.yml for DB and Kafka connectivity.

---

Add your business logic and endpoints in eligibility-service/index.js.
