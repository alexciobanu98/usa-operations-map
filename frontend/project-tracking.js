// API endpoints
const API = {
    PROJECTS: '/api/projects',
    REGIONS: '/api/regions',
    project: (id) => `/api/projects/${id}`
};

// Sample project data with extended information
const projectData = [
    {
        siteId: "PNW001",
        projectNumber: "P2025-001",
        poSiteId: "PO-2025-001",
        siteName: "Seattle Tower Alpha",
        siteAddress: "123 Main St, Seattle, WA 98101",
        status: "In Progress",
        customer: "TelecomCo",
        subcontractorCrew: "Alpha Construction Team",
        poStatus: "Approved",
        permits: "City Permit #12345, Environmental Permit #E789",
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        forecastedStart: "2025-01-10",
        actualStart: "2025-01-15",
        forecastedFinish: "2025-06-30",
        actualFinish: null,
        scopeOfWork: "New Tower Construction",
        structureType: "Monopole",
        region: "pnw",
        progress: 75,
        teamSize: 12,
        daysLeft: 45,
        billOfMaterials: [
            {
                item: "Steel Tower Sections",
                quantity: 5,
                status: "Delivered"
            },
            {
                item: "Foundation Materials",
                quantity: 1,
                status: "Installed"
            },
            {
                item: "Antenna Mounts",
                quantity: 8,
                status: "Pending"
            }
        ],
        milestones: [
            {
                date: "2025-01-15",
                title: "Project Start",
                description: "Initial site survey and planning",
                status: "completed"
            },
            {
                date: "2025-03-15",
                title: "Foundation Complete",
                description: "Construction of tower foundation",
                status: "completed"
            },
            {
                date: "2025-04-01",
                title: "Tower Assembly",
                description: "Main structure assembly phase",
                status: "in-progress"
            },
            {
                date: "2025-04-15",
                title: "Equipment Installation",
                description: "Installation of communication equipment",
                status: "pending"
            }
        ],
        tasks: [
            {
                id: 1,
                title: "Site Survey Review",
                description: "Review and validate site survey data",
                priority: "high",
                assignee: "Mike Chen",
                dueDate: "2025-04-05",
                status: "in-progress"
            },
            {
                id: 2,
                title: "Equipment Order",
                description: "Place order for remaining equipment",
                priority: "medium",
                assignee: "Sarah Johnson",
                dueDate: "2025-04-10",
                status: "pending"
            }
        ]
    },
    {
        siteId: "MW002",
        projectNumber: "P2025-002",
        poSiteId: "PO-2025-002",
        siteName: "Chicago Site Beta",
        siteAddress: "456 Elm St, Chicago, IL 60611",
        status: "Planning",
        customer: "NetworkCorp",
        subcontractorCrew: "Beta Construction Team",
        poStatus: "Pending",
        permits: "City Permit #67890, Environmental Permit #E012",
        startDate: "2025-04-01",
        endDate: "2025-08-31",
        forecastedStart: "2025-04-01",
        actualStart: null,
        forecastedFinish: "2025-08-31",
        actualFinish: null,
        scopeOfWork: "Equipment Upgrade",
        structureType: "Rooftop",
        region: "midwest",
        progress: 15,
        teamSize: 8,
        daysLeft: 90,
        billOfMaterials: [
            {
                item: "Installation Kit",
                quantity: 1,
                status: "Ordered"
            },
            {
                item: "Network Equipment",
                quantity: 4,
                status: "Pending"
            }
        ],
        milestones: [
            {
                date: "2025-03-25",
                title: "Site Survey",
                description: "Technical assessment complete",
                status: "completed"
            },
            {
                date: "2025-04-30",
                title: "Permit Approval",
                description: "Awaiting city permits",
                status: "in-progress"
            },
            {
                date: "2025-05-15",
                title: "Construction Start",
                description: "Begin equipment installation",
                status: "pending"
            }
        ],
        tasks: [
            {
                id: 1,
                title: "Permit Application",
                description: "Submit permit application to city",
                priority: "high",
                assignee: "Emily Chang",
                dueDate: "2025-04-15",
                status: "pending"
            },
            {
                id: 2,
                title: "Equipment Procurement",
                description: "Order necessary equipment for upgrade",
                priority: "medium",
                assignee: "James Rodriguez",
                dueDate: "2025-04-20",
                status: "pending"
            }
        ]
    }
];

// State management
let state = {
    projects: [],
    regions: {},
    selectedProject: null
};

