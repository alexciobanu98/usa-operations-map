const width = 960;
const height = 500;
const projection = d3.geoAlbersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

// Define regions and their states
const regions = {
    pnw: {
        name: "Pacific Northwest",
        states: ["WA", "OR", "ID"],
        color: "#2196F3"
    },
    midwest: {
        name: "Midwest",
        states: ["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI"],
        color: "#2196F3"
    },
    northeast: {
        name: "Northeast",
        states: ["CT", "DE", "ME", "MD", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"],
        color: "#2196F3"
    },
    southeast: {
        name: "Southeast",
        states: ["AL", "AR", "FL", "GA", "KY", "LA", "MS", "NC", "SC", "TN", "VA", "WV"],
        color: "#2196F3"
    },
    southwest: {
        name: "Southwest",
        states: ["AZ", "NM", "OK", "TX"],
        color: "#2196F3"
    },
    west: {
        name: "West",
        states: ["CA", "CO", "MT", "NV", "UT", "WY"],
        color: "#2196F3"
    }
};

let selectedRegion = null;
let regionData = {};
let usData = null;

// Create the SVG
const svg = d3.select("#usa-map")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("max-width", "100%")
    .style("height", "auto");

// Create a group for states
const statesGroup = svg.append("g").attr("class", "states");
// Create a group for labels
const labelsGroup = svg.append("g").attr("class", "labels");

// Load region data
fetch('/api/regions')
    .then(response => response.json())
    .then(data => {
        regionData = data;
        loadMap();
        updateMetricsSummary();
    })
    .catch(error => console.error('Error loading region data:', error));

// Load and render the map
function loadMap() {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(data => {
        usData = data;
        const states = topojson.feature(usData, usData.objects.states);
        const stateNames = new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name]));

        // Add states
        statesGroup.selectAll("path")
            .data(states.features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => getRegionColor(getStateAbbr(d.id, stateNames)))
            .attr("stroke", "#fff")
            .attr("stroke-width", "0.5")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip)
            .on("click", handleStateClick);

        // Add state labels
        labelsGroup.selectAll("text")
            .data(states.features)
            .join("text")
            .attr("class", "state-label")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", "8px")
            .style("font-weight", d => {
                const stateAbbr = getStateAbbr(d.id, stateNames);
                return isStateInRegions(stateAbbr) ? "bold" : "normal";
            })
            .text(d => getStateAbbr(d.id, stateNames));
    });
}

function getStateAbbr(id, stateNames) {
    const stateName = stateNames.get(id);
    return stateAbbreviations[stateName] || "";
}

function getRegionColor(stateAbbr) {
    if (selectedRegion) {
        const region = regions[selectedRegion];
        if (region && region.states.includes(stateAbbr)) {
            return region.color;
        }
    }
    
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return "#90caf9"; // lighter blue for non-selected regions
        }
    }
    return "#e3f2fd"; // very light blue for non-region states
}

function isStateInRegions(stateAbbr) {
    return Object.values(regions).some(region => region.states.includes(stateAbbr));
}

function getRegionForState(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return regionId;
        }
    }
    return null;
}

function showTooltip(event, d) {
    const stateAbbr = getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])));
    const regionId = getRegionForState(stateAbbr);
    
    if (regionId) {
        const region = regions[regionId];
        const tooltip = d3.select("#tooltip");
        tooltip
            .classed("hidden", false)
            .html(`
                <strong>${region.name}</strong><br>
                State: ${stateAbbr}<br>
                Click for details
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }
}

function moveTooltip(event) {
    d3.select("#tooltip")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
    d3.select("#tooltip").classed("hidden", true);
}

function handleStateClick(event, d) {
    const stateAbbr = getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])));
    const regionId = getRegionForState(stateAbbr);
    if (regionId) {
        showRegionDetails(regionId);
    }
}

function showRegionDetails(regionId) {
    selectedRegion = regionId;
    const region = regions[regionId];
    const details = regionData[regionId] || {};

    // Update map colors
    statesGroup.selectAll("path")
        .attr("fill", d => getRegionColor(getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])))));

    // Update details panel
    document.getElementById("region-title").textContent = region.name;
    const content = document.getElementById("operations-content");
    content.innerHTML = `
        <div class="operation-item">
            <h3>Active Sites</h3>
            <p>${details.activeSites || 0}</p>
        </div>
        <div class="operation-item">
            <h3>Construction Teams</h3>
            <p>${details.teams || 0}</p>
        </div>
        <div class="operation-item">
            <h3>Equipment Status</h3>
            <p>${details.equipmentStatus || 'N/A'}</p>
        </div>
    `;

    document.getElementById("region-details").classList.remove("hidden");
}

function closeDetails() {
    selectedRegion = null;
    document.getElementById("region-details").classList.add("hidden");
    // Reset map colors
    statesGroup.selectAll("path")
        .attr("fill", d => getRegionColor(getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])))));
}

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
            profileDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
});

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
    "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};
