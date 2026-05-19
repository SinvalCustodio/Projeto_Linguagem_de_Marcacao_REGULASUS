/**
 * =====================================================
 * REGULASUS - Script Principal
 * Sistema de Gerenciamento de Disponibilidade de Vagas
 * ===================================================== */

// =====================================================
// 1. OBJETO GLOBAL DE CONFIGURAÇÃO
// =====================================================

const APP_CONFIG = {
    APP_NAME: 'REGULASUS',
    VERSION: '1.0.0',
    DEBUG: true
};

// =====================================================
// 2. DADOS DE TESTE (Simulando API)
// =====================================================

/**
 * Dados de pacientes para teste
 */
const MOCK_PATIENTS = [
    {
        id: 1,
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        email: 'joao.silva@email.com',
        phone: '(81) 98765-4321',
        birthDate: '1978-03-15',
        registrationDate: '2026-05-15',
        status: 'ativo'
    },
    {
        id: 2,
        name: 'Maria Oliveira Costa',
        cpf: '987.654.321-00',
        email: 'maria.costa@email.com',
        phone: '(81) 99876-5432',
        birthDate: '1985-07-22',
        registrationDate: '2026-05-10',
        status: 'ativo'
    },
    {
        id: 3,
        name: 'Pedro Ferreira Alves',
        cpf: '456.789.123-00',
        email: 'pedro.alves@email.com',
        phone: '(81) 97654-3210',
        birthDate: '1992-11-05',
        registrationDate: '2026-04-20',
        status: 'ativo'
    }
];

/**
 * Dados de encaminhamentos para teste
 */
const MOCK_REFERRALS = [
    {
        id: 5001,
        patientId: 1,
        patientName: 'João Silva Santos',
        specialty: 'Cardiologia',
        doctor: 'Dra. Maria Oliveira',
        diagnosis: 'Dor no peito - avaliação cardiológica',
        priority: 'urgencia',
        status: 'pendente',
        date: '2026-05-15 10:30'
    },
    {
        id: 5002,
        patientId: 2,
        patientName: 'Maria Oliveira Costa',
        specialty: 'Oftalmologia',
        doctor: 'Dr. Carlos Silva',
        diagnosis: 'Redução de visão',
        priority: 'rotina',
        status: 'autorizado',
        date: '2026-05-14 14:00'
    },
    {
        id: 5003,
        patientId: 3,
        patientName: 'Pedro Ferreira Alves',
        specialty: 'Ortopedia',
        doctor: 'Dr. Roberto Santos',
        diagnosis: 'Dor no joelho',
        priority: 'urgencia',
        status: 'agendado',
        date: '2026-05-13 09:15'
    }
];

/**
 * Dados de fila de espera para teste
 */
const MOCK_QUEUE = [
    {
        position: 1,
        patientName: 'João Silva Santos',
        specialty: 'Cardiologia',
        priority: 'urgencia',
        entryDate: '2026-05-13',
        daysInQueue: 5
    },
    {
        position: 2,
        patientName: 'Ana Paula Mendes',
        specialty: 'Cardiologia',
        priority: 'media',
        entryDate: '2026-05-12',
        daysInQueue: 6
    },
    {
        position: 3,
        patientName: 'Lucas Gomes',
        specialty: 'Cardiologia',
        priority: 'baixa',
        entryDate: '2026-05-10',
        daysInQueue: 8
    }
];

// =====================================================
// 3. CLASSE: GERENCIADOR DE NAVEGAÇÃO
// =====================================================

/**
 * Classe responsável pela navegação entre páginas
 */
class PageManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.pagesSections = document.querySelectorAll('.page-section');
        this.initEventListeners();
    }
    
    /**
     * Inicializa os event listeners dos links de navegação
     */
    initEventListeners() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Fechar sidebar ao clicar em link (mobile)
        if (window.innerWidth < 768) {
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const sidebar = document.getElementById('sidebar');
                    sidebar.classList.remove('active');
                });
            });
        }
    }
    
    /**
     * Manipula o clique em um link de navegação
     */
    handleNavClick(event) {
        event.preventDefault();
        const pageName = event.target.closest('.nav-link').dataset.page;
        this.goToPage(pageName);
    }
    
    /**
     * Navega para uma página específica
     */
    goToPage(pageName) {
        // Remove classe ativa de todos os links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Remove classe ativa de todas as seções de página
        this.pagesSections.forEach(section => section.classList.remove('active'));
        
        // Ativa o link correto
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Ativa a seção de página correta
        const activePage = document.getElementById(`${pageName}Page`);
        if (activePage) {
            activePage.classList.add('active');
        }
        
        this.currentPage = pageName;
        
        // Log para debug
        if (APP_CONFIG.DEBUG) {
            console.log(`✓ Navegando para: ${pageName}`);
        }
    }
}

