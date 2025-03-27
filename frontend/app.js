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

// Check if user is authenticated
document.addEventListener('DOMContentLoaded', async function() {
    // Redirect to login if not authenticated
    if (!ApiService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    const currentUser = ApiService.getCurrentUser();
    if (currentUser) {
        // Update profile button with user info
        const profileButton = document.getElementById('profileButton');
        if (profileButton) {
            const userInitial = currentUser.username.charAt(0).toUpperCase();
            profileButton.innerHTML = `
                <div class="profile-avatar">${userInitial}</div>
                <span class="profile-name">${currentUser.username}</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
    }
    
    // Initialize the map and load data
    initializeMap();
});

// Initialize map and load data
async function initializeMap() {
    try {
        // Try to load project data from API
        let projectsSummary = {};
        let overallMetrics = {};
        
        try {
            projectsSummary = await ApiService.getProjectsSummaryByRegion();
            overallMetrics = await ApiService.getOverallMetrics();
            console.log("API data loaded successfully", projectsSummary, overallMetrics);
        } catch (error) {
            console.warn("Could not load data from API, using mock data instead:", error);
            // Use mock data if API fails
            projectsSummary = {
                pnw: { totalProjects: 24, activeProjects: 18, completedProjects: 6 },
                midwest: { totalProjects: 45, activeProjects: 32, completedProjects: 13 },
                northeast: { totalProjects: 36, activeProjects: 22, completedProjects: 14 },
                southeast: { totalProjects: 52, activeProjects: 38, completedProjects: 14 },
                southwest: { totalProjects: 31, activeProjects: 19, completedProjects: 12 },
                west: { totalProjects: 40, activeProjects: 28, completedProjects: 12 }
            };
            
            overallMetrics = {
                totalProjects: 228,
                activeProjects: 157,
                completedProjects: 71,
                totalSites: 162,
                activeSites: 126
            };
        }
        
        // Update region data with data from API or mock data
        Object.keys(regions).forEach(regionId => {
            if (projectsSummary[regionId]) {
                regionData[regionId] = projectsSummary[regionId];
            } else {
                // Fallback to mock data
                regionData[regionId] = regionDetails[regionId] || { 
                    totalProjects: 0, 
                    activeProjects: 0, 
                    completedProjects: 0 
                };
            }
        });
        
        // Update metrics with real data or mock data
        updateMetricsSummary(overallMetrics);
        
        // Continue with map initialization
        loadMapData();
    } catch (error) {
        console.error('Error loading data:', error);
        // Show error message to user
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Data</h3>
                    <p>${error.message || 'Could not load map data. Please try again later.'}</p>
                    <button onclick="initializeMap()" class="retry-button">Retry</button>
                </div>
            `;
        } else {
            // Fallback to just loading the map with mock data
            loadMapData();
        }
    }
}

// Load map data from D3
function loadMapData() {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(us => {
        // Convert TopoJSON to GeoJSON
        const states = topojson.feature(us, us.objects.states);
        
        // Get state name mapping
        const stateNames = {};
        states.features.forEach(d => {
            const id = d.id;
            const stateName = d.properties.name;
            stateNames[id] = stateName;
        });
        
        // Create the map
        createMap(us, stateNames);
    }).catch(error => {
        console.error('Error loading map data:', error);
    });
}

// Show region overview with real data
async function showRegionOverview(regionId) {
    // Show loading state
    const overlay = document.getElementById('overlay');
    const regionOverview = document.getElementById('regionOverview');
    
    overlay.style.display = 'flex';
    regionOverview.classList.remove('hidden');
    regionOverview.innerHTML = `
        <div class="region-header">
            <h2>${regions[regionId].name}</h2>
            <button class="close-button" onclick="closeRegionOverview()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading region data...</p>
        </div>
    `;
    
    try {
        // Fetch region projects from API
        let regionProjects = [];
        try {
            regionProjects = await ApiService.getProjectsByRegion(regionId);
        } catch (error) {
            console.warn('Could not fetch projects from API, using mock data:', error);
            // Use mock data if API fails
            regionProjects = mockProjectData[regionId]?.projects || [];
        }
        
        // Get region details
        const details = regionDetails[regionId];
        if (!details) {
            throw new Error('Region details not found');
        }
        
        // Update region name
        document.getElementById('regionName').textContent = regions[regionId].name;
        
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
        
    } catch (error) {
        console.error('Error loading region data:', error);
        regionOverview.innerHTML = `
            <div class="region-header">
                <h2>Error</h2>
                <button class="close-button" onclick="closeRegionOverview()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load region data. Please try again later.</p>
                <button onclick="showRegionOverview('${regionId}')" class="retry-button">Retry</button>
            </div>
        `;
    }
}

// Make closeRegionOverview function globally accessible
window.closeRegionOverview = function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('regionOverview').classList.add('hidden');
}

// Update metrics summary with real data and animations
async function updateMetricsSummary(metrics) {
    // If metrics not provided, try to fetch from API
    if (!metrics) {
        try {
            metrics = await ApiService.getOverallMetrics();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return;
        }
    }
    
    // Update metrics with real data
    const totalProjects = document.getElementById('total-projects-metric');
    const activeProjects = document.getElementById('active-projects-metric');
    const completedProjects = document.getElementById('completed-projects-metric');
    const totalSites = document.getElementById('total-sites-metric');
    
    if (totalProjects) totalProjects.textContent = metrics.totalProjects || 0;
    if (activeProjects) activeProjects.textContent = metrics.activeProjects || 0;
    if (completedProjects) completedProjects.textContent = metrics.completedProjects || 0;
    if (totalSites) totalSites.textContent = metrics.totalSites || 0;
    
    // Update progress bars
    const projectsProgress = document.getElementById('projects-progress');
    const sitesProgress = document.getElementById('sites-progress');
    
    if (projectsProgress && metrics.totalProjects > 0) {
        const completionPercentage = (metrics.completedProjects / metrics.totalProjects) * 100;
        projectsProgress.style.width = `${completionPercentage}%`;
    }
    
    if (sitesProgress && metrics.totalSites > 0) {
        const activeSitesPercentage = (metrics.activeSites / metrics.totalSites) * 100;
        sitesProgress.style.width = `${activeSitesPercentage}%`;
    }
    
    // Initialize charts
    initializeMetricCharts(metrics);
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            ApiService.logout();
        });
    }
});
