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
    
    // Setup notification bell hover effect
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('You have 3 new notifications');
        });
    }
    
    // Setup search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#projectTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Setup filter functionality
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            const region = e.target.value;
            fetchProjects(region);
        });
    }

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

// Add Site Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const addSiteButton = document.getElementById('addSiteButton');
    const addSiteModal = document.getElementById('addSiteModal');
    const closeSiteModal = document.getElementById('closeSiteModal');
    const cancelSiteForm = document.getElementById('cancelSiteForm');
    
    // Add Project Modal elements
    const addProjectButton = document.getElementById('addProjectButton');
    const addProjectModal = document.getElementById('addProjectModal');
    const closeProjectModal = document.getElementById('closeProjectModal');
    const cancelProjectForm = document.getElementById('cancelProjectForm');
    
    // Form customization elements
    const fieldToggles = document.querySelectorAll('.field-toggle input[type="checkbox"]');
    const resetFormFields = document.getElementById('resetFormFields');
    const applyFormFields = document.getElementById('applyFormFields');
    
    // Form elements
    const newSiteForm = document.getElementById('newSiteForm');
    const newProjectForm = document.getElementById('newProjectForm');
    const addMilestoneButton = document.getElementById('add-milestone');
    const milestonesContainer = document.getElementById('milestones-container');
    const documentUpload = document.getElementById('document-upload');
    const uploadPreview = document.getElementById('upload-preview');
    
    // Open modal when clicking Add New Site button
    if (addSiteButton) {
        addSiteButton.addEventListener('click', function() {
            addSiteModal.classList.add('active');
        });
    }
    
    // Open modal when clicking Add New Project button
    if (addProjectButton) {
        addProjectButton.addEventListener('click', function() {
            addProjectModal.classList.add('active');
        });
    }
    
    // Close modal functions
    function closeSiteModalFunc() {
        addSiteModal.classList.remove('active');
    }
    
    function closeProjectModalFunc() {
        addProjectModal.classList.remove('active');
    }
    
    if (closeSiteModal) {
        closeSiteModal.addEventListener('click', closeSiteModalFunc);
    }
    
    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', closeProjectModalFunc);
    }
    
    if (cancelSiteForm) {
        cancelSiteForm.addEventListener('click', closeSiteModalFunc);
    }
    
    if (cancelProjectForm) {
        cancelProjectForm.addEventListener('click', closeProjectModalFunc);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addSiteModal) {
            closeSiteModalFunc();
        }
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === addProjectModal) {
            closeProjectModalFunc();
        }
    });
    
    // Form field customization
    if (applyFormFields) {
        applyFormFields.addEventListener('click', function() {
            fieldToggles.forEach(toggle => {
                if (!toggle.disabled) {
                    const fieldId = toggle.id;
                    const sectionId = 'section-' + fieldId.replace('field-', '');
                    const section = document.getElementById(sectionId);
                    
                    if (section) {
                        if (toggle.checked) {
                            section.classList.remove('hidden');
                        } else {
                            section.classList.add('hidden');
                        }
                    }
                }
            });
        });
    }
    
    // Reset form fields to default
    if (resetFormFields) {
        resetFormFields.addEventListener('click', function() {
            fieldToggles.forEach(toggle => {
                if (!toggle.disabled) {
                    // Default state - dates, budget, equipment, team, location checked
                    // milestones, documents, notes unchecked
                    const fieldId = toggle.id;
                    if (['field-dates', 'field-budget', 'field-equipment', 'field-team', 'field-location'].includes(fieldId)) {
                        toggle.checked = true;
                    } else {
                        toggle.checked = false;
                    }
                }
            });
            
            // Apply the changes
            applyFormFields.click();
        });
    }
    
    // Add milestone functionality
    if (addMilestoneButton && milestonesContainer) {
        addMilestoneButton.addEventListener('click', function() {
            const milestoneItem = document.createElement('div');
            milestoneItem.className = 'milestone-item';
            milestoneItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Milestone Name</label>
                        <input type="text" name="milestone-name[]">
                    </div>
                    <div class="form-group">
                        <label>Target Date</label>
                        <input type="date" name="milestone-date[]">
                    </div>
                    <div class="form-group milestone-actions">
                        <button type="button" class="icon-button remove-milestone">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            milestonesContainer.appendChild(milestoneItem);
            
            // Add event listener to remove button
            const removeButton = milestoneItem.querySelector('.remove-milestone');
            removeButton.addEventListener('click', function() {
                milestonesContainer.removeChild(milestoneItem);
            });
        });
    }
    
    // Handle file uploads
    if (documentUpload && uploadPreview) {
        documentUpload.addEventListener('change', function() {
            uploadPreview.innerHTML = '';
            
            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const filePreview = document.createElement('div');
                    filePreview.className = 'file-preview';
                    
                    // Determine file type icon
                    let fileIcon = 'fa-file';
                    if (file.type.includes('image')) {
                        fileIcon = 'fa-file-image';
                    } else if (file.type.includes('pdf')) {
                        fileIcon = 'fa-file-pdf';
                    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                        fileIcon = 'fa-file-word';
                    } else if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                        fileIcon = 'fa-file-excel';
                    }
                    
                    filePreview.innerHTML = `
                        <i class="fas ${fileIcon}"></i>
                        <span>${file.name}</span>
                        <small>${formatFileSize(file.size)}</small>
                    `;
                    
                    uploadPreview.appendChild(filePreview);
                }
            }
        });
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Handle form submission
    if (newSiteForm) {
        newSiteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const siteData = {};
            
            // Convert FormData to object
            for (const [key, value] of formData.entries()) {
                if (key.endsWith('[]')) {
                    // Handle array fields
                    const baseKey = key.slice(0, -2);
                    if (!siteData[baseKey]) {
                        siteData[baseKey] = [];
                    }
                    siteData[baseKey].push(value);
                } else {
                    siteData[key] = value;
                }
            }
            
            // Generate a unique site ID
            const siteId = 'SITE-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            siteData['site-id'] = siteId;
            
            // In a real application, you would send this data to a server
            console.log('New site data:', siteData);
            
            // Add the new site to the table
            addSiteToTable(siteData);
            
            // Close the modal
            closeSiteModalFunc();
            
            // Reset the form
            newSiteForm.reset();
        });
    }
    
    // Handle Project Form Submission
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(newProjectForm);
            const projectData = {};
            
            for (let [key, value] of formData.entries()) {
                projectData[key] = value;
            }
            
            // Here you would typically send the data to your backend
            console.log('Project Data:', projectData);
            
            // For demo purposes, show success message and close modal
            alert('Project created successfully!');
            closeProjectModalFunc();
            
            // Reset form
            newProjectForm.reset();
        });
    }
    
    // Add site to the table
    function addSiteToTable(siteData) {
        const tableBody = document.getElementById('projectTableBody');
        if (!tableBody) return;
        
        // Create a new row
        const row = document.createElement('tr');
        
        // Format dates
        const startDate = siteData['start-date'] ? new Date(siteData['start-date']).toLocaleDateString() : 'N/A';
        const endDate = siteData['end-date'] ? new Date(siteData['end-date']).toLocaleDateString() : 'N/A';
        
        // Get status class
        let statusClass = '';
        switch (siteData['status']) {
            case 'planning':
                statusClass = 'status-planning';
                break;
            case 'in-progress':
                statusClass = 'status-in-progress';
                break;
            case 'on-hold':
                statusClass = 'status-on-hold';
                break;
            case 'completed':
                statusClass = 'status-completed';
                break;
            default:
                statusClass = '';
        }
        
        // Create row content
        row.innerHTML = `
            <td>${siteData['site-id']}</td>
            <td>${siteData['project-number']}</td>
            <td>${siteData['site-name']}</td>
            <td><span class="status-badge ${statusClass}">${formatStatus(siteData['status'])}</span></td>
            <td>${siteData['customer']}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td>
                <button class="action-btn view-btn" data-id="${siteData['site-id']}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${siteData['site-id']}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${siteData['site-id']}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Add the row to the table
        tableBody.prepend(row);
        
        // Add event listeners to buttons
        const viewBtn = row.querySelector('.view-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        viewBtn.addEventListener('click', function() {
            // In a real application, you would fetch the site details
            alert(`View site details for ${siteData['site-id']}`);
        });
        
        editBtn.addEventListener('click', function() {
            // In a real application, you would open the edit form
            alert(`Edit site ${siteData['site-id']}`);
        });
        
        deleteBtn.addEventListener('click', function() {
            // Confirm before deleting
            if (confirm(`Are you sure you want to delete site ${siteData['site-id']}?`)) {
                tableBody.removeChild(row);
            }
        });
    }
    
    // Format status for display
    function formatStatus(status) {
        if (!status) return 'Unknown';
        
        // Convert kebab-case to Title Case
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
});

// Notification functionality
document.addEventListener('DOMContentLoaded', function() {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const markAllReadButton = document.querySelector('.mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item');
    const notificationBadge = document.querySelector('.notification-badge');
    
    // Toggle notification dropdown
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
            
            // Close profile dropdown if open
            const profileDropdown = document.getElementById('profileDropdown');
            if (profileDropdown && profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationDropdown && !e.target.closest('.notification-bell')) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    // Mark all notifications as read
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', function() {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update badge
            notificationBadge.textContent = '0';
            notificationBadge.style.display = 'none';
        });
    }
    
    // Mark individual notification as read
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            
            // Update badge count
            const unreadCount = document.querySelectorAll('.notification-item.unread').length;
            if (unreadCount > 0) {
                notificationBadge.textContent = unreadCount;
            } else {
                notificationBadge.textContent = '0';
                notificationBadge.style.display = 'none';
            }
        });
    });
});

// Enhanced project tracking functionality
document.addEventListener('DOMContentLoaded', function() {
    // View toggle functionality
    const tableViewBtn = document.querySelector('.view-toggle-btn[data-view="table"]');
    const cardsViewBtn = document.querySelector('.view-toggle-btn[data-view="cards"]');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (tableViewBtn && cardsViewBtn) {
        tableViewBtn.addEventListener('click', function() {
            tableViewBtn.classList.add('active');
            cardsViewBtn.classList.remove('active');
            tableView.classList.add('active');
            cardView.classList.remove('active');
        });
        
        cardsViewBtn.addEventListener('click', function() {
            cardsViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            cardView.classList.add('active');
            tableView.classList.remove('active');
        });
    }
    
    // Sortable table headers
    const sortableHeaders = document.querySelectorAll('th.sortable');
    let currentSortColumn = 'siteId';
    let currentSortDirection = 'asc';
    
    if (sortableHeaders.length > 0) {
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-sort');
                
                // Remove sorted classes from all headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });
                
                // Toggle sort direction if clicking the same column
                if (column === currentSortColumn) {
                    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = column;
                    currentSortDirection = 'asc';
                }
                
                // Add sorted class to current header
                this.classList.add(`sorted-${currentSortDirection}`);
                
                // Sort the table
                sortTable(column, currentSortDirection);
            });
        });
    }
    
    // Sort table function
    function sortTable(column, direction) {
        const tableBody = document.getElementById('projectTableBody');
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        
        // Sort the rows
        rows.sort((a, b) => {
            let aValue = a.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent.trim();
            let bValue = b.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent.trim();
            
            // Handle date sorting
            if (column === 'startDate' || column === 'endDate') {
                aValue = aValue === 'N/A' ? new Date(0) : new Date(aValue);
                bValue = bValue === 'N/A' ? new Date(0) : new Date(bValue);
            }
            
            // Compare values
            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        // Reorder the table
        rows.forEach(row => tableBody.appendChild(row));
    }
    
    // Helper function to get column index
    function getColumnIndex(column) {
        const columns = {
            'siteId': 1,
            'projectNumber': 2,
            'siteName': 3,
            'status': 4,
            'customer': 5,
            'startDate': 6,
            'endDate': 7
        };
        return columns[column] || 1;
    }
    
    // Filter functionality
    const regionFilter = document.getElementById('region-filter');
    const statusFilter = document.getElementById('status-filter');
    const customerFilter = document.getElementById('customer-filter');
    const clearFiltersButton = document.getElementById('clear-filters');
    const projectTableBody = document.getElementById('projectTableBody');
    const projectCards = document.getElementById('projectCards');
    
    // Check if any filters are applied
    function checkFiltersApplied() {
        const isFiltered = 
            regionFilter.value !== '' || 
            statusFilter.value !== '' || 
            customerFilter.value !== '';
        
        if (isFiltered) {
            clearFiltersButton.classList.remove('disabled');
        } else {
            clearFiltersButton.classList.add('disabled');
        }
        
        return isFiltered;
    }
    
    // Apply filters to projects
    function applyFilters() {
        const regionValue = regionFilter.value;
        const statusValue = statusFilter.value;
        const customerValue = customerFilter.value;
        
        // Check if any filters are applied
        const isFiltered = checkFiltersApplied();
        
        // Get all table rows
        const tableRows = projectTableBody.querySelectorAll('tr');
        
        // Get all cards
        const cards = projectCards.querySelectorAll('.project-card');
        
        // Filter table rows
        tableRows.forEach(row => {
            const region = row.getAttribute('data-region');
            const status = row.getAttribute('data-status');
            const customer = row.getAttribute('data-customer');
            
            const matchesRegion = regionValue === '' || region === regionValue;
            const matchesStatus = statusValue === '' || status === statusValue;
            const matchesCustomer = customerValue === '' || customer === customerValue;
            
            if (matchesRegion && matchesStatus && matchesCustomer) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Filter cards
        cards.forEach(card => {
            const region = card.getAttribute('data-region');
            const status = card.getAttribute('data-status');
            const customer = card.getAttribute('data-customer');
            
            const matchesRegion = regionValue === '' || region === regionValue;
            const matchesStatus = statusValue === '' || status === statusValue;
            const matchesCustomer = customerValue === '' || customer === customerValue;
            
            if (matchesRegion && matchesStatus && matchesCustomer) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update counts
        updateVisibleCounts();
    }
    
    // Update visible counts
    function updateVisibleCounts() {
        const visibleRows = Array.from(projectTableBody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
        const visibleCards = Array.from(projectCards.querySelectorAll('.project-card')).filter(card => card.style.display !== 'none');
        
        // Update table count
        const tableCount = document.querySelector('.table-view .count');
        if (tableCount) {
            tableCount.textContent = `Showing ${visibleRows.length} projects`;
        }
        
        // Update card count
        const cardCount = document.querySelector('.card-view .count');
        if (cardCount) {
            cardCount.textContent = `Showing ${visibleCards.length} projects`;
        }
    }
    
    // Add event listeners to filters
    regionFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    customerFilter.addEventListener('change', applyFilters);
    
    // Clear filters
    clearFiltersButton.addEventListener('click', function() {
        // Only clear if there are filters applied
        if (!checkFiltersApplied()) {
            return;
        }
        
        regionFilter.value = '';
        statusFilter.value = '';
        customerFilter.value = '';
        
        // Apply filters (which will now show all projects)
        applyFilters();
        
        // Update button state
        checkFiltersApplied();
    });
    
    // Initial check for filter state
    checkFiltersApplied();
    
    // Filter functionality
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            const region = e.target.value;
            fetchProjects(region);
        });
    }
    
    // Pagination functionality
    const rowsPerPage = 10;
    let currentPage = 1;
    
    function setupPagination() {
        const tableRows = document.querySelectorAll('#projectTableBody tr');
        const totalPages = Math.ceil(tableRows.length / rowsPerPage);
        
        // Generate page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageNumber = document.createElement('button');
                pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
                pageNumber.textContent = i;
                pageNumber.addEventListener('click', function() {
                    goToPage(i);
                });
                pageNumbers.appendChild(pageNumber);
            }
        }
        
        // Setup prev/next buttons
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
            prevPageBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    goToPage(currentPage - 1);
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages;
            nextPageBtn.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    goToPage(currentPage + 1);
                }
            });
        }
        
        // Show current page
        showCurrentPage();
    }
    
    function goToPage(page) {
        currentPage = page;
        showCurrentPage();
        
        // Update active page number
        const pageNumbers = document.querySelectorAll('.page-number');
        pageNumbers.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.textContent) === page);
        });
        
        // Update prev/next buttons
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const totalPages = Math.ceil(document.querySelectorAll('#projectTableBody tr').length / rowsPerPage);
        
        if (prevPageBtn) prevPageBtn.disabled = page === 1;
        if (nextPageBtn) nextPageBtn.disabled = page === totalPages;
    }
    
    function showCurrentPage() {
        const tableRows = Array.from(document.querySelectorAll('#projectTableBody tr'));
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        
        tableRows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });
    }
    
    // Initialize pagination
    setupPagination();
    
    // Add tooltips to metrics
    const metrics = document.querySelectorAll('.metric');
    
    metrics.forEach(metric => {
        metric.addEventListener('click', function() {
            const metricId = this.id;
            showMetricDetails(metricId);
        });
    });
    
    // Generate card view from table data
    function generateCardView() {
        const tableRows = document.querySelectorAll('#projectTableBody tr');
        const cardsGrid = document.getElementById('projectCardsGrid');
        
        if (!cardsGrid) return;
        
        cardsGrid.innerHTML = '';
        
        tableRows.forEach(row => {
            const siteId = row.querySelector('td:nth-child(1)').textContent;
            const projectNumber = row.querySelector('td:nth-child(2)').textContent;
            const siteName = row.querySelector('td:nth-child(3)').textContent;
            const status = row.querySelector('td:nth-child(4) .status-badge').textContent;
            const statusClass = row.querySelector('td:nth-child(4) .status-badge').className.split(' ')[1] || '';
            const customer = row.querySelector('td:nth-child(5)').textContent;
            const startDate = row.querySelector('td:nth-child(6)').textContent;
            const endDate = row.querySelector('td:nth-child(7)').textContent;
            const region = row.getAttribute('data-region') || '';
            
            // Create card element
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-region', region);
            card.setAttribute('data-status', status.toLowerCase().replace(' ', '-'));
            
            // Calculate random progress for demo
            const progress = Math.floor(Math.random() * 100);
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>${siteName}</h3>
                    <div class="card-status">
                        <span class="status-badge ${statusClass}">${status}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-info-row">
                        <div class="card-info-label">Site ID:</div>
                        <div class="card-info-value">${siteId}</div>
                    </div>
                    <div class="card-info-row">
                        <div class="card-info-label">Project #:</div>
                        <div class="card-info-value">${projectNumber}</div>
                    </div>
                    <div class="card-info-row">
                        <div class="card-info-label">Customer:</div>
                        <div class="card-info-value customer-value">${customer}</div>
                    </div>
                    <div class="card-info-row">
                        <div class="card-info-label">Start Date:</div>
                        <div class="card-info-value">${startDate}</div>
                    </div>
                    <div class="card-info-row">
                        <div class="card-info-label">End Date:</div>
                        <div class="card-info-value">${endDate}</div>
                    </div>
                    <div class="card-progress">
                        <div class="progress-label">
                            <span>Progress</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn view-btn" data-id="${siteId}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${siteId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${siteId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cardsGrid.appendChild(card);
            
            // Add event listeners to card buttons
            const viewBtn = card.querySelector('.view-btn');
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            
            viewBtn.addEventListener('click', function() {
                showProjectDetail(siteId);
            });
            
            editBtn.addEventListener('click', function() {
                editProject(siteId);
            });
            
            deleteBtn.addEventListener('click', function() {
                if (confirm(`Are you sure you want to delete site ${siteId}?`)) {
                    card.remove();
                    // In a real application, you would send a delete request to the server
                }
            });
        });
    }
    
    // Initialize card view
    generateCardView();
    
    // Apply initial filters
    applyFilters();
});
