// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {

    // --- Hamburger Menu Logic ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle 'active' class on both hamburger and menu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- Data Fetching Logic ---
    const centralContainer = document.getElementById('central-results-container');
    const councillorContainer = document.getElementById('councillor-results-container');
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
        'chosching-lazes.json',
        'scmm.json',
        'sll-cs.json'
    ];

    // Helper function to fetch a JSON file
    async function fetchJSONFile(path) {
        const response = await fetch(`${path}?v=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${path}`);
        }
        return await response.json();
    }

    // Function to create a table for a position/school
    function createTable(candidates, positionName = null) {
        const table = document.createElement('table');
        table.className = 'results-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Candidate Name</th>
                <th class="votes-header">Votes</th>
            </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        
        // Sort candidates by votes (highest first)
        const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
        
        sortedCandidates.forEach(candidate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${candidate.name}</td>
                <td class="votes-cell">${candidate.votes.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        return table;
    }

    // Function to fetch and display results
    async function loadResults() {
        try {
            // --- Fetch Central Panel Data ---
            if (centralContainer) {
                centralContainer.innerHTML = '<p>Loading results...</p>';
                
                const centralPanelData = await Promise.all(
                    centralPanelFiles.map(file => 
                        fetchJSONFile(`data/central-panel/${file}`)
                    )
                );
                
                // Clear loading message
                centralContainer.innerHTML = '';
                
                // Display each position
                centralPanelData.forEach(positionData => {
                    if (!positionData || !positionData.candidates) {
                        console.warn(`Invalid data for position: ${positionData?.position}`);
                        return;
                    }
                    
                    const group = document.createElement('div');
                    group.className = 'school-group';
                    
                    const title = document.createElement('h3');
                    title.textContent = positionData.position;
                    group.appendChild(title);
                    
                    const table = createTable(positionData.candidates);
                    group.appendChild(table);
                    
                    centralContainer.appendChild(group);
                    
                    // Update last updated timestamp from the first position
                    if (lastUpdatedSpan && positionData.lastUpdated) {
                        const updatedDate = new Date(positionData.lastUpdated);
                        lastUpdatedSpan.textContent = updatedDate.toLocaleString();
                    }
                });
            }

            // --- Fetch Councillor Data ---
            if (councillorContainer) {
                councillorContainer.innerHTML = '<p>Loading results...</p>';
                
                const councillorData = await Promise.all(
                    councillorFiles.map(file => 
                        fetchJSONFile(`data/councillors/${file}`).catch(error => {
                            console.warn(`Failed to load ${file}:`, error);
                            return null;
                        })
                    )
                );
                
                // Filter out null results
                const validCouncillorData = councillorData.filter(data => data !== null);
                
                // Clear loading message
                councillorContainer.innerHTML = '';
                
                // Display each school
                validCouncillorData.forEach(schoolData => {
                    if (!schoolData || !schoolData.candidates) {
                        return;
                    }
                    
                    const group = document.createElement('div');
                    group.className = 'school-group';
                    
                    const title = document.createElement('h3');
                    title.textContent = schoolData.school;
                    group.appendChild(title);
                    
                    const table = createTable(schoolData.candidates);
                    group.appendChild(table);
                    
                    councillorContainer.appendChild(group);
                    
                    // Update last updated timestamp from the first school
                    if (lastUpdatedSpan && schoolData.lastUpdated) {
                        const updatedDate = new Date(schoolData.lastUpdated);
                        lastUpdatedSpan.textContent = updatedDate.toLocaleString();
                    }
                });
            }

        } catch (error) {
            console.error("Could not load election results:", error);
            const errorMessage = `
                <div style="padding: 2rem; text-align: center; color: #d32f2f;">
                    <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">Unable to load results</p>
                    <p>Please check your internet connection and try again later.</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem; color: #666;">Error: ${error.message}</p>
                </div>
            `;
            if (centralContainer) centralContainer.innerHTML = errorMessage;
            if (councillorContainer) councillorContainer.innerHTML = errorMessage;
        }
    }

    // Load results immediately if we are on a results page
    if (centralContainer || councillorContainer) {
        loadResults();
        
        // Set an interval to refresh the data every 60 seconds (60000 milliseconds)
        setInterval(loadResults, 60000);
    }
});