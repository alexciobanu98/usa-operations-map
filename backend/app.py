from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend')
CORS(app)

REGIONS_DATA = {
    'pnw': {
        'name': 'Pacific Northwest',
        'operations': {
            'construction': {
                'active_sites': 15,
                'locations': ['Seattle', 'Portland', 'Boise'],
                'completion_rate': '87%',
                'equipment_deployed': '42 towers in progress'
            },
            'equipment': {
                'inventory_status': '95% stocked',
                'major_equipment': ['Tower Components', 'Antennas', 'Power Systems'],
                'health_status': '92'
            }
        }
    },
    'midwest': {
        'name': 'Midwest',
        'operations': {
            'construction': {
                'active_sites': 23,
                'locations': ['Chicago', 'Detroit', 'Minneapolis'],
                'completion_rate': '78%',
                'equipment_deployed': '65 towers in progress'
            },
            'equipment': {
                'inventory_status': '88% stocked',
                'major_equipment': ['Tower Components', 'Transmission Equipment', 'Power Units'],
                'health_status': '85'
            }
        }
    }
}

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/regions')
def get_regions():
    return REGIONS_DATA

if __name__ == '__main__':
    app.run(debug=True)
