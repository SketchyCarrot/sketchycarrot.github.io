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

    // Function to fetch and display results
    async function loadResults() {
        try {
            // Fetch the data. Add cache-busting query to prevent browser from using old file
            const response = await fetch(`data/results.json?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Update "Last Updated" timestamp
            if (lastUpdatedSpan) {
                const updatedDate = new Date(data.lastUpdated);
                lastUpdatedSpan.textContent = updatedDate.toLocaleString();
            }

            // --- Populate Central Panel Page ---
            if (centralContainer) {
                // Clear "Loading..." message
                centralContainer.innerHTML = '';
                
                // Sort candidates by votes (highest first)
                data.centralPanel.sort((a, b) => b.votes - a.votes);

                data.centralPanel.forEach(candidate => {
                    const row = document.createElement('div');
                    row.className = 'candidate-row';
                    row.innerHTML = `
                        <span class="candidate-name">${candidate.name}</span>
                        <span class="candidate-votes">${candidate.votes} Votes</span>
                    `;
                    centralContainer.appendChild(row);
                });
            }

            // --- Populate Councillor Page ---
            if (councillorContainer) {
                // Clear "Loading..." message
                councillorContainer.innerHTML = '';
                
                data.councillor.forEach(school => {
                    const group = document.createElement('div');
                    group.className = 'school-group';
                    
                    const title = document.createElement('h3');
                    title.textContent = school.school;
                    group.appendChild(title);
                    
                    // Sort candidates in this school by votes
                    school.candidates.sort((a, b) => b.votes - a.votes);
                    
                    school.candidates.forEach(candidate => {
                        const row = document.createElement('div');
                        row.className = 'candidate-row';
                        row.innerHTML = `
                            <span class="candidate-name">${candidate.name}</span>
                            <span class="candidate-votes">${candidate.votes} Votes</span>
                        `;
                        group.appendChild(row);
                    });
                    
                    councillorContainer.appendChild(group);
                });
            }

        } catch (error) {
            console.error("Could not load election results:", error);
            if (centralContainer) centralContainer.innerHTML = "<p>Error loading results. Please check back soon.</p>";
            if (councillorContainer) councillorContainer.innerHTML = "<p>Error loading results. Please check back soon.</p>";
        }
    }

    // Load results immediately if we are on a results page
    if (centralContainer || councillorContainer) {
        loadResults();
        
        // Set an interval to refresh the data every 60 seconds (60000 milliseconds)
        setInterval(loadResults, 60000);
    }
});