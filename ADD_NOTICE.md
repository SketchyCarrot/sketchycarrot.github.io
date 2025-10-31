# How to Add a Notice

## Simple Method: Using Text File

To add a notice to the website, simply edit the file `data/notices.txt`.

### Format
Each notice should be on a single line with the following format:
```
DATE|TITLE|CONTENT
```

### Example
```
2025-01-20T14:30:00Z|Important Announcement|This is the content of the notice that will be displayed on the website.
```

### Date Format
The date should be in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Example: `2025-01-20T14:30:00Z` (January 20, 2025 at 2:30 PM UTC)
- You can use tools like [ISO Date Generator](https://www.iso.org/iso-8601-date-and-time-format.html) or just use the format shown

### Steps
1. Open `data/notices.txt`
2. Add a new line at the top (most recent notices appear first)
3. Follow the format: `DATE|TITLE|CONTENT`
4. Save the file
5. The website will automatically read and display the notice

### Important Notes
- Each notice should be on its own line
- Use `|` (pipe character) to separate date, title, and content
- If your content contains a `|` character, it will still work (the script handles it)
- Newest notices appear first (sorted automatically)
- Only the top 3 notices appear on the home page
- All notices appear on the notices page

### Example File
```
2025-01-20T14:30:00Z|New Notice|This is the latest notice.
2025-01-19T10:00:00Z|Previous Notice|This is an older notice.
2025-01-18T09:00:00Z|Older Notice|This is even older.
```

The notices will be automatically sorted by date (newest first) when displayed on the website.