// Current project being edited
let currentProjectId = null;

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
function showProjectDetail(siteId) {
    currentProjectId = siteId;
    const project = projectData.find(p => p.siteId === siteId);
    if (!project) return;

    // Update project title and status
    document.getElementById('detail-project-title').textContent = project.siteName;
    document.getElementById('detail-status-badge').textContent = project.status;
    document.getElementById('detail-status-badge').className = `status-badge ${project.status.toLowerCase().replace(' ', '-')}`;

    // Update progress and stats
    document.getElementById('detail-progress').style.width = `${project.progress}%`;
    document.getElementById('detail-progress-value').textContent = `${project.progress}%`;
    document.getElementById('detail-team-size').textContent = project.teamSize;
    document.getElementById('detail-days-left').textContent = project.daysLeft;

    // Update basic information
    document.getElementById('detail-siteId').textContent = project.siteId;
    document.getElementById('detail-projectNumber').textContent = project.projectNumber;
    document.getElementById('detail-poSiteId').textContent = project.poSiteId;
    document.getElementById('detail-siteName').textContent = project.siteName;
    document.getElementById('detail-siteAddress').textContent = project.siteAddress;
    document.getElementById('detail-scopeOfWork').textContent = project.scopeOfWork;
    document.getElementById('detail-structureType').textContent = project.structureType;
    document.getElementById('detail-customer').textContent = project.customer;
    document.getElementById('detail-subcontractor').textContent = project.subcontractorCrew;
    document.getElementById('detail-poStatus').textContent = project.poStatus;
    document.getElementById('detail-permits').textContent = project.permits;

    // Update timeline information
    document.getElementById('detail-forecastedStart').textContent = formatDate(project.forecastedStart);
    document.getElementById('detail-actualStart').textContent = project.actualStart ? formatDate(project.actualStart) : 'Not Started';
    document.getElementById('detail-forecastedFinish').textContent = formatDate(project.forecastedFinish);
    document.getElementById('detail-actualFinish').textContent = project.actualFinish ? formatDate(project.actualFinish) : 'In Progress';

    // Update timeline
    const timelineContainer = document.getElementById('detail-timeline');
    timelineContainer.innerHTML = '';
    project.milestones.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.status}`;
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(item.date)}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-description">${item.description}</div>
            </div>
        `;
        timelineContainer.appendChild(timelineItem);
    });

    // Update materials
    const materialsContainer = document.getElementById('materials-list');
    materialsContainer.innerHTML = '';
    project.billOfMaterials.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.item}</td>
            <td>${material.quantity}</td>
            <td><span class="status-badge ${material.status.toLowerCase()}">${material.status}</span></td>
            <td>
                <button class="icon-button" onclick="editMaterial('${material.item}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        materialsContainer.appendChild(row);
    });

    // Update tasks
    const tasksContainer = document.getElementById('tasks-list');
    tasksContainer.innerHTML = '';
    project.tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.priority}-priority`;
        taskCard.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="task-priority">${task.priority}</span>
            </div>
            <div class="task-details">${task.description}</div>
            <div class="task-meta">
                <span class="task-assignee">
                    <i class="fas fa-user"></i>
                    ${task.assignee}
                </span>
                <span class="task-due-date">Due: ${formatDate(task.dueDate)}</span>
            </div>
        `;
        tasksContainer.appendChild(taskCard);
    });

    // Show modal
    document.getElementById('projectDetail').classList.remove('hidden');
}

// Close project detail modal
function closeProjectDetail() {
    document.getElementById('projectDetail').classList.add('hidden');
    state.selectedProject = null;
}

// Edit Project
function editProject() {
    const project = projectData.find(p => p.siteId === currentProjectId);
    if (!project) return;

    // Populate form fields
    document.getElementById('edit-siteId').value = project.siteId;
    document.getElementById('edit-projectNumber').value = project.projectNumber;
    document.getElementById('edit-poSiteId').value = project.poSiteId;
    document.getElementById('edit-siteName').value = project.siteName;
    document.getElementById('edit-siteAddress').value = project.siteAddress;
    document.getElementById('edit-scopeOfWork').value = project.scopeOfWork;
    document.getElementById('edit-structureType').value = project.structureType;
    document.getElementById('edit-customer').value = project.customer;
    document.getElementById('edit-subcontractor').value = project.subcontractorCrew;
    document.getElementById('edit-poStatus').value = project.poStatus;
    document.getElementById('edit-permits').value = project.permits;
    document.getElementById('edit-forecastedStart').value = formatDateForInput(project.forecastedStart);
    document.getElementById('edit-actualStart').value = project.actualStart ? formatDateForInput(project.actualStart) : '';
    document.getElementById('edit-forecastedFinish').value = formatDateForInput(project.forecastedFinish);
    document.getElementById('edit-actualFinish').value = project.actualFinish ? formatDateForInput(project.actualFinish) : '';

    // Show modal
    document.getElementById('editProjectModal').classList.remove('hidden');
}

