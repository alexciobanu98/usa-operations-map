// API endpoints
const API = {
    PROJECTS: '/api/projects',
    REGIONS: '/api/regions',
    project: (id) => `/api/projects/${id}`
};

// State management
let state = {
    projects: [],
    regions: {},
    selectedProject: null
};

// Fetch data from API
async function fetchProjects(region = '') {
    try {
        const url = region ? `${API.PROJECTS}?region=${region}` : API.PROJECTS;
        const response = await fetch(url);
        state.projects = await response.json();
        initializeTable();
    } catch (error) {
        console.error('Error fetching projects:', error);
        showError('Failed to load projects');
    }
}

async function fetchRegions() {
    try {
        const response = await fetch(API.REGIONS);
        state.regions = await response.json();
        updateRegionSummary();
    } catch (error) {
        console.error('Error fetching regions:', error);
        showError('Failed to load region data');
    }
}

// Initialize the table
function initializeTable() {
    const tableBody = document.getElementById('projectTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    state.projects.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.siteId}</td>
            <td>${project.projectNumber}</td>
            <td>${project.siteName}</td>
            <td><span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span></td>
            <td>${project.customer}</td>
            <td>${formatDate(project.actualStart || project.forecastedStart)}</td>
            <td>${formatDate(project.actualFinish || project.forecastedFinish)}</td>
            <td>
                <button class="action-button" onclick="showProjectDetail('${project.siteId}')">
                    <i class="fas fa-expand-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update region summary cards
function updateRegionSummary() {
    const container = document.querySelector('.region-summary');
    container.innerHTML = '';

    Object.entries(state.regions).forEach(([id, region]) => {
        const card = document.createElement('div');
        card.className = 'project-card summary-card';
        card.innerHTML = `
            <h2>${region.name}</h2>
            <div class="project-stats">
                <div class="stat">
                    <span class="stat-label">Active Projects</span>
                    <span class="stat-value">${region.metrics.activeProjects}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Completion Rate</span>
                    <span class="stat-value">${region.metrics.completionRate}%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Equipment Deployed</span>
                    <span class="stat-value">${region.metrics.equipmentDeployed}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Show project details
async function showProjectDetail(siteId) {
    try {
        const response = await fetch(API.project(siteId));
        const project = await response.json();
        
        if (response.ok) {
            state.selectedProject = project;
            updateProjectDetailView();
            document.getElementById('projectDetail').classList.remove('hidden');
        } else {
            showError('Project not found');
        }
    } catch (error) {
        console.error('Error fetching project details:', error);
        showError('Failed to load project details');
    }
}

// Update project detail view
function updateProjectDetailView() {
    const project = state.selectedProject;
    if (!project) return;

    // Update basic information
    document.getElementById('detail-siteId').textContent = project.siteId;
    document.getElementById('detail-projectNumber').textContent = project.projectNumber;
    document.getElementById('detail-poSiteId').textContent = project.poSiteId;
    document.getElementById('detail-siteName').textContent = project.siteName;
    document.getElementById('detail-scopeOfWork').textContent = project.scopeOfWork;
    document.getElementById('detail-structureType').textContent = project.structureType;
    document.getElementById('detail-customer').textContent = project.customer;
    document.getElementById('detail-subcontractor').textContent = project.subcontractorCrew;
    document.getElementById('detail-poStatus').textContent = project.poStatus;
    document.getElementById('detail-permits').textContent = project.permits;
    document.getElementById('detail-address').textContent = project.siteAddress;

    // Update timeline information
    document.getElementById('detail-forecastedStart').textContent = formatDate(project.forecastedStart);
    document.getElementById('detail-actualStart').textContent = project.actualStart ? formatDate(project.actualStart) : 'Not Started';
    document.getElementById('detail-forecastedFinish').textContent = formatDate(project.forecastedFinish);
    document.getElementById('detail-actualFinish').textContent = project.actualFinish ? formatDate(project.actualFinish) : 'In Progress';

    // Update milestones
    const timelineContainer = document.getElementById('milestone-timeline');
    timelineContainer.innerHTML = project.milestones.map(milestone => `
        <div class="milestone ${milestone.status}">
            <div class="milestone-date">${formatDate(milestone.date)}</div>
            <div class="milestone-marker"></div>
            <div class="milestone-content">
                <h4>${milestone.title}</h4>
                <span class="milestone-status">${milestone.status}</span>
            </div>
        </div>
    `).join('');

    // Update materials table
    const materialsContainer = document.getElementById('materials-table');
    materialsContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${project.billOfMaterials.map(item => `
                    <tr>
                        <td>${item.item}</td>
                        <td>${item.quantity}</td>
                        <td><span class="status-badge ${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Close project detail modal
function closeProjectDetail() {
    document.getElementById('projectDetail').classList.add('hidden');
    state.selectedProject = null;
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show error message
function showError(message) {
    // TODO: Implement error notification system
    console.error(message);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    fetchRegions();
    fetchProjects();

    // Setup search functionality
    document.querySelector('.search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#projectTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Setup filter functionality
    document.querySelector('.filter-select').addEventListener('change', function(e) {
        const region = e.target.value;
        fetchProjects(region);
    });
});
