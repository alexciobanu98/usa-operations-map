# USA Operations Map Backend API

This is the backend API server for the USA Operations Map project. It provides RESTful endpoints for managing projects, sites, tasks, and users, as well as real-time updates via Socket.IO.

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Project Management**: CRUD operations for projects, sites, and tasks
- **Real-time Updates**: Socket.IO integration for live updates
- **Database Integration**: SQLAlchemy ORM for database operations
- **API Documentation**: Comprehensive API documentation

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
   ```
   cd C:\Users\Alexandru Ciobanu\CascadeProjects\usa-operations-map\backend
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Initialize the database:
   ```
   python -c "from app import create_app, db; from config import Config; app = create_app(Config); app.app_context().push(); db.create_all()"
   ```

4. Seed the database with initial data:
   ```
   flask init-db
   ```

### Running the Server

Start the development server:
```
python app.py
```

The server will be available at http://localhost:5000

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and get access token
- **POST /api/auth/refresh**: Refresh access token
- **GET /api/auth/me**: Get current user information

### Projects

- **GET /api/projects**: Get all projects (with optional filtering)
- **GET /api/projects/:id**: Get a specific project
- **POST /api/projects**: Create a new project
- **PUT /api/projects/:id**: Update a project
- **DELETE /api/projects/:id**: Delete a project

### Project Sites

- **GET /api/projects/:id/sites**: Get all sites for a project
- **POST /api/projects/:id/sites**: Add a site to a project

### Project Tasks

- **GET /api/projects/:id/tasks**: Get all tasks for a project
- **POST /api/projects/:id/tasks**: Add a task to a project

### Users

- **GET /api/users**: Get all users
- **GET /api/users/:id**: Get a specific user
- **PUT /api/users/:id**: Update user information

## Real-time Events

The backend emits the following Socket.IO events:

- **project_created**: When a new project is created
- **project_updated**: When a project is updated
- **project_deleted**: When a project is deleted
- **site_created**: When a new site is added
- **task_created**: When a new task is added

## Integrating with the Frontend

To connect the frontend to this backend:

1. Update the API base URL in your frontend code to point to this backend server
2. Use the authentication endpoints to handle user login/registration
3. Connect to the Socket.IO server for real-time updates

## Development

### Database Migrations

If you need to make changes to the database schema:

1. Initialize migrations:
   ```
   flask db init
   ```

2. Create a migration:
   ```
   flask db migrate -m "Description of changes"
   ```

3. Apply the migration:
   ```
   flask db upgrade
   ```

### Testing

Run the tests:
```
pytest
```

## Security Notes

- The default admin credentials are for development only. Change them before deploying to production.
- Set proper environment variables for SECRET_KEY and JWT_SECRET_KEY in production.
- Use HTTPS in production environments.
