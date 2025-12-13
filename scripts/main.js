// Gerenciador de UI e Temas
class UIManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupThemeToggle();
        this.setupResponsiveMenu();
        this.setupNotificationClose();
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        // Definir tema inicial
        if (savedTheme) {
            document.documentElement.dataset.theme = savedTheme;
        } else if (prefersDark) {
            document.documentElement.dataset.theme = 'dark';
        }

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.dataset.theme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            
            // Animar ícone
            themeToggle.classList.add('theme-toggle-active');
            setTimeout(() => themeToggle.classList.remove('theme-toggle-active'), 300);
        });
    }

    setupResponsiveMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav-expanded');
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav-expanded');
            }
        });

        // Suporte a teclado
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    setupNotificationClose() {
        const notificationToast = document.querySelector('#notification-toast');
        const closeBtn = notificationToast?.querySelector('.notification-close');
        
        closeBtn?.addEventListener('click', () => {
            notificationToast.classList.remove('show');
        });
    }
}

// Sistema de Notificações
class NotificationManager {
    static show(message, type = 'success', duration = 5000) {
        const toast = document.getElementById('statusToast');
        if (!toast) return;

        toast.className = `notification-toast alert alert-${type}`;
        toast.textContent = message;
        toast.style.display = 'block';

        if (duration > 0) {
            setTimeout(() => {
                toast.style.display = 'none';
            }, duration);
        }
    }
}

// Estado do Sistema
class SystemManager {
    constructor() {
        this.state = {
            isArmed: false,
            lastArmed: null,
            emergencyMode: false,
            lastEmergency: null
        };
        this.loadState();
        this.setupEventListeners();
    }

    loadState() {
        const savedState = localStorage.getItem('systemState');
        if (savedState) {
            this.state = JSON.parse(savedState);
            this.updateUI();
        }
    }

    saveState() {
        localStorage.setItem('systemState', JSON.stringify(this.state));
    }

    updateUI() {
        const armButton = document.getElementById('armSystem');
        const emergencyButton = document.getElementById('emergency');
        
        if (armButton) {
            armButton.classList.toggle('active', this.state.isArmed);
            armButton.innerHTML = `
                <i class="fas ${this.state.isArmed ? 'fa-shield-alt' : 'fa-shield-alt'}"></i>
                <span>${this.state.isArmed ? 'Desativar Sistema' : 'Ativar Sistema'}</span>
            `;
        }

        if (emergencyButton) {
            emergencyButton.classList.toggle('emergency', this.state.emergencyMode);
        }

        // Atualizar outros elementos da UI
        document.querySelectorAll('.system-status-text').forEach(el => {
            el.textContent = this.state.isArmed ? 'Sistema Ativo' : 'Sistema Inativo';
        });
    }

    toggleSystem() {
        this.state.isArmed = !this.state.isArmed;
        this.state.lastArmed = this.state.isArmed ? new Date().toISOString() : null;
        
        NotificationManager.show(
            this.state.isArmed ? 'Sistema ativado com sucesso' : 'Sistema desativado',
            this.state.isArmed ? 'success' : 'warning'
        );
        
        this.saveState();
        this.updateUI();
    }

    toggleEmergency() {
        if (!this.state.emergencyMode) {
            if (confirm('ATENÇÃO: Você está prestes a ativar o modo de emergência. Deseja continuar?')) {
                this.state.emergencyMode = true;
                this.state.lastEmergency = new Date().toISOString();
                
                if (!this.state.isArmed) {
                    this.state.isArmed = true;
                    this.state.lastArmed = new Date().toISOString();
                }
                
                NotificationManager.show('MODO DE EMERGÊNCIA ATIVADO', 'danger', 0);
                this.playEmergencySound();
            }
        } else {
            if (confirm('Deseja desativar o modo de emergência?')) {
                this.state.emergencyMode = false;
                NotificationManager.show('Modo de emergência desativado', 'success');
            }
        }
        
        this.saveState();
        this.updateUI();
    }

    playEmergencySound() {
        const audio = new Audio('sounds/emergency.mp3');
        audio.loop = true;
        audio.play().catch(err => console.log('Erro ao tocar som:', err));
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const armButton = document.getElementById('armSystem');
            const emergencyButton = document.getElementById('emergency');
            
            if (armButton) {
                armButton.addEventListener('click', () => this.toggleSystem());
            }
            
            if (emergencyButton) {
                emergencyButton.addEventListener('click', () => this.toggleEmergency());
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
    window.systemManager = new SystemManager();
});
