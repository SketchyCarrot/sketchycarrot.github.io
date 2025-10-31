// Statistics page functionality
document.addEventListener("DOMContentLoaded", () => {
    const centralPanelChart = document.getElementById('central-panel-chart');
    const councillorChart = document.getElementById('councillor-chart');
    const votersChart = document.getElementById('voters-chart');
    const centralPanelLegend = document.getElementById('central-panel-legend');
    const councillorLegend = document.getElementById('councillor-legend');
    const votersLegend = document.getElementById('voters-legend');
    const lastUpdatedSpan = document.getElementById('last-updated');

    // Central panel file names
    const centralPanelFiles = [
        'president.json',
        'vice-president.json',
        'general-secretary.json',
        'joint-secretary.json'
    ];

    // Councillor file names
    const councillorFiles = [
        'sls.json',
        'soe.json',
        'sps.json',
        'sss.json',
        'scns.json',
        'scmm.json',
        'sll-cs.json',
        'absvme.json',
        'amalgamate.json',
        'cslg.json',
        'part-time.json',
        'saa.json',
        'sbt.json',
        'scis.json',
        'scss.json',
        'ses.json',
        'sis.json'
    ];

    // Helper function to fetch a JSON file
    async function fetchJSONFile(path) {
        const response = await fetch(`${path}?v=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${path}`);
        }
        return await response.json();
    }

    // Function to create SVG pie chart
    function createPieChart(svgElement, malePercent, femalePercent, colors) {
        const radius = 90;
        const centerX = 100;
        const centerY = 100;
        
        // Clear previous content
        svgElement.innerHTML = '';
        
        // Calculate angles
        const maleAngle = (malePercent / 100) * 360;
        const femaleAngle = (femalePercent / 100) * 360;
        
        // Function to calculate point on circle
        function getPointOnCircle(angle) {
            const radian = (angle - 90) * (Math.PI / 180);
            return {
                x: centerX + radius * Math.cos(radian),
                y: centerY + radius * Math.sin(radian)
            };
        }
        
        // Create male segment
        if (malePercent > 0) {
            const startAngle = -90;
            const endAngle = startAngle + maleAngle;
            const largeArcFlag = maleAngle > 180 ? 1 : 0;
            
            const startPoint = getPointOnCircle(startAngle);
            const endPoint = getPointOnCircle(endAngle);
            
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startPoint.x} ${startPoint.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`,
                'Z'
            ].join(' ');
            
            const malePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            malePath.setAttribute('d', pathData);
            malePath.setAttribute('fill', colors.male);
            malePath.setAttribute('stroke', '#000000');
            malePath.setAttribute('stroke-width', '2');
            svgElement.appendChild(malePath);
        }
        
        // Create female segment
        if (femalePercent > 0) {
            const startAngle = -90 + maleAngle;
            const endAngle = startAngle + femaleAngle;
            const largeArcFlag = femaleAngle > 180 ? 1 : 0;
            
            const startPoint = getPointOnCircle(startAngle);
            const endPoint = getPointOnCircle(endAngle);
            
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startPoint.x} ${startPoint.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`,
                'Z'
            ].join(' ');
            
            const femalePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            femalePath.setAttribute('d', pathData);
            femalePath.setAttribute('fill', colors.female);
            femalePath.setAttribute('stroke', '#000000');
            femalePath.setAttribute('stroke-width', '2');
            svgElement.appendChild(femalePath);
        }
    }

    // Function to create legend
    function createLegend(legendElement, malePercent, femalePercent, colors) {
        legendElement.innerHTML = `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${colors.male};"></span>
                <span>Male: ${malePercent.toFixed(1)}%</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${colors.female};"></span>
                <span>Female: ${femalePercent.toFixed(1)}%</span>
            </div>
        `;
    }

    // Load and display statistics
    async function loadStatistics() {
        try {
            // For now, use 50-50 for all statistics as requested
            const malePercent = 50;
            const femalePercent = 50;
            
            // Colors: navy blue (#001f3f) and white (#FFFFFF) with black borders
            const colors = {
                male: '#001f3f',  // Navy Blue
                female: '#FFFFFF'  // White
            };

            // Calculate actual ratios from data (for future use when gender data is available)
            // For now, fetch data but use 50-50
            try {
                // Fetch central panel data
                const centralPanelData = await Promise.all(
                    centralPanelFiles.map(file => 
                        fetchJSONFile(`data/central-panel/${file}`)
                    )
                );
                
                // Fetch councillor data
                const councillorData = await Promise.all(
                    councillorFiles.map(file => 
                        fetchJSONFile(`data/councillors/${file}`).catch(() => null)
                    )
                );
                
                // Update last updated timestamp
                if (lastUpdatedSpan && centralPanelData[0]?.lastUpdated) {
                    const updatedDate = new Date(centralPanelData[0].lastUpdated);
                    lastUpdatedSpan.textContent = updatedDate.toLocaleString();
                }
            } catch (error) {
                console.warn('Could not fetch data for statistics:', error);
            }

            // Create charts with 50-50 ratio
            createPieChart(centralPanelChart, malePercent, femalePercent, colors);
            createLegend(centralPanelLegend, malePercent, femalePercent, colors);
            
            createPieChart(councillorChart, malePercent, femalePercent, colors);
            createLegend(councillorLegend, malePercent, femalePercent, colors);
            
            createPieChart(votersChart, malePercent, femalePercent, colors);
            createLegend(votersLegend, malePercent, femalePercent, colors);

        } catch (error) {
            console.error("Could not load statistics:", error);
            if (centralPanelChart) {
                centralPanelChart.innerHTML = '<text x="100" y="100" text-anchor="middle" fill="#000000">Error loading data</text>';
            }
        }
    }

    // Load statistics when page loads
    if (centralPanelChart && councillorChart && votersChart) {
        loadStatistics();
        
        // Refresh every 60 seconds
        setInterval(loadStatistics, 60000);
    }
});

