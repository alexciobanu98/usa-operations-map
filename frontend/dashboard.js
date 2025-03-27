document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification functionality
    initNotifications();
    
    // Initialize profile dropdown
    initProfileDropdown();
    
    // Initialize charts
    initStatusChart();
    initBudgetChart();
    initRegionalChart();
    
    // Initialize project timeline
    initProjectTimeline();
    
    // Add event listeners for refresh and download buttons
    document.getElementById('refreshStatusChart').addEventListener('click', refreshStatusChart);
    document.getElementById('downloadStatusChart').addEventListener('click', () => downloadChart('statusChart', 'project-status-distribution'));
    
    document.getElementById('refreshBudgetChart').addEventListener('click', refreshBudgetChart);
    document.getElementById('downloadBudgetChart').addEventListener('click', () => downloadChart('budgetChart', 'budget-vs-actual'));
    
    document.getElementById('refreshRegionalChart').addEventListener('click', refreshRegionalChart);
    document.getElementById('downloadRegionalChart').addEventListener('click', () => downloadChart('regionalChart', 'regional-performance'));
    
    document.getElementById('refreshTimeline').addEventListener('click', refreshTimeline);
    document.getElementById('downloadTimeline').addEventListener('click', downloadTimeline);
    
    document.getElementById('refreshActivity').addEventListener('click', refreshActivity);
    
    // Add event listener for timeline filter
    document.getElementById('timelineFilter').addEventListener('change', filterTimeline);
});

// Notification functionality
function initNotifications() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllRead = document.getElementById('markAllRead');
    
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });
    
    markAllRead.addEventListener('click', function() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        notificationBadge.style.display = 'none';
    });
    
    document.addEventListener('click', function(e) {
        if (!notificationBell.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
}

// Profile dropdown functionality
function initProfileDropdown() {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    
    profileButton.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function(e) {
        if (!profileButton.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
}

// Initialize Project Status Chart
function initStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Planning', 'In Progress', 'On Hold', 'Completed'],
            datasets: [{
                data: [8, 15, 5, 14],
                backgroundColor: [
                    '#4299E1', // Blue
                    '#F6AD55', // Orange
                    '#FC8181', // Red
                    '#68D391'  // Green
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = Math.floor(((currentValue/total) * 100) + 0.5);
                        return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
                    }
                }
            }
        }
    });
}

// Initialize Budget vs. Actual Chart
function initBudgetChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    window.budgetChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Budget',
                    data: [500000, 750000, 600000, 800000],
                    backgroundColor: '#4299E1',
                    borderWidth: 1
                },
                {
                    label: 'Actual',
                    data: [480000, 790000, 610000, 750000],
                    backgroundColor: '#F6AD55',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ': $' + 
                            tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                }
            }
        }
    });
}

