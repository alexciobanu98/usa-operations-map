# USA Operations Map

An interactive web application that visualizes wireless infrastructure construction and equipment management across the Pacific Northwest and Midwest regions, incorporating relevant metrics for the Utilities One Wireless division.

## Features
- Interactive US map with region-specific data visualization
- Real-time metrics for construction sites and equipment management
- Detailed tooltips showing regional performance
- Comprehensive region details with construction and equipment statistics

## Setup Requirements
1. Python (v3.8 or higher)
2. pip (Python package manager)

## Installation
1. Install Python from https://www.python.org/downloads/
2. Install project dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application
1. Start the Flask server:
   ```bash
   cd backend
   python app.py
   ```

2. Open your browser and navigate to http://localhost:5000

## Project Structure
```
usa-operations-map/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── app/                   # Application package
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes and endpoints
│   │   └── __init__.py        # Flask app factory
│   ├── migrations/            # Database migrations
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── index.html             # Main map visualization page
│   ├── login.html             # Authentication page
│   ├── profile.html           # User profile settings
│   ├── dashboard.html         # Dashboard with metrics
│   ├── project-tracking.html  # Project management page
│   ├── app.js                 # Map visualization logic
│   ├── api-service.js         # API service for backend communication
│   ├── profile.js             # Profile page functionality
│   ├── login.js               # Authentication logic
│   └── styles.css             # Application styles
└── README.md                  # Project documentation
```

## Authentication
The application includes a complete authentication system:
- User registration and login
- Profile management
- Password security with strength validation
- JWT-based authentication

## API Endpoints
The backend provides RESTful API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT token

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/<id>` - Get project details
- `POST /api/projects` - Create a new project
- `PUT /api/projects/<id>` - Update a project
- `DELETE /api/projects/<id>` - Delete a project

### Users
- `GET /api/users/<id>` - Get user profile
- `PUT /api/users/<id>` - Update user profile
- `PUT /api/users/<id>/password` - Change user password

## Development
To set up a development environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/usa-operations-map.git
   cd usa-operations-map
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   python app.py
   ```

4. In a new terminal, serve the frontend:
   ```bash
   cd frontend
   python -m http.server 8000
   ```

5. Open your browser and navigate to http://localhost:8000/login.html

## Default Credentials
For testing purposes, you can use:
- Username: admin
- Password: admin123

*Note: Change these credentials before deploying to production.*

## License
MIT License
