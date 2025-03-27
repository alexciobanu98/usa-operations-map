from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Project, Site, Task, User
from app import db, socketio
from datetime import datetime

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    # Get query parameters for filtering
    region = request.args.get('region')
    status = request.args.get('status')
    customer = request.args.get('customer')
    
    # Start with base query
    query = Project.query
    
    # Apply filters if provided
    if region:
        query = query.filter(Project.region == region)
    if status:
        query = query.filter(Project.status == status)
    if customer:
        query = query.filter(Project.customer == customer)
    
    # Execute query and convert to dict
    projects = [project.to_dict() for project in query.all()]
    
    return jsonify(projects), 200

@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify(project.to_dict()), 200

@projects_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if required fields are present
    if not all(k in data for k in ('name', 'region')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Parse dates if provided
    start_date = None
    end_date = None
    
    if 'start_date' in data and data['start_date']:
        try:
            start_date = datetime.fromisoformat(data['start_date'])
        except ValueError:
            return jsonify({'error': 'Invalid start date format'}), 400
    
    if 'end_date' in data and data['end_date']:
        try:
            end_date = datetime.fromisoformat(data['end_date'])
        except ValueError:
            return jsonify({'error': 'Invalid end date format'}), 400
    
    # Create new project
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        status=data.get('status', 'planning'),
        region=data['region'],
        customer=data.get('customer', ''),
        start_date=start_date,
        end_date=end_date,
        budget=data.get('budget', 0.0),
        manager_id=current_user_id
    )
    
    db.session.add(project)
    db.session.commit()
    
    # Emit socket event for real-time updates
    socketio.emit('project_created', project.to_dict())
    
    return jsonify({
        'message': 'Project created successfully',
        'project': project.to_dict()
    }), 201

@projects_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if user is the project manager
    if project.manager_id != current_user_id:
        return jsonify({'error': 'You are not authorized to update this project'}), 403
    
    # Update project fields
    if 'name' in data:
        project.name = data['name']
    if 'description' in data:
        project.description = data['description']
    if 'status' in data:
        project.status = data['status']
    if 'region' in data:
        project.region = data['region']
    if 'customer' in data:
        project.customer = data['customer']
    if 'budget' in data:
        project.budget = data['budget']
    if 'actual_cost' in data:
        project.actual_cost = data['actual_cost']
    
    # Parse dates if provided
    if 'start_date' in data and data['start_date']:
        try:
            project.start_date = datetime.fromisoformat(data['start_date'])
        except ValueError:
            return jsonify({'error': 'Invalid start date format'}), 400
    
    if 'end_date' in data and data['end_date']:
        try:
            project.end_date = datetime.fromisoformat(data['end_date'])
        except ValueError:
            return jsonify({'error': 'Invalid end date format'}), 400
    
    db.session.commit()
    
    # Emit socket event for real-time updates
    socketio.emit('project_updated', project.to_dict())
    
    return jsonify({
        'message': 'Project updated successfully',
        'project': project.to_dict()
    }), 200

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if user is the project manager
    if project.manager_id != current_user_id:
        return jsonify({'error': 'You are not authorized to delete this project'}), 403
    
    db.session.delete(project)
    db.session.commit()
    
    # Emit socket event for real-time updates
    socketio.emit('project_deleted', {'id': project_id})
    
    return jsonify({'message': 'Project deleted successfully'}), 200

# Routes for project sites
@projects_bp.route('/<int:project_id>/sites', methods=['GET'])
@jwt_required()
def get_project_sites(project_id):
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    sites = [site.to_dict() for site in project.sites]
    
    return jsonify(sites), 200

@projects_bp.route('/<int:project_id>/sites', methods=['POST'])
@jwt_required()
def create_project_site(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if user is the project manager
    if project.manager_id != current_user_id:
        return jsonify({'error': 'You are not authorized to add sites to this project'}), 403
    
    # Check if required fields are present
    if not all(k in data for k in ('name',)):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new site
    site = Site(
        name=data['name'],
        address=data.get('address', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        zip_code=data.get('zip_code', ''),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        status=data.get('status', 'pending'),
        project_id=project_id
    )
    
    db.session.add(site)
    db.session.commit()
    
    # Emit socket event for real-time updates
    socketio.emit('site_created', site.to_dict())
    
    return jsonify({
        'message': 'Site created successfully',
        'site': site.to_dict()
    }), 201

# Routes for project tasks
@projects_bp.route('/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def get_project_tasks(project_id):
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    tasks = [task.to_dict() for task in project.tasks]
    
    return jsonify(tasks), 200

@projects_bp.route('/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_project_task(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if required fields are present
    if not all(k in data for k in ('title',)):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Parse due date if provided
    due_date = None
    if 'due_date' in data and data['due_date']:
        try:
            due_date = datetime.fromisoformat(data['due_date'])
        except ValueError:
            return jsonify({'error': 'Invalid due date format'}), 400
    
    # Create new task
    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'todo'),
        priority=data.get('priority', 'medium'),
        due_date=due_date,
        assigned_to=data.get('assigned_to'),
        project_id=project_id
    )
    
    db.session.add(task)
    db.session.commit()
    
    # Emit socket event for real-time updates
    socketio.emit('task_created', task.to_dict())
    
    return jsonify({
        'message': 'Task created successfully',
        'task': task.to_dict()
    }), 201
