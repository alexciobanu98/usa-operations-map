from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
from datetime import datetime
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# This will be replaced with a database in production
PROJECTS_DB = {
    'projects': [
        {
            'siteId': 'PNW001',
            'projectNumber': 'P2025-001',
            'poSiteId': 'PO-2025-001',
            'siteName': 'Seattle Downtown Tower',
            'scopeOfWork': 'New Tower Construction',
            'status': 'In Progress',
            'structureType': 'Monopole',
            'customer': 'Verizon',
            'subcontractorCrew': 'Northwest Construction Team A',
            'poStatus': 'Approved',
            'permits': 'All Approved',
            'billOfMaterials': [
                {'item': 'Tower Sections', 'quantity': 4, 'status': 'Delivered'},
                {'item': 'Antenna Mounts', 'quantity': 12, 'status': 'In Transit'},
                {'item': 'RF Equipment', 'quantity': 6, 'status': 'Pending'}
            ],
            'forecastedStart': '2025-04-01',
            'actualStart': '2025-04-03',
            'forecastedFinish': '2025-06-15',
            'actualFinish': None,
            'siteAddress': '123 Pike Street, Seattle, WA 98101',
            'region': 'pnw',
            'milestones': [
                {'date': '2025-04-03', 'title': 'Construction Start', 'status': 'completed'},
                {'date': '2025-04-15', 'title': 'Foundation Complete', 'status': 'in-progress'},
                {'date': '2025-05-01', 'title': 'Tower Assembly', 'status': 'pending'},
                {'date': '2025-06-01', 'title': 'Equipment Installation', 'status': 'pending'},
                {'date': '2025-06-15', 'title': 'Site Integration', 'status': 'pending'}
            ]
        }
    ],
    'regions': {
        'pnw': {
            'name': 'Pacific Northwest',
            'metrics': {
                'activeProjects': 15,
                'completionRate': 87,
                'equipmentDeployed': 42
            }
        },
        'midwest': {
            'name': 'Midwest Region',
            'metrics': {
                'activeProjects': 23,
                'completionRate': 92,
                'equipmentDeployed': 56
            }
        }
    }
}

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'login.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    region = request.args.get('region')
    if region:
        filtered_projects = [p for p in PROJECTS_DB['projects'] if p['region'] == region]
        return jsonify(filtered_projects)
    return jsonify(PROJECTS_DB['projects'])

@app.route('/api/projects/<site_id>', methods=['GET'])
def get_project(site_id):
    project = next((p for p in PROJECTS_DB['projects'] if p['siteId'] == site_id), None)
    if project:
        return jsonify(project)
    return jsonify({'error': 'Project not found'}), 404

@app.route('/api/regions', methods=['GET'])
def get_regions():
    return jsonify(PROJECTS_DB['regions'])

@app.route('/api/projects', methods=['POST'])
def create_project():
    project = request.json
    project['siteId'] = f"{project['region'].upper()}{len(PROJECTS_DB['projects']) + 1:03d}"
    PROJECTS_DB['projects'].append(project)
    return jsonify(project), 201

@app.route('/api/projects/<site_id>', methods=['PUT'])
def update_project(site_id):
    project = next((p for p in PROJECTS_DB['projects'] if p['siteId'] == site_id), None)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    updates = request.json
    project.update(updates)
    return jsonify(project)

@app.route('/api/projects/<site_id>', methods=['DELETE'])
def delete_project(site_id):
    project = next((p for p in PROJECTS_DB['projects'] if p['siteId'] == site_id), None)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    PROJECTS_DB['projects'].remove(project)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
