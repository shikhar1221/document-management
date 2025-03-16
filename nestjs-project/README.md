# NestJS Document Management System

This project is a NestJS-based backend for a document management system with features for user authentication, user management, document management, and an ingestion process.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Modules](#modules)
- [Testing](#testing)
- [Docker](#docker)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nestjs-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the connection settings in the `.env` file.

## Usage

1. Start the application:
   ```
   npm run start
   ```

2. The application will be running on `http://localhost:3000`.

## Modules

- **AuthModule**: Handles user authentication, including registration, login, and logout.
- **UserModule**: Manages user data, including retrieval, updating, and deletion of users.
- **DocumentModule**: Manages document uploads, retrieval, updates, and deletions.
- **IngestionModule**: Triggers and manages the ingestion process for documents.

## Testing

Run the tests using:
```
npm run test
```

## Docker

To run the application using Docker, use the following command:
```
docker-compose up
```

## License

This project is licensed under the MIT License.