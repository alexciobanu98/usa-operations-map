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
│   └── app.py              # Flask server and API endpoints
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── app.js            # D3.js map visualization
│   └── styles.css        # Application styles
└── requirements.txt      # Python dependencies
