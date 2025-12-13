// Gerenciador de Dispositivos
class DeviceManager {
    constructor() {
        this.devices = [];
        this.modal = document.querySelector('.device-modal');
        this.backdrop = document.querySelector('.modal-backdrop');
        this.deviceGrid = document.getElementById('devicesGrid');
        this.searchInput = document.querySelector('.device-search input');
        this.filterButtons = document.querySelectorAll('.device-filters .device-btn');
        this.currentFilter = 'all';

        this.initialize();
    }

    initialize() {
        // Carregar dispositivos salvos ou criar exemplos
        this.loadDevices();
        
        // Setup de eventos
        this.setupEventListeners();
        
        // Iniciar simulação de status
        this.startStatusSimulation();
    }

    setupEventListeners() {
        // Adicionar dispositivo
        document.getElementById('addDeviceBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('cancelDeviceBtn')?.addEventListener('click', () => this.closeModal());
        
        // Form submit
        document.getElementById('deviceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDeviceSubmit();
        });

        // Busca
        this.searchInput?.addEventListener('input', () => this.filterDevices());
        
        // Filtros
        this.filterButtons?.forEach(btn => {
            if (btn.id !== 'addDeviceBtn') {
                btn.addEventListener('click', () => {
                    this.currentFilter = btn.dataset.filter;
                    this.updateFilterButtons();
                    this.filterDevices();
                });
            }
        });

        // Fechar modal no backdrop
        this.backdrop?.addEventListener('click', () => this.closeModal());
    }

    async loadDevices() {
        try {
            const response = await fetch('devicesGet.php');
            if (!response.ok) throw new Error('Erro ao carregar dispositivos');

                this.devices = await response.json();
        } catch (e) {
            // fallback se der erro: usa os exemplos locais
            this.devices = [
            { id: 1, name: 'Câmera Principal', type: 'camera', location: 'Entrada', status: 'online', batteryLevel: 100, lastUpdate: new Date() },
            { id: 2, name: 'Sensor de Movimento', type: 'sensor', location: 'Jardim', status: 'online', batteryLevel: 85, lastUpdate: new Date() },
            { id: 3, name: 'Fechadura Inteligente', type: 'lock', location: 'Porta da Frente', status: 'warning', batteryLevel: 15, lastUpdate: new Date() }
            ];
        }
        //mantém localstorage
        this.saveDevices();       
        this.renderDevices();
    }

    createDeviceElement(device) {
        const div = document.createElement('div');
        div.className = 'device-card';
        div.dataset.id = device.id;
        div.dataset.status = device.status;

        const icon = this.getDeviceIcon(device.type);
        const statusText = this.getStatusText(device.status);

        div.innerHTML = `
            <div class="device-header">
                <div class="device-icon">${icon}</div>
                <div class="device-status status-${device.status}">
                    <span class="status-indicator"></span>
                    ${statusText}
                </div>
            </div>
            <div class="device-info">
                <div class="device-name">${device.name}</div>
                <div class="device-location">${device.location}</div>
            </div>
            <div class="device-details">
                <div class="detail-item">
                    <span>🔋 Bateria:</span>
                    <span>${device.batteryLevel}%</span>
                </div>
                <div class="detail-item">
                    <span>🕒 Última atualização:</span>
                    <span>${this.formatTimestamp(device.lastUpdate)}</span>
                </div>
            </div>
            <div class="device-actions">
                <button class="device-btn" onclick="deviceManager.toggleDevice(${device.id})">
                    ${device.status === 'online' ? 'Desativar' : 'Ativar'}
                </button>
                <button class="device-btn primary" onclick="deviceManager.viewDevice(${device.id})">
                    Visualizar
                </button>
                <button class="device-btn danger" onclick="deviceManager.removeDevice(${device.id})">
            Remover
        </button>
            </div>
        `;

        return div;
    }

