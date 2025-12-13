// Gerenciador do Dashboard
class DashboardManager {
    constructor() {
        // Elementos do DOM
        this.systemStatus = document.querySelector('.system-status');
        this.deviceStats = document.querySelector('.device-stats');
        this.mainCamera = document.getElementById('mainCameraFeed');
        this.activityChart = document.getElementById('activityChart');
        this.weatherInfo = document.querySelector('.weather-info');
        this.statusToast = document.getElementById('statusToast');
        
        // Estado do sistema
        this.systemArmed = true;
        this.deviceCount = {
            total: 12,
            active: 10,
            alerts: 2
        };
        
        this.initialize();
    }
    
    initialize() {
        // Inicializar todos os componentes
        this.setupEventListeners();
        this.initializeChart();
        this.startDeviceSimulation();
        this.updateWeather();
        this.setupCameraControls();
    }
    
    setupEventListeners() {
        // Botão de ativar/desativar sistema
        document.getElementById('armSystem')?.addEventListener('click', () => {
            this.toggleSystem();
        });
        
        // Botão de emergência
        document.getElementById('emergency')?.addEventListener('click', () => {
            this.triggerEmergency();
        });
        
        // Controles rápidos
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.querySelector('span').textContent;
                this.handleQuickControl(action);
            });
        });
        
        // Controles da câmera
        document.querySelectorAll('.camera-controls button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('aria-label');
                this.handleCameraControl(action);
            });
        });
    }
    
    initializeChart() {
        // Configurar gráfico de atividade usando Chart.js
        const ctx = this.activityChart.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Eventos',
                    data: [4, 2, 8, 15, 12, 6],
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--accent').trim(),
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    startDeviceSimulation() {
        // Simular atualizações de dispositivos
        setInterval(() => {
            // Atualizar contadores aleatoriamente
            this.deviceCount.active = 8 + Math.floor(Math.random() * 3);
            this.deviceCount.alerts = Math.floor(Math.random() * 3);
            
            // Atualizar UI
            this.updateDeviceStats();
            
            // 10% de chance de gerar um alerta
            if (Math.random() < 0.1) {
                this.generateRandomAlert();
            }
        }, 30000); // A cada 30 segundos
        
        // Simular stream da câmera
        this.simulateCameraFeed();
    }
    
    updateDeviceStats() {
        // Atualizar contadores na UI
        const stats = this.deviceStats.querySelectorAll('.stat-value');
        stats[0].textContent = this.deviceCount.total;
        stats[1].textContent = this.deviceCount.active;
        stats[2].textContent = this.deviceCount.alerts;
    }
    
    generateRandomAlert() {
        const alerts = [
            'Movimento detectado - Câmera Frontal',
            'Porta dos fundos aberta',
            'Sensor de fumaça ativado',
            'Bateria baixa - Sensor 4',
            'Conexão perdida - Câmera 2'
        ];
        
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        this.showNotification(alert);
        
        // Adicionar ao histórico de alertas
        const recentAlerts = document.querySelector('.recent-alerts');
        const alertItem = document.createElement('li');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div class="alert-info">
                <strong>${alert}</strong>
                <span>Agora mesmo</span>
            </div>
        `;
        
        recentAlerts.insertBefore(alertItem, recentAlerts.firstChild);
        
        // Manter apenas os 5 alertas mais recentes
        if (recentAlerts.children.length > 5) {
            recentAlerts.removeChild(recentAlerts.lastChild);
        }
    }
    
    simulateCameraFeed() {
        // Simular atualizações da câmera a cada 5 segundos
        setInterval(() => {
            // Adicionar um timestamp à URL da imagem para forçar atualização
            const timestamp = new Date().getTime();
            this.mainCamera.src = `imagens/camera-preview.jpg?t=${timestamp}`;
        }, 5000);
    }
    
    updateWeather() {
        // Simular atualização do clima
        const conditions = [
            { icon: 'sun', temp: '24°C', text: 'Ensolarado' },
            { icon: 'cloud', temp: '20°C', text: 'Nublado' },
            { icon: 'cloud-rain', temp: '18°C', text: 'Chuva' }
        ];
        
        setInterval(() => {
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            this.weatherInfo.innerHTML = `
                <i class="fas fa-${condition.icon}"></i>
                <div class="weather-details">
                    <span class="temperature">${condition.temp}</span>
                    <span class="condition">${condition.text}</span>
                </div>
            `;
        }, 300000); // A cada 5 minutos
    }
    
    toggleSystem() {
        this.systemArmed = !this.systemArmed;
        const status = this.systemArmed ? 'ativado' : 'desativado';
        const icon = this.systemArmed ? 'check-circle' : 'times-circle';
        const color = this.systemArmed ? 'var(--device-online)' : 'var(--alert-critical)';
        
        this.systemStatus.innerHTML = `
            <i class="fas fa-${icon}"></i>
            Sistema ${status}
        `;
        this.systemStatus.style.color = color;
        
        this.showNotification(`Sistema de segurança ${status}`);
    }
    
    triggerEmergency() {
        this.showNotification('Modo de emergência ativado! Autoridades notificadas.', true);
        
        // Ativar efeito visual de emergência
        document.body.classList.add('emergency');
        setTimeout(() => document.body.classList.remove('emergency'), 5000);
    }
    
    handleQuickControl(action) {
        // Simular ação dos controles rápidos
        this.showNotification(`${action} ${Math.random() > 0.5 ? 'ativado' : 'desativado'}`);
    }
    
    handleCameraControl(action) {
        switch(action) {
            case 'Ativar/Desativar áudio':
                this.showNotification('Áudio da câmera alternado');
                break;
            case 'Tela cheia':
                if (this.mainCamera.requestFullscreen) {
                    this.mainCamera.requestFullscreen();
                }
                break;
            case 'Tirar foto':
                this.showNotification('Foto capturada e salva');
                break;
        }
    }
    
    showNotification(message, isEmergency = false) {
        this.statusToast.textContent = message;
        this.statusToast.className = 'notification-toast show' + 
            (isEmergency ? ' emergency' : '');
        
        // Esconder após 5 segundos
        setTimeout(() => {
            this.statusToast.classList.remove('show', 'emergency');
        }, 5000);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});