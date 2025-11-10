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
        'scns.json',
        'absvme.json',
        'amalgamate.json',
        'cslg.json',
        'saa.json',
        'sbt.json',
        'scis.json',
        'ssis.json',
        'scss.json',
        'ses.json',
        'sis.json',
        'sll-cs.json',
        'soe.json',
        'sps.json',
        'sss.json'
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
        
        // Keep candidates in original order (alphabetical with NOTA, BLANK, INVALID at end)
        candidates.forEach(candidate => {
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
            
            // Check if error is due to CORS (file:// protocol)
            const isCorsError = error.message.includes('fetch') || error.message.includes('Failed to fetch') || 
                               error.message.includes('CORS') || window.location.protocol === 'file:';
            
            const errorMessage = `
                <div style="padding: 2rem; text-align: center; color: #d32f2f;">
                    <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">Unable to load results</p>
                    ${isCorsError ? `
                        <p style="font-weight: bold; margin-bottom: 1rem;">⚠️ This website must be run through a local server!</p>
                        <p style="margin-bottom: 0.5rem;">Please use one of these methods:</p>
                        <ol style="text-align: left; display: inline-block; margin: 1rem 0;">
                            <li style="margin-bottom: 0.5rem;"><strong>Python:</strong> Run <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">python -m http.server 8000</code> in this folder, then visit <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">http://localhost:8000</code></li>
                            <li style="margin-bottom: 0.5rem;"><strong>VS Code:</strong> Install "Live Server" extension and right-click index.html → "Open with Live Server"</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Node.js:</strong> Run <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">npx http-server -p 8000</code></li>
                        </ol>
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Opening HTML files directly (file://) won't work due to browser security restrictions.</p>
                    ` : `
                        <p>Please check your internet connection and try again later.</p>
                        <p style="font-size: 0.9rem; margin-top: 1rem; color: #666;">Error: ${error.message}</p>
                    `}
                </div>
            `;
            if (centralContainer) centralContainer.innerHTML = errorMessage;
            if (councillorContainer) councillorContainer.innerHTML = errorMessage;
        }
    }

    // Load results immediately if we are on a results page
    if (centralContainer || councillorContainer) {
        loadResults();
        
        // Auto-refresh disabled
        // setInterval(loadResults, 60000);
    }
});