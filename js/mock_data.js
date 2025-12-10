window.mockData = {
    logs: [
        "[CMD] redrecon --full --target target-corp.com",
        "[INF] Iniciando Pipeline RedRecon v2.4",
        "[INF] Alvo resolvido: 192.168.1.15 (target-corp.com)",
        "[INF] Carregando cluster de proxies (50 nós ativos)",
        "[NMAP] Iniciando Varredura de Portas (Top 1000)...",
        "[INF] Proxy rotacionado: 104.22.15.1 (US-East)",
        "[NMAP] Descobertas: Portas Abertas 80, 443, 8080, 22",
        "[INF] Enumeração de Serviços em execução...",
        "[INF] Coletando headers HTTP e tecnologias",
        "[NMAP] Detectado: nginx/1.18.0 (Ubuntu) na porta 80",
        "[INF] Detectado: Apache Tomcat/9.0.30 na porta 8080",
        "[CMD] Iniciando Varredura de Vulnerabilidades (Nuclei)",
        "[INF] Carregando 1500 templates (CVEs, Exposições, Configs)",
        "[INF] Testando Bypass de WAF para endpoints críticos",
        "[INF] Matriz de Risco atualizada: Calculando vetores",
        "[INF] Encadeando vulnerabilidades encontradas (Lógica de Grafo)",
        "[INF] Detectado log exposto em /var/log/app.log",
        "[high] ALERTA: Credenciais encontradas em log público",
        "[INF] Tentando autenticação no Tomcat Manager com credenciais",
        "[high] CRÍTICO: Tomcat Manager Acesso (admin/s3cr3t) - SUCESSO",
        "[CMD] Gerando Relatório Executivo (LaTeX/PDF)..."
    ],
    proxies: [
        "104.28.2.14:8080",
        "192.0.2.1:3128",
        "203.0.113.4:1080",
        "198.51.100.12:8000",
        "45.33.22.11:8888",
        "185.74.21.9:9050",
        "66.249.64.0:80"
    ],
    // --- Mock Vulnerability Data (Chained) ---
    vulnerabilities: [
        {
            name: "Information Leakage (.git/logs)",
            severity: "Low",
            count: 1,
            desc: "Non-critical log file exposed credentials.",
        },
        {
            name: "Outdated Internal Service (Port 3128)",
            severity: "Medium",
            count: 1,
            desc: "Service running EOS version (Squid 3.x).",
            fix: "Patch/Upgrade."
        },
        {
            name: "Unauthorized Access (Chain)",
            severity: "High",
            count: 1,
            desc: "Admin access gained via Leaked Creds + Old Service.",
            fix: "Rotate Creds & Enforce MFA."
        }
    ],
    stats: {
        totalTime: "0.087s",
        proxiesRotated: 12,
        vulnsFound: 21
    }
};

// Export for use if needed in a module system, but also valid as global for simple script inclusion
if (typeof module !== 'undefined') {
    module.exports = mockData;
}
