// Gerenciador de Alertas
class AlertManager {
    constructor() {
        this.alertsList = document.querySelector('.alerts-list');
        this.searchInput = document.querySelector('#alert-search');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.notificationToast = document.querySelector('#notification-toast');
        
        this.alerts = [];
        this.currentFilter = 'all';
        
        this.initialize();
    }
    
    initialize() {
        // Configurar listeners
        this.searchInput?.addEventListener('input', () => this.filterAlerts());
        this.filterButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.updateFilterButtons();
                this.filterAlerts();
            });
        });
        
        // Carregar alertas iniciais
        this.loadInitialAlerts();
        
        // Iniciar simulação de novos alertas
        this.startAlertSimulation();
    }
    
    loadInitialAlerts() {
        const initialAlerts = [
            {
                id: Date.now(),
                title: 'Sistema iniciado',
                message: 'Monitoramento ativo e funcionando normalmente',
                severity: 'info',
                timestamp: new Date()
            }
        ];
        
        initialAlerts.forEach(alert => this.addAlert(alert));
    }
    
    createAlertElement(alert) {
        const li = document.createElement('li');
        li.className = 'alert-card';
        li.dataset.severity = alert.severity;
        
        const icon = this.getSeverityIcon(alert.severity);
        
        li.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-meta">${this.formatTimestamp(alert.timestamp)}</div>
            </div>
            <button class="alert-dismiss" aria-label="Dispensar alerta">✕</button>
        `;
        
        li.querySelector('.alert-dismiss').addEventListener('click', () => {
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
                this.checkEmptyState();
            }, 300);
        });
        
        return li;
    }
    
    addAlert(alert) {
        const alertElement = this.createAlertElement(alert);
        this.alertsList.insertBefore(alertElement, this.alertsList.firstChild);
        this.showNotification(`Novo alerta: ${alert.title}`);
        this.alerts.push(alert);
    }
    
    filterAlerts() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        
        const alertElements = this.alertsList.querySelectorAll('.alert-card');
        alertElements.forEach(el => {
            const severity = el.dataset.severity;
            const title = el.querySelector('.alert-title').textContent.toLowerCase();
            const message = el.querySelector('.alert-message').textContent.toLowerCase();
            
            const matchesFilter = this.currentFilter === 'all' || severity === this.currentFilter;
            const matchesSearch = title.includes(searchTerm) || message.includes(searchTerm);
            
            el.style.display = matchesFilter && matchesSearch ? 'flex' : 'none';
        });
        
        this.checkEmptyState();
    }
    
    updateFilterButtons() {
        this.filterButtons?.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }
    
    checkEmptyState() {
        const visibleAlerts = Array.from(this.alertsList.children).some(el => el.style.display !== 'none');
        
        if (!this.alertsList.children.length || !visibleAlerts) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'alert-card';
            emptyMessage.dataset.severity = 'info';
            emptyMessage.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">Nenhum alerta encontrado</div>
                    <div class="alert-message">Não há alertas para exibir no momento</div>
                </div>
            `;
            this.alertsList.appendChild(emptyMessage);
        }
    }
    
    showNotification(message) {
        if (!this.notificationToast) return;
        
        const messageEl = this.notificationToast.querySelector('.notification-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        this.notificationToast.classList.add('show');
        
        setTimeout(() => {
            this.notificationToast.classList.remove('show');
        }, 5000);
    }
    
    getSeverityIcon(severity) {
        const icons = {
            critical: '🔴',
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅'
        };
        return icons[severity] || icons.info;
    }
    
    formatTimestamp(date) {
        const now = new Date();
        const diff = (now - date) / 1000; // diferença em segundos
        
        if (diff < 60) return 'Agora mesmo';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutos atrás`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} horas atrás`;
        
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    startAlertSimulation() {
        // Simular novos alertas periodicamente
        const severities = ['info', 'warning', 'critical'];
        const messages = [
            { title: 'Movimento detectado', message: 'Câmera externa identificou movimento' },
            { title: 'Porta aberta', message: 'Porta da frente foi aberta' },
            { title: 'Bateria baixa', message: 'Dispositivo com bateria abaixo de 20%' },
            { title: 'Conexão perdida', message: 'Dispositivo perdeu conexão com a rede' }
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% de chance de gerar alerta
                const severity = severities[Math.floor(Math.random() * severities.length)];
                const message = messages[Math.floor(Math.random() * messages.length)];
                
                this.addAlert({
                    id: Date.now(),
                    title: message.title,
                    message: message.message,
                    severity,
                    timestamp: new Date()
                });
            }
        }, 10000); // Verificar a cada 10 segundos
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.alertManager = new AlertManager();
});