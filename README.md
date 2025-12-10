# RedRecon & Proxy Demo Portfolio

A high-performance, security-focused portfolio template designed to demonstrate the capabilities of the RedRecon pentest automation engine and its smart proxy rotation system.

**⚠️ DATA PRIVACY NOTICE:**  
This project is a **simulation**. All data displayed (IPs, vulnerability findings, logs) is mocked and sanitized (`target-corp.com`). No real scanning is performed by this web interface.

## Project Structure
- `index.html`: Main dashboard demonstrating the "Execution", "Proxy Rotation", and "Metrics".
- `blog.html`: Static blog for technical write-ups.
- `css/style.css`: Hacker-themed styles (Dark Mode, Neon, Monospace).
- `js/script.js`: Simulation logic handling the terminal typing effect and metric counters.
- `js/mock_data.js`: Data source for the simulation. Edit this to change the "logs" or "vulnerabilities" shown.
- `reports/`: Contains the LaTeX template and report generation script.

## Customization
1. **Mock Data**: Open `js/mock_data.js` and edit the `logs`, `proxies`, or `vulnerabilities` arrays to match the story you want to tell.
2. **Social Links**: Open `index.html` and `blog.html` to update the footer links (`[GITHUB]`, `[LINKEDIN]`) with your actual URLs.
3. **Blog Content**: Edit `blog.html` to add your actual write-ups.

## Report Generation (LaTeX)
To generate a new PDF report:
1. Ensure you have `python3` and `pdflatex` (TeXLive) installed.
2. Navigate to the `reports/` directory:
   ```bash
   cd reports
   ```
3. Run the generator:
   ```bash
   python3 generate_report.py
   ```
   This will update `sample_report.pdf` based on the data in the python script.

## Hosting
This is a static site (HTML/CSS/JS). You can host it for free on:

### GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to Settings > Pages.
3. Select `main` branch and `/` root folder.
4. It will be live at `https://your-username.github.io/repo-name`.

### Netlify / Vercel
1. Drag and drop the `portfolio-redrecon` folder onto the Netlify/Vercel dashboard.
2. It will deploy instantly.
