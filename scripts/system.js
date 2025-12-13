// Estado inicial do sistema
let systemState = {
    isArmed: false,
    lastArmed: null,
    emergencyMode: false,
    lastEmergency: null
};

// Carregar estado do sistema do localStorage
function loadSystemState() {
    const savedState = localStorage.getItem('systemState');
    if (savedState) {
        systemState = JSON.parse(savedState);
        updateSystemUI();
    }
}

// Salvar estado do sistema no localStorage
function saveSystemState() {
    localStorage.setItem('systemState', JSON.stringify(systemState));
}

// Atualizar interface do usuário
function updateSystemUI() {
    const armButton = document.getElementById('armSystem');
    const emergencyButton = document.getElementById('emergency');
    
    if (armButton) {
        armButton.classList.toggle('active', systemState.isArmed);
        armButton.innerHTML = `
            <i class="fas ${systemState.isArmed ? 'fa-shield-alt' : 'fa-shield-alt'}"></i>
            <span>${systemState.isArmed ? 'Desativar Sistema' : 'Ativar Sistema'}</span>
        `;
    }

    if (emergencyButton) {
        emergencyButton.classList.toggle('emergency', systemState.emergencyMode);
    }

    // Atualizar outros elementos da UI que mostram o status do sistema
    document.querySelectorAll('.system-status-text').forEach(el => {
        el.textContent = systemState.isArmed ? 'Sistema Ativo' : 'Sistema Inativo';
    });
}

// Alternar estado do sistema
function toggleSystem() {
    systemState.isArmed = !systemState.isArmed;
    systemState.lastArmed = systemState.isArmed ? new Date().toISOString() : null;
    
    // Mostrar notificação
    showNotification(
        systemState.isArmed ? 'Sistema ativado com sucesso' : 'Sistema desativado',
        systemState.isArmed ? 'success' : 'warning'
    );
    
    saveSystemState();
    updateSystemUI();
}

// Ativar modo de emergência
function toggleEmergency() {
    if (!systemState.emergencyMode) {
        // Confirmar antes de ativar
        if (confirm('ATENÇÃO: Você está prestes a ativar o modo de emergência. Deseja continuar?')) {
            systemState.emergencyMode = true;
            systemState.lastEmergency = new Date().toISOString();
            
            // Ativar sistema se ainda não estiver ativo
            if (!systemState.isArmed) {
                systemState.isArmed = true;
                systemState.lastArmed = new Date().toISOString();
            }
            
            showNotification('MODO DE EMERGÊNCIA ATIVADO', 'danger', 0);
            playEmergencySound();
        }
    } else {
        // Requer confirmação para desativar
        if (confirm('Deseja desativar o modo de emergência?')) {
            systemState.emergencyMode = false;
            showNotification('Modo de emergência desativado', 'success');
        }
    }
    
    saveSystemState();
    updateSystemUI();
}

// Tocar som de emergência
function playEmergencySound() {
    const audio = new Audio('sounds/emergency.mp3');
    audio.loop = true;
    audio.play().catch(err => console.log('Erro ao tocar som:', err));
}

// Mostrar notificação
function showNotification(message, type = 'success', duration = 5000) {
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadSystemState();
    
    // Adicionar event listeners aos botões
    const armButton = document.getElementById('armSystem');
    const emergencyButton = document.getElementById('emergency');
    
    if (armButton) {
        armButton.addEventListener('click', toggleSystem);
    }
    
    if (emergencyButton) {
        emergencyButton.addEventListener('click', toggleEmergency);
    }
});