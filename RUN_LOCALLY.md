# How to Run This Website Locally

## Option 1: Using Python (Recommended - Easiest)

Since you have Python installed, this is the simplest method:

1. Open a terminal/command prompt in this project directory
2. Run one of these commands:

   **For Python 3.x:**
   ```bash
   python -m http.server 8000
   ```
   
   **Or if that doesn't work:**
   ```bash
   python -m http.server
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

4. Navigate to:
   - `http://localhost:8000/index.html` for the home page
   - `http://localhost:8000/results-central.html` for Central Panel results
   - `http://localhost:8000/results-councillor.html` for Councillor results

5. To stop the server, press `Ctrl+C` in the terminal

---

## Option 2: Using Node.js (if you have it installed)

1. Install http-server globally (one time only):
   ```bash
   npm install -g http-server
   ```

2. Run the server:
   ```bash
   http-server -p 8000
   ```

3. Open `http://localhost:8000` in your browser

---

## Option 3: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The website will open automatically in your browser

---

## Option 4: Direct File Opening (May Not Work)

You can try opening `index.html` directly in your browser, but this might not work properly due to CORS restrictions when fetching the JSON file. The local server methods above are recommended.

---

## Testing Tips

- Check the browser console (F12) for any errors
- Test on both Central Panel and Councillor pages
- Try resizing the browser to test mobile responsiveness
- Verify that the vote counts are displayed correctly in tabular format
- The data should refresh automatically every 60 seconds

