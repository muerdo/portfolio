import os
import subprocess
import datetime

# --- Mock Data Generation (Humanized & Chained) ---
TARGET_NAME = "Mock-Target-Internal"
TODAY = datetime.date.today().strftime("%B %d, %Y")

VULNS = [
    {
        "name": "Information Leakage (Low Severity)",
        "severity": "LOW",
        "desc": "A 'feroxbuster.txt' log file was left accessible in the web root. While low risk on its own, it contained valid internal credentials (`dante:dantet3x`).",
        "chain": "STEP 1 (The Key): This leak provided the username/password combination needed to attack authenticated services.",
        "remediation_immediate": "Remove the log file and disable directory listing.",
        "remediation_root": "Enforce 'Clean & Clear' deployment policies."
    },
    {
        "name": "Outdated Proxy Service (Medium Severity)",
        "severity": "MEDIUM",
        "desc": "An internal Squid Proxy (Port 3128) was found running an End-of-Life version. It was accessible from the public internet.",
        "chain": "STEP 2 (The Door): This service is known to have weak authentication handling, but requires valid credentials to interact.",
        "remediation_immediate": "Restrict Port 3128 to VPN traffic only.",
        "remediation_root": "Implement automated asset inventory and patch management."
    },
    {
        "name": "Unauthorized Access (High Severity Chain)",
        "severity": "HIGH",
        "desc": "By combining the Leaked Credentials (Step 1) with the Accessible Proxy (Step 2), we achieved FULL ADMIN ACCESS to the internal network routing.",
        "chain": "<b>CHAIN COMPLETE:</b> Low + Medium = CRITICAL BREACH. This allows the attacker to tunnel traffic through your internal network.",
        "remediation_immediate": "Rotate all exposed credentials and isolate the proxy.",
        "remediation_root": "Zero Trust Architecture: Never trust internal services implicitly."
    }
]

LOG_EXTRACT = """
[INF] [WFUZZ] 200 OK - /logs/scan_results.txt
[INF] [ANALYZER] Pattern 'http://user:pass@...' matched.
[HIGH] [TRUFFLEHOG] Credential Identified: 'dante:*****'
[INF] [CHAIN] Replaying credentials against Port 3128...
[INF] [CHAIN] Auth Success. Session Established.
"""

def generate_tex():
    # Read Template
    with open('relatorio.tex', 'r') as f:
        template = f.read()

    # Generate Vuln Items LaTeX
    vuln_tex = ""
    for v in VULNS:
        color = "red" if v['severity'] in ["CRITICAL", "HIGH"] else "orange"
        vuln_tex += f"""
        \\subsection{{{v['name']}}}
        \\textbf{{Severity:}} \\textcolor{{{color}}}{{\\textbf{{{v['severity']}}}}} \\\\
        \\textbf{{Context:}} {v['desc']} \\\\
        
        \\vspace{{0.2cm}}
        \\noindent\\fcolorbox{{black}}{{lightGrey}}{{\\parbox{{\\dimexpr\\linewidth-2\\fboxsep-2\\fboxrule}}{{
            \\textbf{{Exploration Chain:}} \\\\ 
            \\textit{{{v['chain']}}}
        }}}}
        
        \\subsubsection*{{Strategic Remediation}}
        \\begin{{itemize}}
            \\item \\textbf{{Quick Fix:}} {v['remediation_immediate']}
            \\item \\textbf{{Systemic Fix:}} {v['remediation_root']}
        \\end{{itemize}}
        \\hrule
        \\vspace{{0.5cm}}
        """

    # Replace Placeholders
    content = template.replace('{{TARGET_NAME}}', TARGET_NAME)
    content = content.replace('{{TODAY}}', TODAY)
    content = content.replace('{{CRITICAL_COUNT}}', "0")
    content = content.replace('{{HIGH_COUNT}}', "1 (Chained)")
    content = content.replace('{{TOTAL_COUNT}}', str(len(VULNS)))
    content = content.replace('{{VULN_ITEMS}}', vuln_tex)
    content = content.replace('{{LOG_EXTRACT}}', LOG_EXTRACT)

    # Write Final Tex
    with open('final_report.tex', 'w') as f:
        f.write(content)

    print("[+] LaTeX generated: final_report.tex")

def compile_pdf():
    print("[*] Compiling PDF...")
    try:
        # Run pdflatex twice for TOC generation
        subprocess.run(['pdflatex', '-interaction=nonstopmode', 'final_report.tex'], check=True)
        subprocess.run(['pdflatex', '-interaction=nonstopmode', 'final_report.tex'], check=True)
        print("[+] Success: final_report.pdf generated.")
    except subprocess.CalledProcessError:
        print("[-] Error compiling PDF. Check tex logs.")
    except FileNotFoundError:
        print("[-] pdflatex not found. Skipping compilation (Normal for this environment).")

if __name__ == "__main__":
    generate_tex()
    compile_pdf()
