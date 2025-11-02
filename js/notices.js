// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
    
    // Function to fetch notices JSON file
    async function fetchNotices() {
        try {
            // First try to fetch from notices.txt and convert
            try {
                const txtResponse = await fetch(`data/notices.txt?v=${new Date().getTime()}`);
                if (txtResponse.ok) {
                    const txtContent = await txtResponse.text();
                    // Convert txt to JSON
                    return convertNoticesTxtToJson(txtContent);
                }
            } catch (txtError) {
                console.log("Could not fetch notices.txt, trying notices.json");
            }
            
            // Fallback to JSON file
            const response = await fetch(`data/notices.json?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch notices:", error);
            throw error;
        }
    }
    
    // Function to convert notices.txt format to JSON
    function convertNoticesTxtToJson(txtContent) {
        const lines = txtContent.split('\n').filter(line => line.trim() !== '');
        const notices = [];
        
        lines.forEach((line, index) => {
            const parts = line.split('|');
            if (parts.length >= 3) {
                const date = parts[0].trim();
                const title = parts[1].trim();
                const content = parts[2].trim();
                const pdf = parts.length >= 4 ? parts[3].trim() : null;
                
                const notice = {
                    id: `notice${index + 1}`,
                    title: title,
                    content: content,
                    date: date
                };
                
                if (pdf) {
                    notice.pdf = pdf;
                }
                
                notices.push(notice);
            }
        });
        
        return { notices: notices };
    }

    // Function to format date (short format for home page)
    function formatDate(dateString, shortFormat = false) {
        const date = new Date(dateString);
        if (shortFormat) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Function to create a notice card (for notices page)
    function createNoticeCard(notice) {
        const card = document.createElement('div');
        card.className = 'notice-card';
        
        let pdfButtons = '';
        if (notice.pdf) {
            const pdfPath = `data/pdfs/${notice.pdf}`;
            pdfButtons = `
                <div class="notice-pdf-actions">
                    <a href="${pdfPath}" target="_blank" class="pdf-btn pdf-view-btn" title="View PDF">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View PDF
                    </a>
                    <a href="${pdfPath}" download="${notice.pdf}" class="pdf-btn pdf-download-btn" title="Download PDF">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download PDF
                    </a>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="notice-header">
                <h3 class="notice-title">${notice.title}</h3>
                <span class="notice-date">${formatDate(notice.date)}</span>
            </div>
            <div class="notice-content">
                <p>${notice.content}</p>
            </div>
            ${pdfButtons}
        `;
        return card;
    }
    
    // Function to create a compact notice link (for home page)
    function createCompactNoticeLink(notice) {
        const link = document.createElement('a');
        link.href = 'notices.html';
        link.className = 'notice-link-home';
        link.textContent = formatDate(notice.date, true);
        link.title = notice.title;
        return link;
    }

    // Function to display notices (sorted by date, latest first)
    async function loadNotices(limit = null) {
        try {
            const data = await fetchNotices();
            const noticesContainer = document.getElementById('notices-container');
            const homeNoticesContainer = document.getElementById('home-notices-container');

            if (!noticesContainer && !homeNoticesContainer) {
                return; // No notices container found
            }

            // Sort notices by date (latest first)
            const sortedNotices = [...data.notices].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            // Limit notices if specified (for home page)
            const noticesToDisplay = limit ? sortedNotices.slice(0, limit) : sortedNotices;

            // Clear loading message
            if (noticesContainer) {
                noticesContainer.innerHTML = '';
            }
            if (homeNoticesContainer) {
                homeNoticesContainer.innerHTML = '';
            }

            // Display notices
            noticesToDisplay.forEach((notice, index) => {
                if (noticesContainer) {
                    // Full notice card for notices page
                    const card = createNoticeCard(notice);
                    noticesContainer.appendChild(card);
                }
                if (homeNoticesContainer) {
                    // Compact link for home page
                    const link = createCompactNoticeLink(notice);
                    // Add special class to the latest notice (first one)
                    if (index === 0) {
                        link.classList.add('latest-notice');
                    }
                    homeNoticesContainer.appendChild(link);
                }
            });

            // If no notices found
            if (noticesToDisplay.length === 0) {
                const noNoticesMsg = document.createElement('p');
                noNoticesMsg.className = 'no-notices';
                noNoticesMsg.textContent = 'No notices available at this time.';
                if (noticesContainer) {
                    noticesContainer.appendChild(noNoticesMsg);
                }
                if (homeNoticesContainer) {
                    homeNoticesContainer.appendChild(noNoticesMsg);
                }
            }

        } catch (error) {
            console.error("Could not load notices:", error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <p style="padding: 2rem; text-align: center; color: #d32f2f;">
                    <strong>Unable to load notices</strong><br>
                    Please check your internet connection and try again later.
                </p>
            `;
            
            const noticesContainer = document.getElementById('notices-container');
            const homeNoticesContainer = document.getElementById('home-notices-container');
            
            if (noticesContainer) {
                noticesContainer.innerHTML = '';
                noticesContainer.appendChild(errorMessage);
            }
            if (homeNoticesContainer) {
                homeNoticesContainer.innerHTML = '';
                homeNoticesContainer.appendChild(errorMessage);
            }
        }
    }

    // Load notices for the notices page (all notices)
    if (document.getElementById('notices-container')) {
        loadNotices();
    }

    // Load notices for the home page (top 3)
    if (document.getElementById('home-notices-container')) {
        loadNotices(3);
    }

    // Export loadNotices function for use in other scripts if needed
    window.loadNotices = loadNotices;
});