// Initialize Regional Performance Chart
function initRegionalChart() {
    const ctx = document.getElementById('regionalChart').getContext('2d');
    window.regionalChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Pacific Northwest', 'Midwest', 'Northeast', 'Southeast', 'Southwest'],
            datasets: [
                {
                    label: 'Project Completion Rate',
                    data: [85, 70, 90, 75, 80],
                    backgroundColor: 'rgba(66, 153, 225, 0.2)',
                    borderColor: '#4299E1',
                    pointBackgroundColor: '#4299E1',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4299E1'
                },
                {
                    label: 'Budget Adherence',
                    data: [90, 85, 75, 80, 70],
                    backgroundColor: 'rgba(246, 173, 85, 0.2)',
                    borderColor: '#F6AD55',
                    pointBackgroundColor: '#F6AD55',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#F6AD55'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Initialize Project Timeline
function initProjectTimeline() {
    const timelineContainer = document.getElementById('projectTimeline');
    
    // Sample project data
    const projects = [
        {
            id: 1,
            name: 'Seattle Tower Installation',
            startDate: '2025-01-15',
            endDate: '2025-04-30',
            progress: 65,
            status: 'in-progress',
            critical: true
        },
        {
            id: 2,
            name: 'Chicago Tower Upgrade',
            startDate: '2025-02-01',
            endDate: '2025-05-15',
            progress: 40,
            status: 'on-hold',
            critical: true,
            delayed: true
        },
        {
            id: 3,
            name: 'Dallas Site Maintenance',
            startDate: '2025-02-15',
            endDate: '2025-03-15',
            progress: 100,
            status: 'completed',
            critical: false
        },
        {
            id: 4,
            name: 'Phoenix Tower Installation',
            startDate: '2025-03-01',
            endDate: '2025-06-30',
            progress: 30,
            status: 'in-progress',
            critical: false
        },
        {
            id: 5,
            name: 'Miami Site Survey',
            startDate: '2025-03-15',
            endDate: '2025-04-15',
            progress: 20,
            status: 'in-progress',
            critical: false
        }
    ];
    
    // Generate timeline HTML
    timelineContainer.innerHTML = '';
    projects.forEach(project => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${project.status}`;
        if (project.critical) timelineItem.classList.add('critical');
        if (project.delayed) timelineItem.classList.add('delayed');
        
        // Calculate timeline positioning
        const today = new Date();
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysCompleted = Math.min(
            Math.round((today - startDate) / (1000 * 60 * 60 * 24)),
            totalDays
        );
        const progressPercent = (project.progress / 100) * 100;
        
        timelineItem.innerHTML = `
            <div class="timeline-header">
                <h4>${project.name}</h4>
                <div class="timeline-status ${project.status}">
                    ${project.status.replace('-', ' ')}
                </div>
            </div>
            <div class="timeline-dates">
                <span>${formatDate(project.startDate)}</span>
                <span>${formatDate(project.endDate)}</span>
            </div>
            <div class="timeline-progress-container">
                <div class="timeline-progress" style="width: ${progressPercent}%"></div>
                <div class="timeline-marker" style="left: ${(daysCompleted / totalDays) * 100}%"></div>
            </div>
            <div class="timeline-footer">
                <span>Progress: ${project.progress}%</span>
                <a href="project-tracking.html?id=${project.id}" class="timeline-details-link">View Details</a>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Refresh functions
function refreshStatusChart() {
    // Simulate API call to get updated data
    showLoadingOverlay('statusChart');
    
    setTimeout(() => {
        window.statusChart.data.datasets[0].data = [
            Math.floor(Math.random() * 10) + 5,
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 5) + 3,
            Math.floor(Math.random() * 10) + 10
        ];
        window.statusChart.update();
        hideLoadingOverlay('statusChart');
        showToast('Status chart updated successfully');
    }, 1000);
}

function refreshBudgetChart() {
    // Simulate API call to get updated data
    showLoadingOverlay('budgetChart');
    
    setTimeout(() => {
        window.budgetChart.data.datasets[0].data = [
            500000,
            750000,
            600000,
            800000
        ];
        window.budgetChart.data.datasets[1].data = [
            Math.floor(Math.random() * 50000) + 450000,
            Math.floor(Math.random() * 50000) + 750000,
            Math.floor(Math.random() * 50000) + 580000,
            Math.floor(Math.random() * 50000) + 730000
        ];
        window.budgetChart.update();
        hideLoadingOverlay('budgetChart');
        showToast('Budget chart updated successfully');
    }, 1000);
}

function refreshRegionalChart() {
    // Simulate API call to get updated data
    showLoadingOverlay('regionalChart');
    
    setTimeout(() => {
        window.regionalChart.data.datasets[0].data = [
            Math.floor(Math.random() * 20) + 70,
            Math.floor(Math.random() * 20) + 60,
            Math.floor(Math.random() * 20) + 70,
            Math.floor(Math.random() * 20) + 65,
            Math.floor(Math.random() * 20) + 70
        ];
        window.regionalChart.data.datasets[1].data = [
            Math.floor(Math.random() * 20) + 70,
            Math.floor(Math.random() * 20) + 75,
            Math.floor(Math.random() * 20) + 65,
            Math.floor(Math.random() * 20) + 70,
            Math.floor(Math.random() * 20) + 60
        ];
        window.regionalChart.update();
        hideLoadingOverlay('regionalChart');
        showToast('Regional chart updated successfully');
    }, 1000);
}

function refreshTimeline() {
    // Simulate API call to get updated data
    showLoadingOverlay('projectTimeline');
    
    setTimeout(() => {
        initProjectTimeline();
        hideLoadingOverlay('projectTimeline');
        showToast('Project timeline updated successfully');
    }, 1000);
}

function refreshActivity() {
    // Simulate API call to get updated data
    showLoadingOverlay('refreshActivity');
    
    setTimeout(() => {
        const activityList = document.querySelector('.activity-list');
        
        // Add a new activity item at the top
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item new-activity';
        newActivity.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text"><strong>Lisa Anderson</strong> assigned to <a href="#">New York Site Survey</a></p>
                <p class="activity-time">Just now</p>
            </div>
        `;
        
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Highlight the new activity briefly
        setTimeout(() => {
            newActivity.classList.remove('new-activity');
        }, 3000);
        
        hideLoadingOverlay('refreshActivity');
        showToast('Activity feed updated successfully');
    }, 1000);
}

// Filter timeline based on selected option
function filterTimeline() {
    const filter = document.getElementById('timelineFilter').value;
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'block';
        } else if (filter === 'critical' && item.classList.contains('critical')) {
            item.style.display = 'block';
        } else if (filter === 'delayed' && item.classList.contains('delayed')) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Download chart as image
function downloadChart(chartId, filename) {
    const canvas = document.getElementById(chartId);
    const link = document.createElement('a');
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Chart downloaded successfully');
}

// Download timeline as PDF (simulated)
function downloadTimeline() {
    showToast('Timeline export started. The PDF will download shortly.');
    
    // Simulate download delay
    setTimeout(() => {
        showToast('Timeline exported successfully');
    }, 2000);
}

// UI Helper functions
function showLoadingOverlay(elementId) {
    const element = document.getElementById(elementId);
    const parent = element.parentElement;
    
    // Create loading overlay if it doesn't exist
    if (!parent.querySelector('.loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        parent.appendChild(overlay);
    }
    
    // Show the overlay
    parent.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoadingOverlay(elementId) {
    const element = document.getElementById(elementId);
    const parent = element.parentElement;
    const overlay = parent.querySelector('.loading-overlay');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showToast(message) {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    document.getElementById('toast-container').appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Real-time notification simulation
setInterval(() => {
    // 10% chance of new notification every 30 seconds
    if (Math.random() < 0.1) {
        const notificationTypes = [
            { icon: 'exclamation-circle', text: 'Project Alert: Boston Tower Maintenance requires attention.', type: 'alert' },
            { icon: 'check-circle', text: 'Task Completed: Site survey for Atlanta location finished.', type: 'success' },
            { icon: 'clock', text: 'Reminder: Project status meeting in 30 minutes.', type: 'info' },
            { icon: 'dollar-sign', text: 'Budget Update: San Francisco project is under budget by 8%.', type: 'success' }
        ];
        
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        // Add notification to dropdown
        const notificationBody = document.querySelector('.notification-body');
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item unread ${randomType.type}`;
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${randomType.icon}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">${randomType.text}</p>
                <p class="notification-time">Just now</p>
            </div>
            <button class="notification-action">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        `;
        
        // Add to top of list
        notificationBody.insertBefore(notificationItem, notificationBody.firstChild);
        
        // Update badge count
        const badge = document.getElementById('notificationBadge');
        badge.style.display = 'flex';
        badge.textContent = parseInt(badge.textContent || 0) + 1;
        
        // Show toast notification
        showToast('New notification received');
    }
}, 30000);
