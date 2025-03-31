# Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Environment Setup

1. Clone the repository and navigate to the nestjs-project directory:
   ```bash
   cd nestjs-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```env
   # Database Configuration
   DATABASE_URL=postgres://postgres:password@localhost:5432/mydatabase
   
   # JWT Configuration
   JWT_SECRET=your-secret-key
   JWT_EXPIRATION=1h
   REFRESH_TOKEN_SECRET=your-refresh-secret
   REFRESH_TOKEN_EXPIRATION=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Using Docker (Recommended)

1. Start the application and database using Docker Compose:
   ```bash
   docker-compose up -d
   ```

   This will start both the NestJS application and PostgreSQL database.
   The application will be available at `http://localhost:3000`

### Without Docker

1. Ensure PostgreSQL is running locally with the following credentials:
   - Username: postgres
   - Password: password
   - Database: mydatabase
   - Port: 5432

2. Start the application in development mode:
   ```bash
   npm run start:dev
   ```

   For production:
   ```bash
   npm run build
   npm run start:prod
   ```

## Database Management

### Clean Database

To drop all tables and recreate the schema:
```bash
npm run clean-db
```

### Clear All Data

To truncate all tables while keeping the schema:
```bash
npm run clear-data
```

## Generating Test Data

The project includes a script to generate test data including users with different roles and sample documents.

1. Ensure the database is running and accessible

2. Run the test data generation script:
   ```bash
   npm run generate-test-data
   ```

   This will create:
   - 1000 users with random roles (Admin, Editor, Viewer)
   - 100,000 sample documents with various metadata
   - Associated permissions and relationships

### Default Test Credentials

All generated users have the password: `password123`

You can use any of the generated email addresses from the database to log in.

## Running Tests

- Run unit tests:
  ```bash
  npm run test
  ```

- Run end-to-end tests:
  ```bash
  npm run test:e2e
  ```

- Run tests with coverage:
  ```bash
  npm run test:cov
  ```

## Troubleshooting

1. If you encounter database connection issues:
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env` file
   - Check if the database exists

2. If the application fails to start:
   - Check if all required environment variables are set
   - Ensure no other service is using port 3000
   - Check the logs for detailed error messages

3. If test data generation fails:
   - Ensure the database is running and accessible
   - Check if the schema is properly synchronized
   - Try running `npm run clean-db` first