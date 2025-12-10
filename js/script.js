document.addEventListener('DOMContentLoaded', () => {
    const mockData = window.mockData; // Ensure access to global data

    // --- Language State ---
    const langOpts = document.querySelectorAll('.lang-opt');

    // Bind Click Events
    langOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.getAttribute('data-lang');
            setLanguage(lang);
            // Save preference
            localStorage.setItem('redrecon_lang', lang);
        });
    });

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;

        // Update UI Flags
        langOpts.forEach(o => {
            o.classList.remove('active');
            o.style.opacity = '0.4';
        });
        const activeBtn = document.querySelector(`.lang-opt[data-lang="${lang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.opacity = '1.0';
        }

        // Update Text Elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update specific dynamic elements if idle
        // Check if elements exist before accessing
        if (typeof statusInd !== 'undefined' && statusInd && !isSimulationRunning && statusInd.textContent !== "COMPLETED") {
            // statusInd.textContent = translations[lang]['status_idle'] || "IDLE";
        }

        // Update Blog Links
        updateBlogLinks(lang);
    }

    function updateBlogLinks(lang) {
        // Map of base filenames to specific link classes
        const blogMap = {
            'ad-rts-review': 'item-link-ad-rts-review',
            'red-team-recon': 'item-link-red-team-recon',
            'kerberoasting-attack': 'item-link-kerberoasting-attack',
            'cyber-intelligence-report-2025': 'item-link-cyber-intelligence-report-2025',
            'web-exploitation-journey': 'item-link-web-exploitation-journey',
            'supabase-security': 'item-link-supabase-security',
            'ad-red-team-essentials': 'item-link-ad-red-team-essentials'
        };

        for (const [baseName, className] of Object.entries(blogMap)) {
            const el = document.querySelector(`.${className}`);
            if (el) {
                // If EN, verify if we are in root or blog dir. Assuming we are in root/blog.html
                // The current links are 'blog/filename.html'.
                // EN links should be 'blog/en/filename.html'.
                if (lang === 'en') {
                    el.setAttribute('href', `blog/en/${baseName}.html`);
                } else {
                    el.setAttribute('href', `blog/${baseName}.html`);
                }
            }
        }
    }

    // --- Config & State ---
    let MODE_SPEED = 50; // ms
    let isTermVisible = true;
    let isSimulationRunning = false;
    let currentLang = 'pt'; // Changed default to PT as requested
    let logIndex = 0;
    let proxyIndex = 0;

    // Advanced Metrics State
    let activeThreads = 0;
    let falsePositives = 0;
    let productivityHours = 0;
    let errorsSimulated = 0;

    // --- Elements ---
    const terminal = document.getElementById('terminal');
    const proxyDisplay = document.getElementById('proxy-display');
    const proxyMapText = document.getElementById('proxy-map-text');

    // Metrics
    const timeVal = document.getElementById('time-val');
    const threadCount = document.getElementById('thread-count');
    const fpsCounter = document.getElementById('fps-counter');
    const productivityVal = document.getElementById('productivity-val');
    const vulnList = document.getElementById('vuln-list');
    const statusInd = document.getElementById('status-ind');

    // Controls
    const btnRun = document.getElementById('btn-run');
    const btnCopy = document.getElementById('btn-copy');
    const cmdInput = document.getElementById('cmd-input');

    const themeBtn = document.getElementById('theme-toggle');
    const speedBtn = document.getElementById('speed-toggle');

    // --- Data ---
    const geoLocations = [
        "US (Ashburn)", "DE (Frankfurt)", "BR (São Paulo)", "SG (Singapore)", "JP (Tokyo)", "UK (London)"
    ];

    // --- Simulation Logic ---

    function startSimulation() {
        if (isSimulationRunning) return;
        isSimulationRunning = true;

        if (statusInd) {
            statusInd.textContent = currentLang === 'pt' ? "INICIALIZANDO" : "INITIALIZING";
            statusInd.style.color = "yellow";
        }

        // Clear previous run
        if (terminal) terminal.innerHTML = "";
        if (vulnList) vulnList.innerHTML = "";
        logIndex = 0;
        errorsSimulated = 0;

        // Initial delay for realism
        setTimeout(() => {
            if (statusInd) {
                statusInd.textContent = currentLang === 'pt' ? "EM EXECUÇÃO" : (currentLang === 'es' ? "EJECUTANDO" : (currentLang === 'de' ? "LÄUFT" : "RUNNING"));
                statusInd.style.color = "var(--primary-green)";
            }
            if (terminal && proxyDisplay) {
                runTerminalLoop();
                runProxyLoop();
                runMetricsLoop();
            }
        }, 800);
    }

    function runTerminalLoop() {
        if (!isSimulationRunning) return;

        if (logIndex < mockData.logs.length) {
            // Chance to simulate error
            if (Math.random() > 0.95 && errorsSimulated < 2) {
                simulateError();
                return;
            }

            if (terminal) {
                const line = document.createElement('div');
                line.className = 'log-line';
                line.innerHTML = `> ${highlightKeywords(mockData.logs[logIndex])}`;
                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;
            }

            logIndex++;
            setTimeout(runTerminalLoop, MODE_SPEED);
        } else {
            finalizeResults();
        }
    }

    function simulateError() {
        errorsSimulated++;
        if (terminal) {
            const errLine = document.createElement('div');
            errLine.className = 'log-line';
            const msg = currentLang === 'pt' ? "Tempo Limite de Conexão (10.10.20.5:8080) - Tentando novo Proxy..." :
                (currentLang === 'es' ? "Tiempo de Espera (10.10.20.5:8080) - Reintentando Proxy..." : "Connection Timed Out (10.10.20.5:8080) - Retrying with Proxy Pool...");

            errLine.innerHTML = `> <span style="color:red">[ERR] ${msg}</span>`;
            terminal.appendChild(errLine);
            terminal.scrollTop = terminal.scrollHeight;
        }

        setTimeout(() => {
            if (terminal) {
                const recoverLine = document.createElement('div');
                recoverLine.className = 'log-line';
                const msgRec = currentLang === 'pt' ? "Tentativa com Sucesso. Retomando stack." : "Retry Successful. Resuming stack.";
                recoverLine.innerHTML = `> <span style="color:gray">[INF] ${msgRec}</span>`;
                terminal.appendChild(recoverLine);
            }
            runTerminalLoop();
        }, MODE_SPEED * 3);
    }

    function highlightKeywords(text) {
        return text
            .replace(/\[CMD\]/g, '<span style="color:cyan; font-weight:bold;">[CMD]</span>')
            .replace(/\[INF\]/g, '<span style="color:gray">[INF]</span>')
            .replace(/\[NMAP\]/g, '<span style="color:orange">[NMAP]</span>')
            .replace(/\[high\]/i, '<span style="color: #ff3333; font-weight:bold;">[ALTA]</span>');
    }

    function runProxyLoop() {
        if (!isSimulationRunning) return;

        const proxy = mockData.proxies[proxyIndex];
        const geo = geoLocations[Math.floor(Math.random() * geoLocations.length)];

        if (proxyDisplay) proxyDisplay.textContent = `ROUTE >> ${proxy}`;
        const originTxt = currentLang === 'pt' ? "origem" : "origin";
        const routeTxt = currentLang === 'pt' ? "roteando via" : "routing via";
        if (proxyMapText) proxyMapText.textContent = `${originTxt}: [ANONYMOUS] -> ${routeTxt}: [${geo}]`;

        proxyIndex = (proxyIndex + 1) % mockData.proxies.length;
        activeThreads = Math.floor(Math.random() * (50 - 20) + 20);

        setTimeout(runProxyLoop, 200);
    }

    function runMetricsLoop() {
        if (!isSimulationRunning) return;

        const progress = logIndex / mockData.logs.length;
        const currentDuration = progress * (mockData.logs.length * (MODE_SPEED / 1000));

        if (timeVal) timeVal.textContent = currentDuration.toFixed(2) + 's';
        if (threadCount) threadCount.textContent = activeThreads + "/50";
        if (fpsCounter) fpsCounter.textContent = "0";

        const savedHours = (currentDuration * 120).toFixed(1);
        if (productivityVal) productivityVal.textContent = savedHours + "h";

        setTimeout(runMetricsLoop, 100);
    }

    function finalizeResults() {
        isSimulationRunning = false;
        if (statusInd) {
            statusInd.textContent = currentLang === 'pt' ? "CONCLUÍDO" : "COMPLETED";
            statusInd.style.color = "cyan";
        }

        if (terminal) {
            const msgDone = currentLang === 'pt' ? "[SUCESSO] PIPELINE COMPLETO" : "[SUCCESS] PIPELINE COMPLETE";
            const doneLine = document.createElement('div');
            doneLine.innerHTML = `> <span style='color:var(--primary-green)'>${msgDone}</span>`;
            terminal.appendChild(doneLine);
        }

        activeThreads = 0;
        if (threadCount) threadCount.textContent = "0/50";

        if (vulnList) {
            mockData.vulnerabilities.forEach(v => {
                const li = document.createElement('li');
                li.style.padding = "8px 0";
                li.style.borderBottom = "1px solid var(--dim-color)";
                li.innerHTML = `
                    <div style="display:flex; justify-content:space-between; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'">
                        <span><strong>[${v.severity}]</strong> ${v.name}</span>
                        <span style="font-size:0.8rem">▼</span>
                    </div>
                    <div style="display:none; font-size:0.8rem; color:#888; padding: 5px 0 0 10px; border-left: 2px solid var(--primary-green); margin-top:5px;">
                        <strong>Fix:</strong> ${v.fix || "Check report"} <br>
                        <strong>WAF Rule:</strong> <code>Block args containing 'UNION SELECT'</code>
                    </div>
                `;
                vulnList.appendChild(li);
            });
        }
    }

    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        const footer = document.querySelector('footer');
        if (footer) {
            const perfBadge = document.createElement('div');
            perfBadge.style.fontSize = "0.7rem";
            perfBadge.style.marginTop = "10px";
            perfBadge.style.color = "#555";
            perfBadge.innerHTML = `⚡ Load Time: ${loadTime}ms | CI/CD: <span style="color:var(--primary-green)">PASSING</span> | Hosted: <span style="color:white">GitHub Pages</span>`;
            footer.appendChild(perfBadge);
        }
    });

    const glossaryLink = document.getElementById('glossary-link');
    const glossaryModal = document.getElementById('glossary-modal');

    if (glossaryLink && glossaryModal) {
        glossaryLink.addEventListener('click', (e) => {
            e.preventDefault();
            glossaryModal.style.display = 'block';
        });
    }

    function animateTraceroute() {
        const hops = [".", "..", "10.0.0.1", "192.168.1.1", "172.16.0.5", "TARGET"];
        const el = document.getElementById('trace-hops');
        if (!el) return;
        let i = 0;
        setInterval(() => {
            el.textContent = hops.slice(0, i + 1).join(" -> ");
            i = (i + 1) % hops.length;
        }, 800);
    }
    animateTraceroute();

    // --- Interactive Handlers ---
    const chartToggle = document.getElementById('chart-toggle');
    const chartContainer = document.getElementById('vuln-chart-container');
    const btnImportProfile = document.getElementById('btn-import-profile');
    const skillsContainer = document.getElementById('skills-container');
    const techTableWrapper = document.getElementById('tech-table-wrapper');

    if (btnImportProfile && techTableWrapper && skillsContainer) {
        btnImportProfile.addEventListener('click', () => {
            btnImportProfile.textContent = currentLang === 'pt' ? "[CARREGANDO...]" : "[LOADING...]";
            techTableWrapper.style.opacity = "0.3";

            setTimeout(() => {
                techTableWrapper.style.display = 'none';
                skillsContainer.style.display = 'block';
                btnImportProfile.textContent = currentLang === 'pt' ? "[PERFIL CARREGADO]" : "[PROFILE LOADED]";
                btnImportProfile.disabled = true;
                // Render skills logic here...
            }, 1000);
        });
    }

    function renderChart() {
        if (!chartContainer) return;
        const data = window.mockData || mockData; // Fallback
        if (!data || !data.vulnerabilities) return;

        let high = 0, med = 0, low = 0;
        data.vulnerabilities.forEach(v => {
            if (v.severity === "High" || v.severity === "Critical") high++;
            else if (v.severity === "Medium") med++;
            else low++;
        });

        const total = high + med + low;
        const highDeg = (total === 0) ? 0 : (high / total) * 360;
        const medDeg = (total === 0) ? 0 : (med / total) * 360;

        chartContainer.innerHTML = `
            <div style="
                width: 140px; 
                height: 140px; 
                border-radius: 50%; 
                background: conic-gradient(
                    var(--neon-red) 0deg ${highDeg}deg, 
                    orange ${highDeg}deg ${highDeg + medDeg}deg, 
                    #444 ${highDeg + medDeg}deg 360deg
                );
                margin: 5px auto;
                position: relative;
                box-shadow: 0 0 15px rgba(255, 42, 42, 0.2);
            ">
                <div style="
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    transform: translate(-50%, -50%); 
                    width: 100px;
                    height: 100px;
                    background: var(--bg-panel);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                ">
                   <div style="font-size:0.7rem; color:#888;">RISK SCORE</div>
                   <div style="font-size:1.2rem; font-weight:bold; color:var(--text-primary);">${data.vulnerabilities.length}</div>
                </div>
            </div>
            <div style="text-align:center; font-size: 0.8rem; margin-top:10px;">
                <span style="color:var(--neon-red); margin-right:5px;">● High (${high})</span> 
                <span style="color:orange; margin-right:5px;">● Med (${med})</span> 
                <span style="color:#666;">● Low (${low})</span>
            </div>
        `;
    }

    if (chartToggle && chartContainer) {
        chartToggle.addEventListener('click', () => {
            if (chartContainer.style.display === 'none') {
                chartContainer.style.display = 'block';
                if (translations[currentLang]) chartToggle.textContent = translations[currentLang]['hide_chart'];
                renderChart();
            } else {
                chartContainer.style.display = 'none';
                if (translations[currentLang]) chartToggle.textContent = translations[currentLang]['view_chart'];
            }
        });
    }

    if (btnRun) {
        btnRun.addEventListener('click', () => {
            if (!isSimulationRunning) startSimulation();
        });
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(cmdInput.value);
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "✅";
            setTimeout(() => btnCopy.textContent = originalText, 1500);
        });
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('professional-mode');
            document.body.classList.toggle('hacker-mode');
            const isPro = document.body.classList.contains('professional-mode');
            themeBtn.textContent = isPro ? "MODO_PROFISSIONAL" : "MODO_HACKER";
            if (isPro) themeBtn.classList.add('active'); else themeBtn.classList.remove('active');
        });
    }

    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            if (MODE_SPEED === 50) {
                MODE_SPEED = 600;
                if (translations[currentLang]) speedBtn.textContent = translations[currentLang]['lbl_speed'] + " 30s";
            } else {
                MODE_SPEED = 50;
                if (translations[currentLang]) speedBtn.textContent = translations[currentLang]['lbl_speed'] + " (5s)";
            }
            speedBtn.classList.toggle('active');
        });
    }

    // Initialize Language (Default to PT)
    const savedLang = localStorage.getItem('redrecon_lang') || 'pt';
    setLanguage(savedLang);

});