// =====================================================
// 4. CLASSE: GERENCIADOR DE NOTIFICAÇÕES
// =====================================================

/**
 * Classe responsável por exibir notificações (toasts)
 */
class NotificationManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }
    
    /**
     * Exibe uma notificação
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo (success, error, warning, info)
     * @param {number} duration - Duração em ms (0 = permanente)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Mapear ícone por tipo
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Informação'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <p class="toast-message">${message}</p>
            </div>
        `;
        
        this.container.appendChild(toast);
        
        // Remover após o tempo especificado
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'toastSlideOut 300ms ease-in-out forwards';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        
        return toast;
    }
    
    /**
     * Atalho para sucesso
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    /**
     * Atalho para erro
     */
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
    
    /**
     * Atalho para aviso
     */
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }
    
    /**
     * Atalho para info
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// =====================================================
// 5. CLASSE: GERENCIADOR DE MODAIS
// =====================================================

/**
 * Classe responsável por controlar modais
 */
class ModalManager {
    constructor() {
        this.modals = {};
        this.initializeModals();
        this.setupPatientModal();
    }
    
    /**
     * Inicializa os modais da página
     */
    initializeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            const modalId = modal.id;
            this.modals[modalId] = {
                element: modal,
                isOpen: false
            };
            
            // Fechar ao clicar no botão de fechar
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(modalId));
            }
            
            // Fechar ao clicar fora do modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close(modalId);
                }
            });
        });
    }
    
    /**
     * Abre um modal
     */
    open(modalId) {
        if (this.modals[modalId]) {
            this.modals[modalId].element.removeAttribute('hidden');
            this.modals[modalId].isOpen = true;
            if (APP_CONFIG.DEBUG) {
                console.log(`✓ Modal aberto: ${modalId}`);
            }
        }
    }
    
    /**
     * Fecha um modal
     */
    close(modalId) {
        if (this.modals[modalId]) {
            this.modals[modalId].element.setAttribute('hidden', '');
            this.modals[modalId].isOpen = false;
            if (APP_CONFIG.DEBUG) {
                console.log(`✓ Modal fechado: ${modalId}`);
            }
        }
    }
    
    /**
     * Configura eventos do modal de paciente
     */
    setupPatientModal() {
        const patientForm = document.getElementById('patientForm');
        const newPatientBtn = document.getElementById('newPatientBtn');
        const newPatientBtnToolbar = document.getElementById('newPatientBtnToolbar');
        const cancelBtn = document.getElementById('cancelPatientForm');
        
        // Abrir modal
        if (newPatientBtn) {
            newPatientBtn.addEventListener('click', () => this.open('patientModal'));
        }
        if (newPatientBtnToolbar) {
            newPatientBtnToolbar.addEventListener('click', () => this.open('patientModal'));
        }
        
        // Cancelar
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close('patientModal'));
        }
        
        // Enviar formulário
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => this.handlePatientFormSubmit(e));
        }
    }
    
    /**
     * Manipula o envio do formulário de paciente
     */
    handlePatientFormSubmit(event) {
        event.preventDefault();
        
        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('firstName').value,
            cpf: document.getElementById('cpf').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value
        };
        
        // Validar CPF simples
        if (!this.validateCPF(formData.cpf)) {
            notificationManager.error('CPF inválido');
            return;
        }
        
        // Log dos dados (em produção, enviar para API)
        if (APP_CONFIG.DEBUG) {
            console.log('Novo paciente:', formData);
        }
        
        // Sucesso
        notificationManager.success(`Paciente ${formData.name} cadastrado com sucesso!`);
        
        // Limpar formulário e fechar modal
        event.target.reset();
        this.close('patientModal');
        
        // Recarregar tabela de pacientes
        patientManager.loadPatients();
    }
    
    /**
     * Valida CPF simples (apenas formato)
     */
    validateCPF(cpf) {
        const cleaned = cpf.replace(/\D/g, '');
        return cleaned.length === 11;
    }
}

