// Region data with financial information
const regionData = {
    pnw: {
        name: "Pacific Northwest",
        metrics: {
            totalProjects: 45,
            activeProjects: 28,
            completedProjects: 17,
            totalBudget: 125.5 // in millions
        },
        status: {
            onTrack: 70,
            atRisk: 20,
            delayed: 10
        },
        financials: {
            allocated: 125.5,
            spent: 78.3,
            remaining: 47.2
        },
        projects: [
            {
                name: "Seattle Downtown Network",
                status: "On Track",
                budget: 28.5,
                progress: 65,
                dueDate: "2025-06-15"
            },
            {
                name: "Portland 5G Implementation",
                status: "At Risk",
                budget: 32.1,
                progress: 45,
                dueDate: "2025-07-30"
            },
            {
                name: "Boise Infrastructure Upgrade",
                status: "On Track",
                budget: 18.7,
                progress: 80,
                dueDate: "2025-05-20"
            }
        ]
    },
    // Add similar data structure for other regions
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Get region from URL or default to PNW
    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get('region') || 'pnw';
    
    // Set initial region
    document.getElementById('regionSelect').value = region;
    updateDashboard(region);

    // Add region change listener
    document.getElementById('regionSelect').addEventListener('change', (e) => {
        const newRegion = e.target.value;
        updateDashboard(newRegion);
        // Update URL without reload
        window.history.pushState({}, '', `?region=${newRegion}`);
    });
});

function updateDashboard(regionId) {
    const data = regionData[regionId];
    if (!data) return;

    // Update title
    document.getElementById('regionTitle').textContent = `${data.name} Overview`;

    // Update metrics
    document.getElementById('totalProjects').textContent = data.metrics.totalProjects;
    document.getElementById('activeProjects').textContent = data.metrics.activeProjects;
    document.getElementById('completedProjects').textContent = data.metrics.completedProjects;
    document.getElementById('projectBudget').textContent = `$${data.metrics.totalBudget}M`;

    // Update status chart
    updateStatusChart(data.status);

    // Update financial chart
    updateFinancialChart(data.financials);

    // Update project list
    updateProjectList(data.projects);

    // Update timeline
    updateTimeline(data.projects);
}

function updateStatusChart(status) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (window.statusChart) {
        window.statusChart.destroy();
    }

    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['On Track', 'At Risk', 'Delayed'],
            datasets: [{
                data: [status.onTrack, status.atRisk, status.delayed],
                backgroundColor: ['#38A169', '#ECC94B', '#E53E3E']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateFinancialChart(financials) {
    const ctx = document.getElementById('financialChart').getContext('2d');
    
    if (window.financialChart) {
        window.financialChart.destroy();
    }

    window.financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Allocated', 'Spent', 'Remaining'],
            datasets: [{
                data: [financials.allocated, financials.spent, financials.remaining],
                backgroundColor: ['#4299E1', '#38A169', '#ECC94B']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}M`
                    }
                }
            }
        }
    });
}

function updateProjectList(projects) {
    const tbody = document.getElementById('projectTableBody');
    tbody.innerHTML = '';

    projects.forEach(project => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>
                <span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">
                    ${project.status}
                </span>
            </td>
            <td>$${project.budget}M</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
                </div>
                ${project.progress}%
            </td>
            <td>${formatDate(project.dueDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view">View</button>
                    <button class="btn-action btn-edit">Edit</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateTimeline(projects) {
    const timeline = document.getElementById('projectTimeline');
    timeline.innerHTML = '';

    projects
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .forEach(project => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-date">${formatDate(project.dueDate)}</div>
                <div class="timeline-content">
                    <strong>${project.name}</strong>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            `;
            timeline.appendChild(item);
        });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
