const width = 960;
const height = 600;

// Region definitions with enhanced colors
const regions = {
    pnw: {
        name: "Pacific Northwest",
        states: ["WA", "OR", "ID"],
        color: "#3182CE",
        hoverColor: "#4299E1"
    },
    midwest: {
        name: "Midwest",
        states: ["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI"],
        color: "#38A169",
        hoverColor: "#48BB78"
    },
    northeast: {
        name: "Northeast",
        states: ["CT", "ME", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"],
        color: "#805AD5",
        hoverColor: "#9F7AEA"
    },
    southeast: {
        name: "Southeast",
        states: ["AL", "AR", "FL", "GA", "KY", "LA", "MS", "NC", "SC", "TN", "VA", "WV"],
        color: "#D69E2E",
        hoverColor: "#ECC94B"
    },
    southwest: {
        name: "Southwest",
        states: ["AZ", "NM", "OK", "TX"],
        color: "#DD6B20",
        hoverColor: "#ED8936"
    },
    west: {
        name: "West",
        states: ["CA", "CO", "MT", "NV", "UT", "WY"],
        color: "#2196F3",
        hoverColor: "#64B5F6"
    }
};

let selectedRegion = null;
let regionData = {};
let usData = null;

// Mock project data (to be replaced with real data from project tracking)
const mockProjectData = {
    pnw: {
        totalProjects: 45,
        activeProjects: 28,
        completedProjects: 17,
        projectStatus: {
            onTrack: 65,
            atRisk: 25,
            delayed: 10
        },
        topMilestones: [
            { title: "Site Survey - Seattle Downtown", date: "2025-04-15" },
            { title: "Foundation Work - Portland Heights", date: "2025-04-20" },
            { title: "Equipment Installation - Boise Central", date: "2025-04-25" }
        ]
    },
    midwest: {
        totalProjects: 72,
        activeProjects: 45,
        completedProjects: 27,
        projectStatus: {
            onTrack: 70,
            atRisk: 20,
            delayed: 10
        },
        topMilestones: [
            { title: "Tower Assembly - Chicago Loop", date: "2025-04-18" },
            { title: "Network Testing - Detroit Metro", date: "2025-04-22" },
            { title: "Site Completion - Minneapolis CBD", date: "2025-04-28" }
        ]
    },
    northeast: {
        totalProjects: 58,
        activeProjects: 32,
        completedProjects: 26,
        projectStatus: {
            onTrack: 75,
            atRisk: 15,
            delayed: 10
        },
        topMilestones: [
            { title: "Equipment Upgrade - NYC Midtown", date: "2025-04-16" },
            { title: "Site Integration - Boston Harbor", date: "2025-04-21" },
            { title: "Final Testing - Philadelphia Center", date: "2025-04-27" }
        ]
    },
    southeast: {
        totalProjects: 63,
        activeProjects: 41,
        completedProjects: 22,
        projectStatus: {
            onTrack: 60,
            atRisk: 30,
            delayed: 10
        },
        topMilestones: [
            { title: "Site Preparation - Miami Beach", date: "2025-04-17" },
            { title: "Tower Construction - Atlanta Downtown", date: "2025-04-23" },
            { title: "Network Launch - Orlando Tourist District", date: "2025-04-29" }
        ]
    },
    southwest: {
        totalProjects: 54,
        activeProjects: 35,
        completedProjects: 19,
        projectStatus: {
            onTrack: 68,
            atRisk: 22,
            delayed: 10
        },
        topMilestones: [
            { title: "Foundation Work - Phoenix Central", date: "2025-04-19" },
            { title: "Equipment Setup - Las Vegas Strip", date: "2025-04-24" },
            { title: "Coverage Testing - Dallas Business District", date: "2025-04-30" }
        ]
    },
    west: {
        totalProjects: 50,
        activeProjects: 30,
        completedProjects: 20,
        projectStatus: {
            onTrack: 70,
            atRisk: 20,
            delayed: 10
        },
        topMilestones: [
            { title: "Site Survey - San Francisco Downtown", date: "2025-04-15" },
            { title: "Foundation Work - Los Angeles Central", date: "2025-04-20" },
            { title: "Equipment Installation - San Diego Central", date: "2025-04-25" }
        ]
    }
};

// Mock data for region details
const regionDetails = {
    pnw: {
        totalProjects: 24,
        activeProjects: 18,
        completedProjects: 6,
        projectStatus: {
            onTrack: 75,
            atRisk: 15,
            delayed: 10
        },
        topMilestones: [
            { date: "Apr 15, 2025", title: "Seattle Office Tower - Foundation Complete" },
            { date: "May 3, 2025", title: "Portland Bridge Repair - Phase 1 Complete" },
            { date: "May 20, 2025", title: "Boise Medical Center - Steel Structure" }
        ]
    },
    midwest: {
        totalProjects: 42,
        activeProjects: 35,
        completedProjects: 7,
        projectStatus: {
            onTrack: 68,
            atRisk: 22,
            delayed: 10
        },
        topMilestones: [
            { date: "Apr 10, 2025", title: "Chicago Waterfront - Environmental Approval" },
            { date: "Apr 28, 2025", title: "Minneapolis Convention Center - Roof Complete" },
            { date: "May 15, 2025", title: "Detroit Revitalization - Phase 2 Start" }
        ]
    },
    northeast: {
        totalProjects: 38,
        activeProjects: 29,
        completedProjects: 9,
        projectStatus: {
            onTrack: 82,
            atRisk: 12,
            delayed: 6
        },
        topMilestones: [
            { date: "Apr 5, 2025", title: "NYC Transit Hub - Platform Installation" },
            { date: "Apr 22, 2025", title: "Boston Harbor Project - Dredging Complete" },
            { date: "May 8, 2025", title: "Philadelphia School Renovations - Phase 3" }
        ]
    },
    southeast: {
        totalProjects: 31,
        activeProjects: 24,
        completedProjects: 7,
        projectStatus: {
            onTrack: 70,
            atRisk: 20,
            delayed: 10
        },
        topMilestones: [
            { date: "Apr 12, 2025", title: "Miami Beach Resort - Foundation Complete" },
            { date: "Apr 30, 2025", title: "Atlanta Airport Terminal - Steel Structure" },
            { date: "May 18, 2025", title: "New Orleans Flood Protection - Phase 2" }
        ]
    },
    southwest: {
        totalProjects: 27,
        activeProjects: 21,
        completedProjects: 6,
        projectStatus: {
            onTrack: 65,
            atRisk: 25,
            delayed: 10
        },
        topMilestones: [
            { date: "Apr 8, 2025", title: "Phoenix Solar Farm - Panel Installation" },
            { date: "Apr 25, 2025", title: "Dallas Office Complex - Exterior Complete" },
            { date: "May 12, 2025", title: "Houston Medical Center - Interior Fitout" }
        ]
    }
};

// Create the SVG with fixed dimensions
const svg = d3.select("#usa-map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

// Create a group for map elements
const g = svg.append("g");

// Create tooltip
const tooltip = d3.select("#tooltip");

// Load US map data
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(us => {
    // Convert TopoJSON to GeoJSON
    const states = topojson.feature(us, us.objects.states);
    
    // Get state name mapping
    const stateNames = new Map(us.objects.states.geometries.map(d => [d.id, d.properties.name]));
    
    // Create the projection
    const projection = d3.geoAlbersUsa()
        .fitSize([width, height], states);

    // Create the path generator
    const path = d3.geoPath()
        .projection(projection);

    // Draw states
    const stateElements = g.selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", d => {
            const stateAbbr = getStateAbbr(d.id, stateNames);
            return getRegionColor(stateAbbr);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .on("mouseover", function(event, d) {
            const stateAbbr = getStateAbbr(d.id, stateNames);
            const stateName = stateNames.get(d.id);
            
            // Show tooltip
            tooltip
                .style("opacity", 1)
                .html(`<strong>${stateName}</strong><br>${getStateTooltipInfo(stateAbbr)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            
            // Highlight state
            d3.select(this)
                .attr("stroke", "#333")
                .attr("stroke-width", 1.5);
        })
        .on("mouseout", function() {
            // Hide tooltip
            tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);
            
            // Reset state style
            d3.select(this)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5);
        })
        .on("click", function(event, d) {
            const stateAbbr = getStateAbbr(d.id, stateNames);
            const regionId = getRegionForState(stateAbbr);
            
            if (regionId) {
                showRegionOverview(regionId);
            }
        });

    // Add state borders with better styling
    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", "1")
        .attr("d", path);

    // Add state labels for better visibility
    g.selectAll("text")
        .data(states.features)
        .enter()
        .append("text")
        .attr("transform", d => `translate(${path.centroid(d)})`)
        .attr("dy", ".35em")
        .attr("class", "state-label")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .style("fill", d => {
            const stateAbbr = getStateAbbr(d.id, stateNames);
            return isStateInRegions(stateAbbr) ? "#FFFFFF" : "#4A5568";
        })
        .style("font-weight", "600")
        .style("pointer-events", "none")
        .text(d => getStateAbbr(d.id, stateNames));

}).catch(error => {
    console.error("Error loading the map:", error);
});

// Function to get state abbreviation from id
function getStateAbbr(id, stateNames) {
    const stateName = stateNames.get(id);
    return stateAbbreviations[stateName] || null;
}

// State abbreviations mapping
const stateAbbreviations = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
    "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
    "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
    "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
    "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
    "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
    "District of Columbia": "DC"
};

// Function to get region color for state
function getRegionColor(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return region.color;
        }
    }
    return "#EDF2F7";
}

// Function to get tooltip info for state
function getStateTooltipInfo(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return `Region: ${region.name}`;
        }
    }
    return "Not part of any region";
}

// Function to get region ID for state
function getRegionForState(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return regionId;
        }
    }
    return null;
}

// Function to check if state is in any region
function isStateInRegions(stateAbbr) {
    for (const region of Object.values(regions)) {
        if (region.states.includes(stateAbbr)) {
            return true;
        }
    }
    return false;
}

// Handle state click
function handleStateClick(d) {
    console.log("State clicked:", d);
    const stateAbbr = d.properties.postal;
    console.log("State abbr:", stateAbbr);
    
    const regionId = getRegionForState(stateAbbr);
    console.log("Region ID:", regionId);
    
    if (regionId) {
        showRegionOverview(regionId);
    }
}

function showRegionOverview(regionId) {
    console.log("Showing region overview for:", regionId);
    const region = regions[regionId];
    const details = regionDetails[regionId];

    if (!region || !details) {
        console.error("Missing data for region:", regionId);
        return;
    }

    // Add region color to header
    document.querySelector('.region-header').style.background = region.color;

    // Update region name
    document.getElementById('regionName').textContent = region.name;

    // Update project stats with animation
    animateCounter('totalProjects', 0, details.totalProjects);
    animateCounter('activeProjects', 0, details.activeProjects);
    animateCounter('completedProjects', 0, details.completedProjects);

    // Update status bars with animation
    setTimeout(() => {
        document.getElementById('onTrackStatus').style.width = `${details.projectStatus.onTrack}%`;
        document.getElementById('onTrackValue').textContent = `${details.projectStatus.onTrack}%`;
        
        document.getElementById('atRiskStatus').style.width = `${details.projectStatus.atRisk}%`;
        document.getElementById('atRiskValue').textContent = `${details.projectStatus.atRisk}%`;
        
        document.getElementById('delayedStatus').style.width = `${details.projectStatus.delayed}%`;
        document.getElementById('delayedValue').textContent = `${details.projectStatus.delayed}%`;
    }, 300);

    // Update milestones with staggered animation
    const milestonesList = document.getElementById('topMilestones');
    milestonesList.innerHTML = '';
    
    details.topMilestones.forEach((milestone, index) => {
        setTimeout(() => {
            const milestoneItem = document.createElement('div');
            milestoneItem.className = 'milestone-item';
            milestoneItem.style.opacity = '0';
            milestoneItem.style.transform = 'translateX(20px)';
            milestoneItem.innerHTML = `
                <div class="milestone-date">${milestone.date}</div>
                <div class="milestone-title">${milestone.title}</div>
            `;
            milestonesList.appendChild(milestoneItem);
            
            // Trigger animation after adding to DOM
            setTimeout(() => {
                milestoneItem.style.opacity = '1';
                milestoneItem.style.transform = 'translateX(0)';
                milestoneItem.style.transition = 'all 0.3s ease';
            }, 50);
        }, index * 150);
    });

    // Show overlay and card
    document.getElementById('overlay').classList.add('active');
    document.getElementById('regionOverview').classList.remove('hidden');
    
    // Update View All Projects link
    document.querySelector('.view-all-link').href = `project-tracking.html?region=${regionId}`;
}

// Function to animate counter
function animateCounter(elementId, start, end) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const frameDuration = 1000/60;
    const totalFrames = Math.round(duration / frameDuration);
    const increment = (end - start) / totalFrames;
    
    let currentFrame = 0;
    let currentValue = start;
    
    const animate = () => {
        currentFrame++;
        currentValue += increment;
        
        element.textContent = Math.floor(currentValue);
        
        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    };
    
    animate();
}

function closeRegionOverview() {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('regionOverview').classList.add('hidden');
}

// Add click handler to overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeRegionOverview);
    }
});

// Load region data
fetch('/api/regions')
    .then(response => response.json())
    .then(data => {
        regionData = data;
        updateMetricsSummary();
    })
    .catch(error => console.error('Error loading region data:', error));

function updateMetricsSummary() {
    let totalSites = 0;
    let totalTeams = 0;
    let equipmentHealth = "Good";

    for (const [regionId, details] of Object.entries(regionData)) {
        totalSites += details.activeSites || 0;
        totalTeams += details.teams || 0;
    }

    document.getElementById("total-sites").textContent = totalSites;
    document.getElementById("total-teams").textContent = totalTeams;
    document.getElementById("equipment-health").textContent = equipmentHealth;
}

// Profile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }
    
    // Initialize notification bell functionality
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notifications panel would open here');
        });
    }
    
    // Initialize search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                alert(`Search results for: ${this.value}`);
            }
        });
    }
});

// Update metrics summary with real data and animations
function updateMetricsSummary() {
    // National metrics data
    const nationalMetrics = {
        totalSites: 162,
        equipmentAvailable: "78%",
        totalTeams: 84,
        totalProjects: 162,
        budgetUtilization: "92%"
    };

    // Animate metrics
    animateCounter('total-sites', 0, nationalMetrics.totalSites);
    
    setTimeout(() => {
        document.getElementById('equipment-health').textContent = nationalMetrics.equipmentAvailable;
    }, 200);
    
    setTimeout(() => {
        animateCounter('total-teams', 0, nationalMetrics.totalTeams);
    }, 400);
    
    setTimeout(() => {
        animateCounter('total-projects', 0, nationalMetrics.totalProjects);
    }, 600);
    
    setTimeout(() => {
        document.getElementById('budget-utilization').textContent = nationalMetrics.budgetUtilization;
    }, 800);

    // Initialize mini charts in tooltips
    initializeMetricCharts();
}

// Initialize mini charts for metrics tooltips
function initializeMetricCharts() {
    // This would typically use a charting library like Chart.js
    // For now, we'll just add a placeholder visual
    const chartElements = [
        'sites-chart', 'equipment-chart', 'teams-chart', 
        'projects-chart', 'budget-chart'
    ];
    
    chartElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Create a simple visual representation
            element.innerHTML = `
                <div style="display: flex; align-items: flex-end; height: 100%; gap: 2px;">
                    ${generateMiniChartBars()}
                </div>
            `;
        }
    });
}

// Generate random bars for mini charts
function generateMiniChartBars() {
    let bars = '';
    const months = 12;
    
    for (let i = 0; i < months; i++) {
        const height = 20 + Math.floor(Math.random() * 20);
        const color = i < 9 ? '#E2E8F0' : '#3182CE';
        bars += `<div style="flex: 1; height: ${height}px; background-color: ${color}; border-radius: 1px;"></div>`;
    }
    
    return bars;
}

// Add click handlers to metrics for more interactivity
document.addEventListener('DOMContentLoaded', function() {
    const metrics = document.querySelectorAll('.metric');
    
    metrics.forEach(metric => {
        metric.addEventListener('click', function() {
            const metricId = this.id;
            showMetricDetails(metricId);
        });
    });
    
    // Initialize metrics on page load
    updateMetricsSummary();
});

// Show detailed information when clicking on a metric
function showMetricDetails(metricId) {
    console.log(`Showing detailed information for: ${metricId}`);
    // In a real implementation, this would show a modal or navigate to a detailed view
    // For now, we'll just log to console
    
    const metricLabels = {
        'active-sites-metric': 'Active Sites',
        'equipment-metric': 'Equipment Availability',
        'teams-metric': 'Construction Teams',
        'projects-metric': 'Total Projects',
        'budget-metric': 'Budget Utilization'
    };
    
    alert(`Detailed view for ${metricLabels[metricId]} would appear here.`);
}

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