// =====================================================
// 6. CLASSE: GERENCIADOR DE PACIENTES
// =====================================================

/**
 * Classe responsável pela gestão de pacientes
 */
class PatientManager {
    constructor() {
        this.patients = [...MOCK_PATIENTS];
        this.currentPage = 1;
        this.itemsPerPage = 10;
    }
    
    /**
     * Carrega e exibe pacientes na tabela
     */
    loadPatients() {
        const tableBody = document.getElementById('patientsTableBody');
        
        if (!tableBody) return;
        
        // Limpar tabela
        tableBody.innerHTML = '';
        
        // Preencher com dados
        this.patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="row-check"></td>
                <td>${patient.name}</td>
                <td>${patient.cpf}</td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td>${this.formatDate(patient.registrationDate)}</td>
                <td><span class="badge badge-success">Ativo</span></td>
                <td>
                    <button class="btn-icon btn-sm" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-sm" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-sm btn-danger" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Atualizar paginação
        this.updatePagination();
    }
    
    /**
     * Atualiza informações de paginação
     */
    updatePagination() {
        const totalPages = Math.ceil(this.patients.length / this.itemsPerPage);
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
    }
    
    /**
     * Formata data para exibição
     */
    formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Busca pacientes por termo
     */
    searchPatients(query) {
        if (!query) {
            this.loadPatients();
            return;
        }
        
        const filtered = this.patients.filter(patient => 
            patient.name.toLowerCase().includes(query.toLowerCase()) ||
            patient.cpf.includes(query) ||
            patient.email.toLowerCase().includes(query.toLowerCase())
        );
        
        const tableBody = document.getElementById('patientsTableBody');
        tableBody.innerHTML = '';
        
        filtered.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="row-check"></td>
                <td>${patient.name}</td>
                <td>${patient.cpf}</td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td>${this.formatDate(patient.registrationDate)}</td>
                <td><span class="badge badge-success">Ativo</span></td>
                <td>
                    <button class="btn-icon btn-sm"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-sm"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// =====================================================
// 7. CLASSE: GERENCIADOR DE ENCAMINHAMENTOS
// =====================================================

/**
 * Classe responsável pela gestão de encaminhamentos
 */
class ReferralManager {
    constructor() {
        this.referrals = [...MOCK_REFERRALS];
        this.initEventListeners();
    }
    
    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        // Botões de ação rápida
        const newReferralBtn = document.getElementById('newReferralBtn');
        if (newReferralBtn) {
            newReferralBtn.addEventListener('click', () => {
                pageManager.goToPage('referrals');
            });
        }
        
        // Filtros
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const resetFilters = document.getElementById('resetFilters');
        
        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.applyFilters());
        }
        if (filterPriority) {
            filterPriority.addEventListener('change', () => this.applyFilters());
        }
        if (resetFilters) {
            resetFilters.addEventListener('click', () => this.resetFilters());
        }
    }
    
    /**
     * Carrega encaminhamentos
     */
    loadReferrals() {
        this.displayReferrals(this.referrals);
    }
    
    /**
     * Exibe encaminhamentos na tela
     */
    displayReferrals(referrals) {
        const container = document.getElementById('referralsContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (referrals.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum encaminhamento encontrado</p></div>';
            return;
        }
        
        referrals.forEach(ref => {
            const badgeClass = {
                'pendente': 'badge-warning',
                'autorizado': 'badge-success',
                'rejeitado': 'badge-danger',
                'agendado': 'badge-info'
            }[ref.status] || 'badge-info';
            
            const priorityClass = {
                'rotina': 'badge-info',
                'urgencia': 'badge-danger',
                'emergencia': 'badge-danger'
            }[ref.priority] || 'badge-warning';
            
            const card = document.createElement('div');
            card.className = 'referral-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title">
                        <h4>Encaminhamento #${ref.id}</h4>
                        <p class="card-subtitle">${ref.patientName}</p>
                    </div>
                    <span class="badge ${badgeClass}">${ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}</span>
                </div>
                
                <div class="card-body">
                    <div class="card-row">
                        <div class="card-field">
                            <label>Especialidade:</label>
                            <p>${ref.specialty}</p>
                        </div>
                        <div class="card-field">
                            <label>Prioridade:</label>
                            <p><span class="badge ${priorityClass}">${ref.priority}</span></p>
                        </div>
                    </div>
                    
                    <div class="card-row">
                        <div class="card-field">
                            <label>Diagnóstico:</label>
                            <p>${ref.diagnosis}</p>
                        </div>
                    </div>
                    
                    <div class="card-row">
                        <div class="card-field">
                            <label>Data do Encaminhamento:</label>
                            <p>${ref.date}</p>
                        </div>
                        <div class="card-field">
                            <label>Médico Encaminhador:</label>
                            <p>${ref.doctor}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="referralManager.approveReferral(${ref.id})">
                        <i class="fas fa-check"></i> Aprovar
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="referralManager.requestMoreInfo(${ref.id})">
                        <i class="fas fa-question-circle"></i> Solicitar Info
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="referralManager.rejectReferral(${ref.id})">
                        <i class="fas fa-times"></i> Rejeitar
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    /**
     * Aprova um encaminhamento
     */
    approveReferral(id) {
        const ref = this.referrals.find(r => r.id === id);
        if (ref) {
            ref.status = 'autorizado';
            notificationManager.success(`Encaminhamento #${id} aprovado`);
            this.loadReferrals();
        }
    }
    
    /**
     * Rejeita um encaminhamento
     */
    rejectReferral(id) {
        const ref = this.referrals.find(r => r.id === id);
        if (ref) {
            ref.status = 'rejeitado';
            notificationManager.error(`Encaminhamento #${id} rejeitado`);
            this.loadReferrals();
        }
    }
    
    /**
     * Solicita mais informações
     */
    requestMoreInfo(id) {
        notificationManager.info(`Solicitação de informações enviada para #${id}`);
    }
    
    /**
     * Aplica filtros
     */
    applyFilters() {
        const statusFilter = document.getElementById('filterStatus').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        
        const filtered = this.referrals.filter(ref => {
            const statusMatch = !statusFilter || ref.status === statusFilter;
            const priorityMatch = !priorityFilter || ref.priority === priorityFilter;
            return statusMatch && priorityMatch;
        });
        
        this.displayReferrals(filtered);
    }
    
    /**
     * Reseta filtros
     */
    resetFilters() {
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterPriority').value = '';
        this.loadReferrals();
    }
}

// =====================================================
// 8. CLASSE: GERENCIADOR DE FILA
// =====================================================

/**
 * Classe responsável pela gestão da fila de espera
 */
class QueueManager {
    constructor() {
        this.queue = [...MOCK_QUEUE];
    }
    
    /**
     * Carrega e exibe fila de espera
     */
    loadQueue() {
        const container = document.getElementById('queueContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        this.queue.forEach((item, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.innerHTML = `
                <div class="queue-position">
                    <span class="position-badge">${item.position}º</span>
                </div>
                <div class="queue-info">
                    <h5>${item.patientName}</h5>
                    <p><strong>Especialidade:</strong> ${item.specialty}</p>
                    <p><strong>Prioridade:</strong> <span class="badge badge-danger">${item.priority}</span></p>
                    <p><strong>Na fila há:</strong> ${item.daysInQueue} dias</p>
                    <p><strong>Data de entrada:</strong> ${item.entryDate}</p>
                </div>
                <div class="queue-actions">
                    <button class="btn btn-sm btn-primary">
                        <i class="fas fa-calendar-plus"></i> Agendar
                    </button>
                    <button class="btn btn-sm btn-secondary">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                </div>
            `;
            container.appendChild(queueItem);
        });
    }
}

// =====================================================
// 9. CLASSE: GERENCIADOR DE AGENDAMENTOS
// =====================================================

/**
 * Classe responsável pela gestão de agendamentos
 */
class SchedulingManager {
    constructor() {
        this.initEventListeners();
    }
    
    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        const schedulingForm = document.getElementById('schedulingForm');
        
        if (schedulingForm) {
            schedulingForm.addEventListener('submit', (e) => this.handleScheduleSubmit(e));
        }
    }
    
    /**
     * Manipula o envio do formulário de agendamento
     */
    handleScheduleSubmit(event) {
        event.preventDefault();
        
        const formData = {
            patient: document.getElementById('schedulePatient').value,
            specialty: document.getElementById('scheduleSpecialty').value,
            date: document.getElementById('scheduleDate').value,
            time: document.getElementById('scheduleTime').value,
            location: document.getElementById('scheduleLocation').value,
            observations: document.getElementById('scheduleObservations').value
        };
        
        if (APP_CONFIG.DEBUG) {
            console.log('Novo agendamento:', formData);
        }
        
        notificationManager.success('Consulta agendada com sucesso!');
        
        // Limpar formulário
        event.target.reset();
    }
}

// =====================================================
// 10. CLASSE: GERENCIADOR DO DASHBOARD
// =====================================================

/**
 * Classe responsável pela atualização do dashboard
 */
class DashboardManager {
    constructor() {
        this.updateStats();
    }
    
    /**
     * Atualiza estatísticas do dashboard
     */
    updateStats() {
        // Total de encaminhamentos
        document.getElementById('statReferrals').textContent = 
            referralManager.referrals.length;
        
        // Total em fila
        document.getElementById('statQueue').textContent = 
            queueManager.queue.length;
        
        // Agendados (simulado)
        document.getElementById('statScheduled').textContent = '89';
        
        // Ocupação
        document.getElementById('statOccupancy').textContent = '87%';
    }
}

// =====================================================
// 11. GERENCIADORES DE UI
// =====================================================

/**
 * Gerenciador de menu do usuário
 */
function setupUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = userDropdown.hasAttribute('hidden');
            
            if (isHidden) {
                userDropdown.removeAttribute('hidden');
            } else {
                userDropdown.setAttribute('hidden', '');
            }
        });
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', () => {
        if (userDropdown) {
            userDropdown.setAttribute('hidden', '');
        }
    });
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            notificationManager.warning('Você foi desconectado');
            if (APP_CONFIG.DEBUG) {
                console.log('Usuário desconectado');
            }
        });
    }
}

/**
 * Gerenciador de sidebar mobile
 */
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

/**
 * Gerenciador de busca de pacientes
 */
function setupPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    
    if (searchInput) {
        // Debounce para não fazer muitas buscas
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                patientManager.searchPatients(e.target.value);
            }, 300);
        });
    }
}

/**
 * Gerenciador de notificações de menu
 */
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            notificationManager.info('Você tem 3 notificações pendentes');
        });
    }
}

// =====================================================
// 12. INICIALIZAÇÃO DA APLICAÇÃO
// ===================================================== 

/**
 * Função principal de inicialização
 */
function initializeApp() {
    if (APP_CONFIG.DEBUG) {
        console.log(`✓ Iniciando ${APP_CONFIG.APP_NAME} v${APP_CONFIG.VERSION}`);
    }
    
    // Criar instâncias dos gerenciadores
    window.pageManager = new PageManager();
    window.notificationManager = new NotificationManager();
    window.modalManager = new ModalManager();
    window.patientManager = new PatientManager();
    window.referralManager = new ReferralManager();
    window.queueManager = new QueueManager();
    window.schedulingManager = new SchedulingManager();
    window.dashboardManager = new DashboardManager();
    
    // Configurar UI
    setupUserMenu();
    setupSidebarToggle();
    setupPatientSearch();
    setupNotifications();
    
    // Carregar dados iniciais
    patientManager.loadPatients();
    referralManager.loadReferrals();
    queueManager.loadQueue();
    
    if (APP_CONFIG.DEBUG) {
        console.log('✓ Aplicação inicializada com sucesso');
        console.log('✓ Gerenciadores carregados');
        console.log('✓ Event listeners configurados');
    }
}

/**
 * Esperar que o DOM esteja pronto
 */
if (typeof document !== 'undefined' && !(import.meta.env && import.meta.env.VITEST)) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

export {
    APP_CONFIG,
    MOCK_PATIENTS,
    MOCK_REFERRALS,
    MOCK_QUEUE,
    PageManager,
    NotificationManager,
    ModalManager,
    PatientManager,
    ReferralManager,
    QueueManager,
    SchedulingManager,
    DashboardManager,
    setupUserMenu,
    setupSidebarToggle,
    setupPatientSearch,
    setupNotifications,
    initializeApp
};

// =====================================================
// 13. FUNÇÕES UTILITÁRIAS GLOBAIS
// ===================================================== 

/**
 * Função global para formatar data
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

/**
 * Função global para copiar para área de transferência
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        notificationManager.success('Copiado para a área de transferência!');
    });
}

/**
 * Função global para validar email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Função global para máscara de telefone
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

