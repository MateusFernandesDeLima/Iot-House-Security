document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.querySelector('.form-status');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const messageInput = document.getElementById('message');
    const characterCounter = document.querySelector('.character-counter');
    const MAX_MESSAGE_LENGTH = 500;

    // Sistema de notificações
    const notificationSystem = {
        container: null,
        init() {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        },
        show(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${this.getIcon(type)}"></i>
                <span>${message}</span>
            `;
            this.container.appendChild(notification);
            
            // Animação de entrada
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Remover após duração
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },
        getIcon(type) {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        }
    };
    
    // Inicializar sistema de notificações
    notificationSystem.init();

    // Sistema de Status
    function updateSystemStatus() {
        const systemStatus = document.querySelector('.system-status');
        const connectionStatus = document.querySelector('.connection-status');
        
        // Simular verificação de status
        const isSystemActive = Math.random() > 0.1;
        const isConnected = Math.random() > 0.05;
        
        systemStatus.innerHTML = `
            <i class="fas fa-shield-alt" style="color: ${isSystemActive ? 'var(--success)' : 'var(--danger)'}"></i>
            <span>Sistema ${isSystemActive ? 'Ativo' : 'Inativo'}</span>
        `;
        
        connectionStatus.innerHTML = `
            <i class="fas fa-wifi" style="color: ${isConnected ? 'var(--success)' : 'var(--danger)'}"></i>
            <span>${isConnected ? 'Conectado' : 'Desconectado'}</span>
        `;
        
        if (!isSystemActive || !isConnected) {
            notificationSystem.show(
                `Atenção: ${!isSystemActive ? 'Sistema inativo' : 'Conexão perdida'}`,
                'warning'
            );
        }
    }
    
    // Atualizar status periodicamente
    setInterval(updateSystemStatus, 30000);
    updateSystemStatus(); // Primeira execução

    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav-expanded');
        });
    }

    // Atualizar status dos cards
    function updateStatusCards() {
        const statusItems = document.querySelectorAll('.status-item');
        
        statusItems.forEach(item => {
            // Simular alterações aleatórias de status
            const random = Math.random();
            if (random > 0.9) {
                item.classList.remove('active');
                item.classList.add('warning');
                const statusValue = item.querySelector('.status-value');
                if (statusValue) {
                    if (item.querySelector('.fa-shield-alt')) {
                        statusValue.textContent = 'Atenção necessária';
                    } else if (item.querySelector('.fa-wifi')) {
                        statusValue.textContent = 'Sinal moderado';
                    } else if (item.querySelector('.fa-headset')) {
                        statusValue.textContent = 'Alto volume de chamadas';
                    }
                }
                notificationSystem.show('Status do sistema alterado', 'warning');
            } else {
                item.classList.add('active');
                item.classList.remove('warning', 'danger');
            }
        });
    }

    // Atualizar status cards a cada 45 segundos
    setInterval(updateStatusCards, 45000);
    
    // Simular tempo de resposta do suporte
    function updateSupportTime() {
        const supportStatus = document.querySelector('.status-item .fa-headset')?.closest('.status-item');
        if (supportStatus) {
            const statusValue = supportStatus.querySelector('.status-value');
            const currentHour = new Date().getHours();
            const isBusinessHours = currentHour >= 9 && currentHour < 18;
            
            if (isBusinessHours) {
                statusValue.textContent = 'Tempo médio de resposta: 5 min';
            } else {
                statusValue.textContent = 'Tempo médio de resposta: 15 min';
            }
        }
    }

    // Atualizar tempo de resposta a cada minuto
    setInterval(updateSupportTime, 60000);
    updateSupportTime();

    // SVG icons object
    const icons = {
        email: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
        </svg>`,
        phone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"/>
        </svg>`,
        phone2: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"/>
        </svg>`,
        location: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
        </svg>`,
        clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
        </svg>`
    };

    // Insert icons
    document.querySelectorAll('.info-item').forEach(item => {
        const iconType = item.getAttribute('data-icon');
        const iconContainer = item.querySelector('.icon-container');
        if (iconType && iconContainer && icons[iconType]) {
            iconContainer.innerHTML = icons[iconType];
        }
    });

    // Theme handling for icons
    function updateIconColors() {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.info-item svg').forEach(svg => {
            svg.style.color = isDarkTheme ? '#FFFFFF' : '#000000';
        });
    }

    // Initial color update
    updateIconColors();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateIconColors();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 11) {
            return digits.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
        }
        return value;
    }

    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
    }

    function showFormFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorMessage);
        }
    }

    function clearFormFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function showFormStatus(message, isSuccess) {
        formStatus.innerHTML = `
            <img src="imagens/${isSuccess ? 'check' : 'error'}.png" alt="" aria-hidden="true">
            <span>${message}</span>
        `;
        formStatus.className = 'form-status ' + (isSuccess ? 'success' : 'error');
        formStatus.style.display = 'flex';

        if (isSuccess) {
            contactForm.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });
            characterCounter.textContent = '0/500';
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Character counter
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        characterCounter.textContent = `${length}/${MAX_MESSAGE_LENGTH}`;
        
        if (length > MAX_MESSAGE_LENGTH) {
            this.value = this.value.substring(0, MAX_MESSAGE_LENGTH);
            characterCounter.textContent = `${MAX_MESSAGE_LENGTH}/${MAX_MESSAGE_LENGTH}`;
        }

        if (length >= MAX_MESSAGE_LENGTH * 0.9) {
            characterCounter.style.color = 'var(--alert-critical)';
        } else {
            characterCounter.style.color = 'var(--text-secondary)';
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const cursorPosition = this.selectionStart;
        const previousLength = this.value.length;
        this.value = formatPhoneNumber(this.value);
        const newLength = this.value.length;
        
        if (cursorPosition < previousLength) {
            this.setSelectionRange(cursorPosition, cursorPosition);
        }
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let hasError = false;

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const priority = document.getElementById('priority').value;
        const message = document.getElementById('message').value.trim();
        const newsletter = document.getElementById('newsletter').checked;

        // Reset previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });

        // Validate name
        if (name.length < 3) {
            showFormFieldError(document.getElementById('name'), 'Por favor, insira um nome válido com pelo menos 3 caracteres');
            hasError = true;
        } else {
            clearFormFieldError(document.getElementById('name'));
        }

        // Validate email
        if (!validateEmail(email)) {
            showFormFieldError(document.getElementById('email'), 'Por favor, insira um e-mail válido');
            hasError = true;
        } else {
            clearFormFieldError(document.getElementById('email'));
        }

        // Validate phone if provided
        if (phone && !validatePhone(phone)) {
            showFormFieldError(document.getElementById('phone'), 'Por favor, insira um telefone válido');
            hasError = true;
        } else if (phone) {
            clearFormFieldError(document.getElementById('phone'));
        }

        // Validate subject
        if (!subject) {
            showFormFieldError(document.getElementById('subject'), 'Por favor, selecione um assunto');
            hasError = true;
        } else {
            clearFormFieldError(document.getElementById('subject'));
        }

        // Validate message
        if (message.length < 10) {
            showFormFieldError(document.getElementById('message'), 'Por favor, insira uma mensagem com pelo menos 10 caracteres');
            hasError = true;
        } else {
            clearFormFieldError(document.getElementById('message'));
        }

        if (hasError) {
            showFormStatus('Por favor, corrija os erros no formulário', false);
            return;
        }

        // Show loading state
        loadingSpinner.style.display = 'block';
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;

        try {
            const formData = {
                name,
                email,
                phone,
                subject,
                priority,
                message,
                newsletter,
                timestamp: new Date().toISOString()
            };

            const delay = new Promise(resolve => setTimeout(resolve,1500));

            const [response] = await Promise.all([fetch('contato.php',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            }),
            delay
        ]);

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Erro ao enviar a mensagem');
            }
            showFormStatus(result.message || 'Mensagem enviada com sucesso!', true);
            }
            catch (error) {
            showFormStatus('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.', false);
        } finally {
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Reset button handler
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            contactForm.reset();
            a.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });
            characterCounter.textContent = '0/500';
            formStatus.style.display = 'none';
        }
    });
});