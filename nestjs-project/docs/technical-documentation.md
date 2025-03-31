# Technical Documentation

## Architecture Overview

The NestJS Document Management System follows a modular architecture with the following key components:

### Core Modules

1. **Auth Module** (`/src/auth`)
   - Handles user authentication and authorization
   - Implements JWT-based authentication
   - Manages refresh tokens
   - Implements role-based and permission-based access control

2. **User Management Module** (`/src/userManagement`)
   - Manages user profiles and credentials
   - Handles user CRUD operations
   - Implements user role management

3. **Document Module** (`/src/document`)
   - Manages document metadata and storage
   - Handles document versioning
   - Implements document access control

4. **Ingestion Module** (`/src/ingestion`)
   - Manages document ingestion pipeline
   - Tracks ingestion status
   - Handles document processing

## Database Schema

### User Entity
```typescript
// src/auth/entities/user.entity.ts
entity {
  id: UUID
  email: string
  password: string (hashed)
  role: UserRole
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}
```

### Document Entity
```typescript
// src/document/entities/document.entity.ts
entity {
  id: UUID
  title: string
  content: string
  metadata: JSON
  version: number
  ownerId: UUID
  createdAt: Date
  updatedAt: Date
}
```

### Ingestion Status Entity
```typescript
// src/ingestion/entities/ingestion-status.entity.ts
entity {
  id: UUID
  documentId: UUID
  status: IngestionStatus
  progress: number
  error: string
  startedAt: Date
  completedAt: Date
}
```

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
Body: {
  "email": string,
  "password": string,
  "role": UserRole
}
```

#### Login
```
POST /auth/login
Body: {
  "email": string,
  "password": string
}
```

#### Refresh Token
```
POST /auth/refresh
Body: {
  "refreshToken": string
}
```

### User Management

#### Get Users
```
GET /users
Headers: {
  "Authorization": "Bearer {token}"
}
```

#### Update User
```
PATCH /users/:id
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "email": string,
  "role": UserRole
}
```

### Document Management

#### Create Document
```
POST /documents
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "title": string,
  "content": string,
  "metadata": object
}
```

#### Get Documents
```
GET /documents
Headers: {
  "Authorization": "Bearer {token}"
}
```

#### Update Document
```
PATCH /documents/:id
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "title": string,
  "content": string,
  "metadata": object
}
```

### Ingestion

#### Trigger Ingestion
```
POST /ingestion/trigger
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "documentId": string
}
```

#### Get Ingestion Status
```
GET /ingestion/status/:id
Headers: {
  "Authorization": "Bearer {token}"
}
```

## Security Implementation

### JWT Authentication
- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Tokens are signed using RS256 algorithm

### Role-Based Access Control
```typescript
// src/auth/enums/roles.enum.ts
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### Permission-Based Access Control
```typescript
// src/auth/enums/permissions.enum.ts
enum Permission {
  CREATE_DOCUMENT = 'create:document',
  READ_DOCUMENT = 'read:document',
  UPDATE_DOCUMENT = 'update:document',
  DELETE_DOCUMENT = 'delete:document',
  MANAGE_USERS = 'manage:users'
}
```

## Error Handling

The application implements a global exception filter that standardizes error responses:

```typescript
{
  statusCode: number,
  message: string,
  error: string,
  timestamp: string,
  path: string
}
```

## Rate Limiting

API endpoints are protected by rate limiting:
- 100 requests per IP per 15 minutes
- Configurable through environment variables

## Environment Configuration

Required environment variables:
```env
# Application
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRATION=7d
```

## Testing

### Unit Tests
Located in `*.spec.ts` files alongside the source files.

### E2E Tests
Located in `/test` directory:
- `auth.e2e-spec.ts`
- `document.e2e-spec.ts`
- `userManagement.e2e-spec.ts`

## Performance Considerations

- Database indexes on frequently queried fields
- Caching implemented for frequently accessed data
- Rate limiting to prevent DoS attacks
- Connection pooling for database connections

## Deployment

### Docker
```dockerfile
# Build
docker build -t nestjs-document-management .

# Run
docker-compose up
```

### Production Considerations
- Use production-grade PostgreSQL instance
- Configure appropriate scaling parameters
- Set up monitoring and logging
- Configure backup strategy