// Add Milestone
function addMilestone() {
    document.getElementById('milestoneModalTitle').textContent = 'Add Milestone';
    document.getElementById('milestone-id').value = '';
    document.getElementById('milestone-title').value = '';
    document.getElementById('milestone-date').value = '';
    document.getElementById('milestone-description').value = '';
    document.getElementById('milestone-status').value = 'pending';
    document.getElementById('editMilestoneModal').classList.remove('hidden');
}

// Edit Milestone
function editMilestone(id) {
    const project = projectData.find(p => p.siteId === currentProjectId);
    const milestone = project.milestones.find(m => m.id === id);
    if (!milestone) return;

    document.getElementById('milestoneModalTitle').textContent = 'Edit Milestone';
    document.getElementById('milestone-id').value = milestone.id;
    document.getElementById('milestone-title').value = milestone.title;
    document.getElementById('milestone-date').value = formatDateForInput(milestone.date);
    document.getElementById('milestone-description').value = milestone.description;
    document.getElementById('milestone-status').value = milestone.status;
    document.getElementById('editMilestoneModal').classList.remove('hidden');
}

// Add Material
function addMaterial() {
    document.getElementById('materialModalTitle').textContent = 'Add Material';
    document.getElementById('material-id').value = '';
    document.getElementById('material-item').value = '';
    document.getElementById('material-quantity').value = '1';
    document.getElementById('material-status').value = 'pending';
    document.getElementById('editMaterialModal').classList.remove('hidden');
}

// Edit Material
function editMaterial(item) {
    const project = projectData.find(p => p.siteId === currentProjectId);
    const material = project.billOfMaterials.find(m => m.item === item);
    if (!material) return;

    document.getElementById('materialModalTitle').textContent = 'Edit Material';
    document.getElementById('material-id').value = item;
    document.getElementById('material-item').value = material.item;
    document.getElementById('material-quantity').value = material.quantity;
    document.getElementById('material-status').value = material.status.toLowerCase();
    document.getElementById('editMaterialModal').classList.remove('hidden');
}

// Add Task
function addTask() {
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    document.getElementById('task-id').value = '';
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-assignee').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('editTaskModal').classList.remove('hidden');
}

// Edit Task
function editTask(id) {
    const project = projectData.find(p => p.siteId === currentProjectId);
    const task = project.tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-assignee').value = task.assignee;
    document.getElementById('task-due-date').value = formatDateForInput(task.dueDate);
    document.getElementById('editTaskModal').classList.remove('hidden');
}

// Save Project Changes
function saveProjectChanges(event) {
    event.preventDefault();
    const project = projectData.find(p => p.siteId === currentProjectId);
    if (!project) return;

    // Update project data
    project.siteId = document.getElementById('edit-siteId').value;
    project.projectNumber = document.getElementById('edit-projectNumber').value;
    project.poSiteId = document.getElementById('edit-poSiteId').value;
    project.siteName = document.getElementById('edit-siteName').value;
    project.siteAddress = document.getElementById('edit-siteAddress').value;
    project.scopeOfWork = document.getElementById('edit-scopeOfWork').value;
    project.structureType = document.getElementById('edit-structureType').value;
    project.customer = document.getElementById('edit-customer').value;
    project.subcontractorCrew = document.getElementById('edit-subcontractor').value;
    project.poStatus = document.getElementById('edit-poStatus').value;
    project.permits = document.getElementById('edit-permits').value;
    project.forecastedStart = document.getElementById('edit-forecastedStart').value;
    project.actualStart = document.getElementById('edit-actualStart').value || null;
    project.forecastedFinish = document.getElementById('edit-forecastedFinish').value;
    project.actualFinish = document.getElementById('edit-actualFinish').value || null;

    // Update view
    showProjectDetail(project.siteId);
    closeEditModal('editProjectModal');
}

