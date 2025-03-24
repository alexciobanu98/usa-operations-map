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

        svg.append("g")
            .selectAll("path")
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
    });
}

function getStateAbbr(id, stateNames) {
    const stateName = stateNames.get(id);
    return stateAbbreviations[stateName] || "";
}

function getRegionColor(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return region.color;
        }
    }
    return "#e3f2fd";
}

function getRegionForState(stateAbbr) {
    for (const [regionId, region] of Object.entries(regions)) {
        if (region.states.includes(stateAbbr)) {
            return { id: regionId, ...region };
        }
    }
    return null;
}

function showTooltip(event, d) {
    const stateAbbr = getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])));
    const region = getRegionForState(stateAbbr);
    
    if (region && regionData[region.id]) {
        const data = regionData[region.id];
        const tooltip = d3.select("#tooltip");
        
        tooltip
            .classed("hidden", false)
            .html(`
                <strong>${data.name}</strong><br>
                Active Sites: ${data.operations.construction.active_sites}<br>
                Equipment Health: ${data.operations.equipment.health_status}%<br>
                Completion Rate: ${data.operations.construction.completion_rate}
            `);
        
        moveTooltip(event);
    }
}

function moveTooltip(event) {
    const tooltip = d3.select("#tooltip");
    const tooltipWidth = tooltip.node().offsetWidth;
    const tooltipHeight = tooltip.node().offsetHeight;
    
    tooltip
        .style("left", (event.pageX - tooltipWidth / 2) + "px")
        .style("top", (event.pageY - tooltipHeight - 10) + "px");
}

function hideTooltip() {
    d3.select("#tooltip").classed("hidden", true);
}

function handleStateClick(event, d) {
    const stateAbbr = getStateAbbr(d.id, new Map(usData.objects.states.geometries.map(d => [d.id, d.properties.name])));
    const region = getRegionForState(stateAbbr);
    
    if (region && regionData[region.id]) {
        showRegionDetails(region.id);
    }
}

function showRegionDetails(regionId) {
    const data = regionData[regionId];
    const details = d3.select("#region-details");
    
    details.select("#region-title").text(data.name);
    
    const content = details.select("#operations-content");
    content.html(`
        <div class="operation-card">
            <h3>Construction</h3>
            <p>Active Sites: ${data.operations.construction.active_sites}</p>
            <p>Completion Rate: ${data.operations.construction.completion_rate}</p>
            <p>Equipment Deployed: ${data.operations.construction.equipment_deployed}</p>
            <p>Locations: ${data.operations.construction.locations.join(", ")}</p>
        </div>
        <div class="operation-card">
            <h3>Equipment</h3>
            <p>Inventory Status: ${data.operations.equipment.inventory_status}</p>
            <p>Major Equipment: ${data.operations.equipment.major_equipment.join(", ")}</p>
            <p>Health Status: ${data.operations.equipment.health_status}%</p>
        </div>
    `);
    
    details.classed("hidden", false);
}

function closeDetails() {
    d3.select("#region-details").classed("hidden", true);
}

function updateMetricsSummary() {
    let totalSites = 0;
    let totalHealth = 0;
    let healthCount = 0;
    
    Object.values(regionData).forEach(region => {
        totalSites += region.operations.construction.active_sites;
        const health = parseInt(region.operations.equipment.health_status);
        if (!isNaN(health)) {
            totalHealth += health;
            healthCount++;
        }
    });
    
    const avgHealth = healthCount > 0 ? Math.round(totalHealth / healthCount) : 0;
    
    d3.select("#total-sites").text(totalSites);
    d3.select("#equipment-health").text(avgHealth + "%");
    d3.select("#total-teams").text("20"); // This would come from the API in a real application
}

// State abbreviations mapping
const stateAbbreviations = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
    "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH",
    "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
    "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN",
    "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
    "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};
