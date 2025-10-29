// Statistics page functionality
document.addEventListener("DOMContentLoaded", () => {
    // For now, using 50-50 split as requested
    // This can be updated later to calculate from actual candidate data
    
    const stats = {
        centralPanel: { male: 50, female: 50 },
        councillor: { male: 50, female: 50 },
        voters: { male: 50, female: 50 }
    };

    // Function to create a pie chart SVG path for given percentages
    function createPieChartSVG(malePercent, femalePercent, chartId) {
        const radius = 80;
        const centerX = 100;
        const centerY = 100;
        
        // Calculate angle for male percentage (navy blue)
        const maleAngle = (malePercent / 100) * 360;
        const maleAngleRad = (maleAngle * Math.PI) / 180;
        
        // Start from top (0 degrees = -90 in SVG coordinates)
        const startAngle = -Math.PI / 2; // -90 degrees
        const endAngle = startAngle + maleAngleRad;
        
        // Calculate endpoint for male segment
        const endX = centerX + radius * Math.cos(endAngle);
        const endY = centerY + radius * Math.sin(endAngle);
        
        // Large arc flag: 1 if angle > 180, 0 otherwise
        const largeArcFlag = maleAngle > 180 ? 1 : 0;
        
        // Create SVG
        const svg = `
            <svg class="pie-chart" viewBox="0 0 200 200">
                <!-- Male segment (Navy Blue) -->
                <path d="M ${centerX} ${centerY} L ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z" 
                      fill="#001f3f" />
                <!-- Female segment (Black) -->
                <path d="M ${centerX} ${centerY} L ${endX} ${endY} A ${radius} ${radius} 0 ${1 - largeArcFlag} 1 ${centerX} ${centerY - radius} Z" 
                      fill="#000000" />
            </svg>
        `;
        
        return svg;
    }

    // Function to update a chart with new data
    function updateChart(containerId, malePercent, femalePercent) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const svg = createPieChartSVG(malePercent, femalePercent);
        const chartDiv = container.querySelector('.pie-chart-container');
        if (chartDiv) {
            chartDiv.innerHTML = svg;
        }
        
        // Update legend
        const legendItems = container.querySelectorAll('.legend-item span:last-child');
        if (legendItems.length >= 2) {
            legendItems[0].textContent = `Male: ${malePercent}%`;
            legendItems[1].textContent = `Female: ${femalePercent}%`;
        }
    }

    // Initialize all charts with 50-50 split
    updateChart('central-panel-chart', stats.centralPanel.male, stats.centralPanel.female);
    updateChart('councillor-chart', stats.councillor.male, stats.councillor.female);
    updateChart('voters-chart', stats.voters.male, stats.voters.female);

    // Future: Function to calculate statistics from actual candidate data
    // This can be implemented later when gender data is available
    async function calculateStatisticsFromData() {
        // This would fetch candidate data and calculate actual gender ratios
        // For now, keeping the 50-50 placeholder
        
        /*
        Example implementation:
        const centralPanelFiles = [...];
        const councillorFiles = [...];
        
        // Fetch and process data
        // Count male/female candidates
        // Update stats object
        // Call updateChart for each
        */
    }
});