    renderDevices() {
        if (!this.deviceGrid) return;
        
        this.deviceGrid.innerHTML = '';
        this.devices.forEach(device => {
            this.deviceGrid.appendChild(this.createDeviceElement(device));
        });
        
        // Setup system control buttons
        const systemBtn = document.querySelector('.btn-system');
        const emergencyBtn = document.querySelector('.btn-emergency');
        
        if (systemBtn) {
            systemBtn.addEventListener('click', () => this.toggleSystem());
        }
        
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.triggerEmergency());
        }
    }
    
    toggleSystem() {
        const systemBtn = document.querySelector('.btn-system');
        const isActive = systemBtn.classList.contains('active');
        
        if (isActive) {
            systemBtn.classList.remove('active');
            systemBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Ativar Sistema';
            this.showNotification('Sistema desativado', 'warning');
        } else {
            systemBtn.classList.add('active');
            systemBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Desativar Sistema';
            this.showNotification('Sistema ativado com sucesso', 'success');
        }
    }
    
    triggerEmergency() {
        const emergencyBtn = document.querySelector('.btn-emergency');
        emergencyBtn.classList.add('active');
        
        // Show emergency notification
        this.showNotification('EMERGÊNCIA ACIONADA! Autoridades foram notificadas.', 'error');
        
        // Flash effect
        let flashCount = 0;
        const flash = setInterval(() => {
            document.body.classList.toggle('emergency');
            flashCount++;
            
            if (flashCount >= 10) {
                clearInterval(flash);
                document.body.classList.remove('emergency');
                emergencyBtn.classList.remove('active');
            }
        }, 500);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    filterDevices() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const cards = this.deviceGrid?.querySelectorAll('.device-card') || [];

        cards.forEach(card => {
            const device = this.devices.find(d => d.id.toString() === card.dataset.id);
            if (!device) return;

            const matchesSearch = device.name.toLowerCase().includes(searchTerm) ||
                                device.location.toLowerCase().includes(searchTerm);
            const matchesFilter = this.currentFilter === 'all' || device.status === this.currentFilter;

            card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }

    updateFilterButtons() {
        this.filterButtons?.forEach(btn => {
            if (btn.id !== 'addDeviceBtn') {
                btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
            }
        });
    }

    openModal() {
        this.modal?.classList.add('active');
        this.backdrop?.classList.add('active');
    }

    closeModal() {
        this.modal?.classList.remove('active');
        this.backdrop?.classList.remove('active');
        document.getElementById('deviceForm')?.reset();
    }

    async handleDeviceSubmit() {
        const form = document.getElementById('deviceForm');
        if (!form) return;

        const newDevice = {
            id: Date.now(),
            name: form.deviceName.value,
            type: form.deviceType.value,
            location: form.deviceLocation.value,
            status: 'online',
            batteryLevel: 100,
            lastUpdate: new Date().toISOString()
        };

        try{
            const response = await fetch('devicesSave.php',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newDevice)
            });
            const result = await response.json();
            if (!response.ok || !result.success){
                throw new Error(result.message || 'Erro ao salvar dispositivo');
            }
            this.devices.push(newDevice);
            this.saveDevices();
            this.renderDevices();
            this.closeModal();
        } catch(e){
            alert(e.message);
        }
        }   

    toggleDevice(id) {
        const device = this.devices.find(d => d.id === id);
        if (!device) return;

        device.status = device.status === 'online' ? 'offline' : 'online';
        device.lastUpdate = new Date();
        
        this.saveDevices();
        this.renderDevices();
    }

    viewDevice(id) {
        const device = this.devices.find(d => d.id === id);
        if (!device) return;
        
        // Aqui você pode implementar uma visualização detalhada do dispositivo
        // Por exemplo, abrir um modal com stream de câmera ou gráficos de sensor
        alert(`Visualizando ${device.name}\nEm breve: stream ao vivo e dados detalhados`);
    }

    async removeDevice(id) {
    const device = this.devices.find(d => d.id === id);
    const name = device ? device.name : 'este dispositivo';

    const ok = confirm(`Deseja realmente remover ${name}?`);
    if (!ok) return;

    try {
        const response = await fetch('devicesDelete.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Erro ao remover dispositivo');
        }

        // Atualiza lista local e UI
        this.devices = this.devices.filter(d => d.id !== id);
        this.saveDevices();
        this.renderDevices();

        alert('Dispositivo removido com sucesso.');
    } catch (e) {
        alert(e.message);
    }
}

    startStatusSimulation() {
        // Simular mudanças de status e bateria
        setInterval(() => {
            this.devices.forEach(device => {
                // 5% de chance de mudar o status
                if (Math.random() < 0.05) {
                    const statuses = ['online', 'warning', 'offline'];
                    const currentIndex = statuses.indexOf(device.status);
                    const newIndex = (currentIndex + 1) % statuses.length;
                    device.status = statuses[newIndex];
                    device.lastUpdate = new Date();
                }

                // Diminuir bateria gradualmente
                if (device.batteryLevel > 0 && Math.random() < 0.1) {
                    device.batteryLevel = Math.max(0, device.batteryLevel - 1);
                }
            });

            this.saveDevices();
            this.renderDevices();
        }, 5000); // Verificar a cada 5 segundos
    }

    saveDevices() {
        localStorage.setItem('devices', JSON.stringify(this.devices));
    }

    getDeviceIcon(type) {
        const icons = {
            camera: '📹',
            sensor: '🔍',
            lock: '🔒',
            alarm: '🚨'
        };
        return icons[type] || '📱';
    }

    getStatusText(status) {
        const texts = {
            online: 'Online',
            offline: 'Offline',
            warning: 'Atenção'
        };
        return texts[status] || status;
    }

    formatTimestamp(date) {
        if (typeof date === 'string') date = new Date(date);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.deviceManager = new DeviceManager();
});