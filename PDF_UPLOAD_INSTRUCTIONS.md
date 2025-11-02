# PDF Upload Instructions for JNUSU Election Committee Website

## Overview
The website now supports PDF attachments for each notice. This document explains how to upload and manage PDF files for notices.

---

## Directory Structure

All PDF files should be placed in the following directory:
```
JNUSU_EC_Website/
└── data/
    └── pdfs/
        ├── presidential-debate.pdf
        ├── no-campaign-day.pdf
        ├── polling-schedule.pdf
        ├── counting-votes.pdf
        └── final-results.pdf
```

---

## How to Upload PDFs

### Method 1: Local Development (Using File Explorer)

1. **Navigate to the PDF directory:**
   - Open the project folder: `JNUSU_EC_Website`
   - Go to `data` → `pdfs` folder

2. **Add your PDF file:**
   - Copy your PDF file into the `data/pdfs/` folder
   - Make sure the filename matches what you specified in the notices data

3. **Test locally:**
   - Open `index.html` or `notices.html` in your browser
   - The PDF buttons should appear on each notice card

### Method 2: Using Git (for Website Hosting)

1. **Add PDF to the pdfs folder:**
   ```bash
   # Navigate to your project directory
   cd JNUSU_EC_Website
   
   # Copy your PDF file to the pdfs folder
   # (Replace 'your-notice.pdf' with your actual filename)
   copy C:\path\to\your-notice.pdf data\pdfs\
   ```

2. **Commit and push to repository:**
   ```bash
   git add data/pdfs/your-notice.pdf
   git commit -m "Add PDF for notice: [notice title]"
   git push origin main
   ```

3. **Your website will automatically update** (if using GitHub Pages or similar)

---

## Adding a New Notice with PDF

### Option 1: Using notices.txt (Recommended)

1. Open `data/notices.txt` in a text editor

2. Add a new line in this format:
   ```
   DATE|TITLE|CONTENT|PDF_FILENAME
   ```

   **Example:**
   ```
   2025-11-03T10:00:00Z|Voter Guidelines|All voters must bring valid ID cards.|voter-guidelines.pdf
   ```

3. Save the file

4. Upload the corresponding PDF file (`voter-guidelines.pdf`) to `data/pdfs/` folder

### Option 2: Using notices.json

1. Open `data/notices.json` in a text editor

2. Add a new notice object:
   ```json
   {
     "id": "notice6",
     "title": "Voter Guidelines",
     "content": "All voters must bring valid ID cards.",
     "date": "2025-11-03T10:00:00Z",
     "pdf": "voter-guidelines.pdf"
   }
   ```

3. Make sure to add a comma after the previous notice

4. Save the file

5. Upload the PDF file to `data/pdfs/` folder

---

## PDF Naming Conventions

### Best Practices:
- Use lowercase letters
- Replace spaces with hyphens (-)
- Keep names descriptive but concise
- Avoid special characters (only use letters, numbers, and hyphens)

### Examples:
✅ Good:
- `presidential-debate.pdf`
- `voting-schedule-2025.pdf`
- `election-results-central.pdf`

❌ Bad:
- `Presidential Debate.pdf` (has spaces)
- `Notice#1.pdf` (has special characters)
- `n1.pdf` (not descriptive)

---

## Troubleshooting

### PDF Button Not Showing
**Problem:** The PDF button doesn't appear on a notice card.

**Solutions:**
1. Check that the PDF filename in your notice data (txt or json) matches exactly with the actual file
2. Verify the PDF file exists in `data/pdfs/` folder
3. Make sure there are no extra spaces in the filename
4. Clear your browser cache and refresh the page

### PDF Download Not Working
**Problem:** Clicking the download button doesn't work.

**Solutions:**
1. Check file path - PDF should be in `data/pdfs/` folder
2. Verify filename spelling is correct (case-sensitive)
3. Make sure the file isn't corrupted - try opening it directly
4. Check browser console for errors (F12 → Console tab)

### PDF Won't Open in Browser
**Problem:** View PDF button doesn't open the PDF.

**Solutions:**
1. Ensure the PDF file is a valid PDF format
2. Some browsers may download instead of viewing - this is normal
3. Try using a different browser
4. Check if browser has PDF viewing enabled

---

## Notes Without PDF Attachments

If a notice doesn't have a PDF attachment, simply:

### In notices.txt:
Don't add the 4th field (or leave it empty):
```
2025-11-03T10:00:00Z|Important Announcement|This is a notice without PDF.
```

### In notices.json:
Don't include the `"pdf"` field:
```json
{
  "id": "notice7",
  "title": "Important Announcement",
  "content": "This is a notice without PDF.",
  "date": "2025-11-03T10:00:00Z"
}
```

The notice will display normally, just without the PDF buttons.

---

## File Size Recommendations

- **Recommended:** Keep PDF files under 5 MB for faster loading
- **Maximum:** Avoid files larger than 10 MB
- **Optimization:** Use online PDF compressors if needed:
  - https://www.ilovepdf.com/compress_pdf
  - https://smallpdf.com/compress-pdf

---

## Security Considerations

1. **Only upload official documents** - Don't upload personal or sensitive information
2. **Scan PDFs for viruses** before uploading
3. **Use descriptive names** - Makes it easier for students to identify documents
4. **Keep backup copies** of all PDFs in a separate location

---

## Quick Reference

| Action | Command/Steps |
|--------|---------------|
| Create PDF folder | Already created at `data/pdfs/` |
| Add PDF locally | Copy file to `data/pdfs/` folder |
| Add to notices.txt | `DATE\|TITLE\|CONTENT\|FILENAME.pdf` |
| Add to notices.json | Include `"pdf": "filename.pdf"` field |
| View changes | Open website in browser |
| Push to GitHub | `git add`, `git commit`, `git push` |

---

## Contact

For technical issues or questions, please contact the website administrator.

**Last Updated:** November 2, 2025