// Save Milestone Changes
function saveMilestoneChanges(event) {
    event.preventDefault();
    const project = projectData.find(p => p.siteId === currentProjectId);
    if (!project) return;

    const milestoneId = document.getElementById('milestone-id').value;
    const milestoneData = {
        id: milestoneId || Date.now().toString(),
        title: document.getElementById('milestone-title').value,
        date: document.getElementById('milestone-date').value,
        description: document.getElementById('milestone-description').value,
        status: document.getElementById('milestone-status').value
    };

    if (milestoneId) {
        // Update existing milestone
        const index = project.milestones.findIndex(m => m.id === milestoneId);
        if (index !== -1) {
            project.milestones[index] = milestoneData;
        }
    } else {
        // Add new milestone
        project.milestones.push(milestoneData);
    }

    // Update view
    showProjectDetail(project.siteId);
    closeEditModal('editMilestoneModal');
}

// Save Material Changes
function saveMaterialChanges(event) {
    event.preventDefault();
    const project = projectData.find(p => p.siteId === currentProjectId);
    if (!project) return;

    const materialId = document.getElementById('material-id').value;
    const materialData = {
        item: document.getElementById('material-item').value,
        quantity: parseInt(document.getElementById('material-quantity').value),
        status: document.getElementById('material-status').value
    };

    if (materialId) {
        // Update existing material
        const index = project.billOfMaterials.findIndex(m => m.item === materialId);
        if (index !== -1) {
            project.billOfMaterials[index] = materialData;
        }
    } else {
        // Add new material
        project.billOfMaterials.push(materialData);
    }

    // Update view
    showProjectDetail(project.siteId);
    closeEditModal('editMaterialModal');
}

// Save Task Changes
function saveTaskChanges(event) {
    event.preventDefault();
    const project = projectData.find(p => p.siteId === currentProjectId);
    if (!project) return;

    const taskId = document.getElementById('task-id').value;
    const taskData = {
        id: taskId || Date.now().toString(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        assignee: document.getElementById('task-assignee').value,
        dueDate: document.getElementById('task-due-date').value,
        status: 'pending'
    };

    if (taskId) {
        // Update existing task
        const index = project.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            taskData.status = project.tasks[index].status;
            project.tasks[index] = taskData;
        }
    } else {
        // Add new task
        project.tasks.push(taskData);
    }

    // Update view
    showProjectDetail(project.siteId);
    closeEditModal('editTaskModal');
}

// Close modal helper
function closeEditModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format date for input fields
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Show error message
function showError(message) {
    // TODO: Implement error notification system
    console.error(message);
}

// Populate table with project data
function populateTable(data) {
    const tableBody = document.getElementById('projectTableBody');
    tableBody.innerHTML = '';

    data.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.siteId}</td>
            <td>${project.projectNumber}</td>
            <td>${project.siteName}</td>
            <td><span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span></td>
            <td>${project.customer}</td>
            <td>${project.startDate}</td>
            <td>${project.endDate}</td>
            <td>
                <button class="action-btn view-btn" onclick="showProjectDetail('${project.siteId}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRegion = filterSelect.value;

        const filteredData = projectData.filter(project => {
            const matchesSearch = 
                project.siteId.toLowerCase().includes(searchTerm) ||
                project.projectNumber.toLowerCase().includes(searchTerm) ||
                project.siteName.toLowerCase().includes(searchTerm) ||
                project.customer.toLowerCase().includes(searchTerm);

            const matchesRegion = !selectedRegion || project.region === selectedRegion;

            return matchesSearch && matchesRegion;
        });

        populateTable(filteredData);
    }

    searchInput.addEventListener('input', filterProjects);
    filterSelect.addEventListener('change', filterProjects);
}

// Toggle profile dropdown
document.getElementById('profileButton').addEventListener('click', function(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profileDropdown');
    if (!e.target.closest('.profile-menu')) {
        dropdown.classList.remove('show');
    }
});

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize table with sample data
    populateTable(projectData);
    setupSearchAndFilter();
});

// Add new milestone
function addMilestone() {
    // Implementation for adding new milestone
    console.log('Add milestone clicked');
}

// Add new material
function addMaterial() {
    // Implementation for adding new material
    console.log('Add material clicked');
}

// Add new task
function addTask() {
    // Implementation for adding new task
    console.log('Add task clicked');
}

// Edit material
function editMaterial(item) {
    // Implementation for editing material
    console.log('Edit material clicked:', item);
}

// Edit project
function editProject() {
    // Implementation for editing project
    console.log('Edit project clicked');
}
