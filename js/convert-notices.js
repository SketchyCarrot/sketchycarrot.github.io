// Script to convert notices.txt to notices.json
// This script should be run whenever notices.txt is updated
// Format: DATE|TITLE|CONTENT (one notice per line)

function convertNoticesTxtToJson(txtContent) {
    const lines = txtContent.split('\n').filter(line => line.trim() !== '');
    const notices = [];
    
    lines.forEach((line, index) => {
        const parts = line.split('|');
        if (parts.length >= 3) {
            const date = parts[0].trim();
            const title = parts[1].trim();
            const content = parts.slice(2).join('|').trim(); // In case content has | characters
            
            notices.push({
                id: `notice${index + 1}`,
                title: title,
                content: content,
                date: date
            });
        }
    });
    
    return { notices: notices };
}

// For Node.js usage (if running via Node.js)
if (typeof module !== 'undefined' && module.exports) {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const txtPath = path.join(__dirname, '../data/notices.txt');
        const jsonPath = path.join(__dirname, '../data/notices.json');
        
        const txtContent = fs.readFileSync(txtPath, 'utf8');
        const jsonData = convertNoticesTxtToJson(txtContent);
        
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        console.log('Successfully converted notices.txt to notices.json');
    } catch (error) {
        console.error('Error converting notices:', error);
    }
    
    module.exports = { convertNoticesTxtToJson };
}

// For browser usage - will be called from notices.js
window.convertNoticesTxtToJson = convertNoticesTxtToJson;

