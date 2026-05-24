/**
 * =====================================================
 * REGULASUS — APP.JS
 * Módulo principal da aplicação
 * =====================================================
 */

'use strict';

// -----------------------------------------------
// PROTEÇÃO DE ROTA (SIMULADA)
// -----------------------------------------------
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Para fins de demonstração, deixaremos aberto, mas o código estaria aqui:
    // if (!localStorage.getItem('isLoggedIn')) window.location.href = 'auth.html';
}

// -----------------------------------------------
// GERENCIADOR DE NAVEGAÇÃO
// -----------------------------------------------

class NavigationManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.navLinks = document.querySelectorAll('.nav-link[data-section]');
        this.sections = document.querySelectorAll('.page-section[data-section]');
        this._init();
    }

    _init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateTo(section);

                // Fechar sidebar no mobile
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('sidebar--open');
                    document.getElementById('sidebarOverlay').classList.remove('visible');
                }
            });
        });

        // Navegação via atributos data-goto (Global)
        document.querySelectorAll('[data-goto]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const section = el.dataset.goto;
                this.navigateTo(section);
                
                // Fechar dropdowns se necessário
                document.getElementById('userDropdown')?.setAttribute('hidden', '');
            });
        });
    }

    navigateTo(sectionId) {
        // Atualizar links ativos
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // Mostrar/ocultar seções
        this.sections.forEach(section => {
            if (section.dataset.section === sectionId) {
                section.removeAttribute('hidden');
            } else {
                section.setAttribute('hidden', '');
            }
        });

        this.currentSection = sectionId;

        // Inicializar gráficos ao entrar no dashboard
        if (sectionId === 'dashboard') {
            setTimeout(initDashboardCharts, 100);
        }

        // Inicializar primeira aba de relatórios
        if (sectionId === 'reports') {
            setTimeout(() => {
                const activeTab = document.querySelector('.report-tab.active');
                if (activeTab) {
                    initReportCharts(activeTab.dataset.tab);
                }
            }, 100);
        }

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// -----------------------------------------------
// GERENCIADOR DE PACIENTES
// -----------------------------------------------

class PatientManager {
    constructor() {
        this.patients = [...MOCK_PATIENTS];
        this.filteredPatients = [...this.patients];
        this.currentPage = 1;
        this.itemsPerPage = APP_CONFIG.ITEMS_PER_PAGE;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this._init();
    }

    _init() {
        this.loadPatients();
        this._setupSearch();
        this._setupFilters();
    }

    _setupSearch() {
        const searchInput = document.getElementById('patientSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', debounce((e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.currentPage = 1;
            this._applyFilters();
        }, 300));
    }

    _setupFilters() {
        const statusFilter = document.getElementById('patientStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this._applyFilters();
            });
        }
    }

    _applyFilters() {
        this.filteredPatients = this.patients.filter(p => {
            const matchSearch = !this.searchQuery ||
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.cpf.includes(this.searchQuery) ||
                p.email.toLowerCase().includes(this.searchQuery);

            const matchStatus = this.statusFilter === 'all' || p.status === this.statusFilter;

            return matchSearch && matchStatus;
        });

        this.renderTable();
    }

    loadPatients() {
        this.patients = [...MOCK_PATIENTS];
        this._applyFilters();
    }

    renderTable() {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const page = this.filteredPatients.slice(start, end);
        const total = this.filteredPatients.length;

        if (page.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <i class="fas fa-user-slash" aria-hidden="true"></i>
                            <p>Nenhum paciente encontrado.</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = page.map(p => this._buildRow(p)).join('');
            this._attachRowEvents(tbody);
        }

        // Atualizar contador
        const countEl = document.getElementById('patientCount');
        if (countEl) {
            countEl.textContent = `Exibindo ${Math.min(start + 1, total)}–${Math.min(end, total)} de ${total} paciente${total !== 1 ? 's' : ''}`;
        }

        // Paginação
        this._updatePagination(total);
    }

    _buildRow(p) {
        const age = p.birthDate
            ? new Date().getFullYear() - new Date(p.birthDate).getFullYear()
            : '—';

        const statusClass = p.status === 'ativo' ? 'badge--success' : 'badge--gray';
        const statusLabel = p.status === 'ativo' ? 'Ativo' : 'Inativo';

        return `
            <tr data-patient-id="${p.id}">
                <td class="col-check">
                    <input type="checkbox" aria-label="Selecionar ${p.name}">
                </td>
                <td>
                    <div class="patient-cell">
                        <span class="patient-name">${p.name}</span>
                        <span class="patient-email">${p.email}</span>
                    </div>
                </td>
                <td>${p.cpf}</td>
                <td>${age} anos</td>
                <td>${p.phone}</td>
                <td><span class="badge ${statusClass}">${statusLabel}</span></td>
                <td class="col-actions">
                    <div class="table-actions">
                        <button class="btn-icon-only btn-view-patient" title="Ver detalhes" aria-label="Ver detalhes de ${p.name}">
                            <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                        <button class="btn-icon-only btn-edit-patient" title="Editar" aria-label="Editar ${p.name}">
                            <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                        </button>
                        <button class="btn-icon-only btn-icon-danger btn-delete-patient" title="Remover" aria-label="Remover ${p.name}">
                            <i class="fas fa-trash-alt" aria-hidden="true"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    _attachRowEvents(tbody) {
        // Visualizar
        tbody.querySelectorAll('.btn-view-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const id = parseInt(row.dataset.patientId);
                const patient = this.patients.find(p => p.id === id);
                if (patient) this._showPatientDetails(patient);
            });
        });

        // Editar
        tbody.querySelectorAll('.btn-edit-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                window.notificationManager.info('Funcionalidade de edição em desenvolvimento.');
            });
        });

        // Excluir
        tbody.querySelectorAll('.btn-delete-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const id = parseInt(row.dataset.patientId);
                const patient = this.patients.find(p => p.id === id);
                if (!patient) return;

                window.modalManager.confirm({
                    title: 'Remover Paciente',
                    message: `Deseja remover o paciente ${patient.name}? Esta ação não pode ser desfeita.`,
                    danger: true,
                    onConfirm: () => {
                        const idx = MOCK_PATIENTS.findIndex(p => p.id === id);
                        if (idx > -1) MOCK_PATIENTS.splice(idx, 1);
                        this.loadPatients();
                        window.notificationManager.success(`Paciente ${patient.name} removido.`);
                    }
                });
            });
        });
    }

    _showPatientDetails(patient) {
        const age = patient.birthDate
            ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
            : '—';

        document.getElementById('detailPatientName').textContent = patient.name;
        document.getElementById('detailPatientInitials').textContent = getInitials(patient.name);
        document.getElementById('detailPatientCPF').textContent = patient.cpf;
        document.getElementById('detailPatientAge').textContent = `${age} anos`;
        document.getElementById('detailPatientGender').textContent =
            patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Feminino' : 'Outro';
        document.getElementById('detailPatientEmail').textContent = patient.email;
        document.getElementById('detailPatientPhone').textContent = patient.phone;
        document.getElementById('detailPatientAddress').textContent =
            `${patient.address}, ${patient.neighborhood} — ${patient.city}`;
        document.getElementById('detailPatientRegistration').textContent =
            formatDate(patient.registrationDate);

        window.modalManager.open('patientDetailModal');
    }

    _updatePagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const prevBtn = document.getElementById('patientPrevPage');
        const nextBtn = document.getElementById('patientNextPage');
        const pageInfo = document.getElementById('patientPageInfo');

        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
        if (pageInfo) pageInfo.textContent = `Página ${this.currentPage} de ${Math.max(1, totalPages)}`;

        if (prevBtn) {
            const newPrev = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);
            newPrev.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                }
            });
        }

        if (nextBtn) {
            const newNext = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            newNext.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTable();
                }
            });
        }
    }
}

// -----------------------------------------------
// GERENCIADOR DE ENCAMINHAMENTOS
// -----------------------------------------------

class ReferralManager {
    constructor() {
        this.referrals = [...MOCK_REFERRALS];
        this._init();
    }

    _init() {
        this.renderReferrals();
        this._setupSearch();
        this._setupFilters();
        this._setupNewReferralBtn();
    }

    _setupSearch() {
        const searchInput = document.getElementById('referralSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', debounce((e) => {
            this.renderReferrals(e.target.value.toLowerCase());
        }, 300));
    }

    _setupFilters() {
        ['referralStatusFilter', 'referralPriorityFilter', 'referralSpecialtyFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => this.renderReferrals());
        });
    }

    _setupNewReferralBtn() {
        const btn = document.getElementById('newReferralBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                window.modalManager.open('referralModal');
            });
        }

        // Botão de ação rápida
        const quickBtn = document.getElementById('quickNewReferral');
        if (quickBtn) {
            quickBtn.addEventListener('click', () => {
                window.navigationManager.navigateTo('referrals');
                setTimeout(() => window.modalManager.open('referralModal'), 200);
            });
        }

        // Formulário de encaminhamento
        const form = document.getElementById('referralForm');
        if (form) {
            form.addEventListener('submit', (e) => this._handleReferralSubmit(e));
        }

        const cancelBtn = document.getElementById('cancelReferralForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => window.modalManager.close('referralModal'));
        }
    }

    _handleReferralSubmit(e) {
        e.preventDefault();

        const patientName = document.getElementById('referralPatient').value.trim();
        const specialty   = document.getElementById('referralSpecialty').value;
        const doctor      = document.getElementById('referralDoctor').value.trim();
        const unit        = document.getElementById('referralUnit').value.trim();
        const priority    = document.getElementById('referralPriority').value;
        const diagnosis   = document.getElementById('referralDiagnosis').value.trim();
        const notes       = document.getElementById('referralNotes').value.trim();

        if (!patientName || !specialty || !priority) {
            window.notificationManager.warning('Preencha os campos obrigatórios.');
            return;
        }

        const newReferral = {
            id: 5000 + MOCK_REFERRALS.length + 1,
            patientName,
            specialty,
            doctor,
            unit,
            priority,
            diagnosis,
            notes,
            status: 'pendente',
            date: new Date().toLocaleString('pt-BR')
        };

        MOCK_REFERRALS.push(newReferral);
        this.referrals = [...MOCK_REFERRALS];
        this.renderReferrals();

        window.notificationManager.success(`Encaminhamento para ${patientName} criado com sucesso!`);
        e.target.reset();
        window.modalManager.close('referralModal');
    }

    renderReferrals(searchQuery = '') {
        const container = document.getElementById('referralsGrid');
        if (!container) return;

        const statusFilter    = document.getElementById('referralStatusFilter')?.value || 'all';
        const priorityFilter  = document.getElementById('referralPriorityFilter')?.value || 'all';
        const specialtyFilter = document.getElementById('referralSpecialtyFilter')?.value || 'all';

        const filtered = this.referrals.filter(r => {
            const matchSearch = !searchQuery ||
                r.patientName.toLowerCase().includes(searchQuery) ||
                r.specialty.toLowerCase().includes(searchQuery);
            const matchStatus   = statusFilter === 'all'    || r.status === statusFilter;
            const matchPriority = priorityFilter === 'all'  || r.priority === priorityFilter;
            const matchSpecialty = specialtyFilter === 'all' || r.specialty === specialtyFilter;
            return matchSearch && matchStatus && matchPriority && matchSpecialty;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1">
                    <i class="fas fa-file-medical-alt" aria-hidden="true"></i>
                    <p>Nenhum encaminhamento encontrado.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(r => this._buildCard(r)).join('');
        this._attachCardEvents(container);
    }

    _buildCard(r) {
        const priorityClass = getPriorityBadgeClass(r.priority);
        const statusClass   = getStatusBadgeClass(r.status);

        return `
            <article class="referral-card" data-referral-id="${r.id}">
                <div class="referral-card-header">
                    <div>
                        <p class="referral-card-id">Enc. #${r.id}</p>
                        <p class="referral-card-patient">${r.patientName}</p>
                    </div>
                    <div style="display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap;">
                        <span class="badge ${priorityClass}">
                            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                            ${getPriorityLabel(r.priority)}
                        </span>
                        <span class="badge ${statusClass}">${getStatusLabel(r.status)}</span>
                    </div>
                </div>
                <div class="referral-card-body">
                    <div class="referral-field">
                        <span class="referral-field-label">Especialidade</span>
                        <span class="referral-field-value">${r.specialty}</span>
                    </div>
                    <div class="referral-field">
                        <span class="referral-field-label">Médico Solicitante</span>
                        <span class="referral-field-value">${r.doctor || '—'}</span>
                    </div>
                    <div class="referral-field">
                        <span class="referral-field-label">Unidade de Origem</span>
                        <span class="referral-field-value">${r.unit || '—'}</span>
                    </div>
                    <div class="referral-field">
                        <span class="referral-field-label">Data</span>
                        <span class="referral-field-value">${r.date}</span>
                    </div>
                    <div class="referral-field referral-field--full">
                        <span class="referral-field-label">Diagnóstico / Motivo</span>
                        <span class="referral-field-value">${truncate(r.diagnosis, 80)}</span>
                    </div>
                </div>
                <div class="referral-card-footer">
                    ${r.status === 'pendente' ? `
                        <button class="btn btn-sm btn-success btn-approve-referral" data-id="${r.id}">
                            <i class="fas fa-check" aria-hidden="true"></i> Autorizar
                        </button>
                        <button class="btn btn-sm btn-danger btn-reject-referral" data-id="${r.id}">
                            <i class="fas fa-times" aria-hidden="true"></i> Rejeitar
                        </button>
                    ` : ''}
                    ${r.status === 'autorizado' ? `
                        <button class="btn btn-sm btn-primary btn-schedule-referral" data-id="${r.id}">
                            <i class="fas fa-calendar-plus" aria-hidden="true"></i> Agendar
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary btn-view-referral" data-id="${r.id}" style="margin-left:auto">
                        <i class="fas fa-eye" aria-hidden="true"></i> Detalhes
                    </button>
                </div>
            </article>
        `;
    }

    _attachCardEvents(container) {
        container.querySelectorAll('.btn-approve-referral').forEach(btn => {
            btn.addEventListener('click', () => this._updateStatus(parseInt(btn.dataset.id), 'autorizado'));
        });

        container.querySelectorAll('.btn-reject-referral').forEach(btn => {
            btn.addEventListener('click', () => {
                window.modalManager.confirm({
                    title: 'Rejeitar Encaminhamento',
                    message: 'Confirma a rejeição deste encaminhamento?',
                    danger: true,
                    onConfirm: () => this._updateStatus(parseInt(btn.dataset.id), 'rejeitado')
                });
            });
        });

        container.querySelectorAll('.btn-schedule-referral').forEach(btn => {
            btn.addEventListener('click', () => {
                window.navigationManager.navigateTo('scheduling');
                window.notificationManager.info('Selecione a data e horário para o agendamento.');
            });
        });

        container.querySelectorAll('.btn-view-referral').forEach(btn => {
            btn.addEventListener('click', () => {
                window.notificationManager.info('Visualização detalhada em desenvolvimento.');
            });
        });
    }

    _updateStatus(id, newStatus) {
        const idx = MOCK_REFERRALS.findIndex(r => r.id === id);
        if (idx > -1) {
            MOCK_REFERRALS[idx].status = newStatus;
            this.referrals = [...MOCK_REFERRALS];
            this.renderReferrals();

            const labels = { autorizado: 'autorizado', rejeitado: 'rejeitado' };
            window.notificationManager.success(`Encaminhamento ${labels[newStatus]} com sucesso.`);
        }
    }
}

// -----------------------------------------------
// GERENCIADOR DE AGENDAMENTOS
// -----------------------------------------------

class SchedulingManager {
    constructor() {
        this.schedules = [...MOCK_SCHEDULES];
        this._init();
    }

    _init() {
        this.renderScheduleList();
        this._setupForm();
        document.getElementById('schedulingDate')?.setAttribute('min', getTodayISO());
    }

    _setupForm() {
        const form = document.getElementById('schedulingForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const patient   = document.getElementById('schedulingPatient').value.trim();
            const specialty = document.getElementById('schedulingSpecialty').value;
            const date      = document.getElementById('schedulingDate').value;
            const time      = document.getElementById('schedulingTime').value;
            const location  = document.getElementById('schedulingLocation').value.trim();
            const priority  = document.getElementById('schedulingPriority').value;

            if (!patient || !specialty || !date || !time) {
                window.notificationManager.warning('Preencha todos os campos obrigatórios.');
                return;
            }

            const newSchedule = {
                id: this.schedules.length + 1,
                patient,
                specialty,
                date,
                time,
                location: location || 'A definir',
                priority,
                status: 'confirmado'
            };

            MOCK_SCHEDULES.push(newSchedule);
            this.schedules = [...MOCK_SCHEDULES];
            this.renderScheduleList();

            window.notificationManager.success(`Agendamento para ${patient} criado com sucesso!`);
            form.reset();
            document.getElementById('schedulingDate')?.setAttribute('min', getTodayISO());
        });

        const clearBtn = document.getElementById('clearSchedulingForm');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.getElementById('schedulingForm').reset();
            });
        }
    }

    renderScheduleList() {
        const container = document.getElementById('scheduleList');
        if (!container) return;

        if (this.schedules.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times" aria-hidden="true"></i>
                    <p>Nenhum agendamento registrado.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.schedules.map(s => this._buildItem(s)).join('');
        this._attachItemEvents(container);
    }

    _buildItem(s) {
        const dateParts = s.date.split('-');
        const day   = dateParts[2];
        const month = new Date(s.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
        const priorityClass = getPriorityBadgeClass(s.priority);
        const statusClass   = s.status === 'confirmado' ? 'badge--success' : 'badge--warning';

        return `
            <div class="schedule-item" data-schedule-id="${s.id}">
                <div class="schedule-date-badge" aria-label="${formatDate(s.date)}">
                    <span class="schedule-day">${day}</span>
                    <span class="schedule-month">${month}</span>
                </div>
                <div class="schedule-info">
                    <p class="schedule-patient">${s.patient}</p>
                    <div class="schedule-meta">
                        <span><i class="fas fa-stethoscope" aria-hidden="true"></i> ${s.specialty}</span>
                        <span><i class="fas fa-clock" aria-hidden="true"></i> ${s.time}</span>
                        <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${s.location}</span>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2)">
                    <span class="badge ${priorityClass}">${getPriorityLabel(s.priority)}</span>
                    <span class="badge ${statusClass}">${getStatusLabel(s.status)}</span>
                </div>
                <div class="schedule-item-actions">
                    <button class="btn-icon-only btn-icon-danger btn-cancel-schedule" title="Cancelar" aria-label="Cancelar agendamento de ${s.patient}" data-id="${s.id}">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        `;
    }

    _attachItemEvents(container) {
        container.querySelectorAll('.btn-cancel-schedule').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const schedule = this.schedules.find(s => s.id === id);
                if (!schedule) return;

                window.modalManager.confirm({
                    title: 'Cancelar Agendamento',
                    message: `Deseja cancelar o agendamento de ${schedule.patient}?`,
                    danger: true,
                    onConfirm: () => {
                        const idx = MOCK_SCHEDULES.findIndex(s => s.id === id);
                        if (idx > -1) MOCK_SCHEDULES.splice(idx, 1);
                        this.schedules = [...MOCK_SCHEDULES];
                        this.renderScheduleList();
                        window.notificationManager.success('Agendamento cancelado.');
                    }
                });
            });
        });
    }
}

// -----------------------------------------------
// GERENCIADOR DE FILA DE ESPERA
// -----------------------------------------------

class QueueManager {
    constructor() {
        this.queue = [...MOCK_QUEUE];
        this._init();
    }

    _init() {
        this.renderQueue();
        this._setupFilters();
        this._setupAddBtn();
    }

    _setupFilters() {
        const specialtyFilter = document.getElementById('queueSpecialtyFilter');
        const priorityFilter  = document.getElementById('queuePriorityFilter');

        [specialtyFilter, priorityFilter].forEach(el => {
            if (el) el.addEventListener('change', () => this.renderQueue());
        });
    }

    _setupAddBtn() {
        const btn = document.getElementById('addToQueueBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                window.notificationManager.info('Para adicionar à fila, crie um encaminhamento e autorize-o.');
            });
        }

        const quickBtn = document.getElementById('quickAddQueue');
        if (quickBtn) {
            quickBtn.addEventListener('click', () => {
                window.navigationManager.navigateTo('queue');
            });
        }
    }

    renderQueue() {
        const container = document.getElementById('queueList');
        if (!container) return;

        const specialtyFilter = document.getElementById('queueSpecialtyFilter')?.value || 'all';
        const priorityFilter  = document.getElementById('queuePriorityFilter')?.value || 'all';

        const filtered = this.queue.filter(q => {
            const matchSpecialty = specialtyFilter === 'all' || q.specialty === specialtyFilter;
            const matchPriority  = priorityFilter === 'all'  || q.priority === priorityFilter;
            return matchSpecialty && matchPriority;
        });

        // Atualizar total
        const totalBadge = document.getElementById('queueTotalBadge');
        if (totalBadge) totalBadge.textContent = `${filtered.length} paciente${filtered.length !== 1 ? 's' : ''} na fila`;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-list-ol" aria-hidden="true"></i>
                    <p>Nenhum paciente na fila com os filtros selecionados.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(q => this._buildItem(q)).join('');
        this._attachItemEvents(container);
    }

    _buildItem(q) {
        const priorityClass = getPriorityBadgeClass(q.priority);

        return `
            <div class="queue-item" data-queue-id="${q.id}">
                <div class="queue-position-badge" aria-label="Posição ${q.position} na fila">
                    ${q.position}
                </div>
                <div class="queue-info">
                    <p class="queue-patient-name">${q.patientName}</p>
                    <div class="queue-meta">
                        <span class="queue-meta-item">
                            <i class="fas fa-stethoscope" aria-hidden="true"></i>
                            ${q.specialty}
                        </span>
                        <span class="queue-meta-item">
                            <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                            Na fila desde ${formatDate(q.entryDate)}
                        </span>
                        <span class="queue-meta-item">
                            <i class="fas fa-hourglass-half" aria-hidden="true"></i>
                            ${q.daysInQueue} dias de espera
                        </span>
                    </div>
                </div>
                <span class="badge ${priorityClass}">
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    ${getPriorityLabel(q.priority)}
                </span>
                <div class="queue-actions">
                    <button class="btn btn-sm btn-primary btn-schedule-queue" data-id="${q.id}" title="Agendar consulta">
                        <i class="fas fa-calendar-plus" aria-hidden="true"></i> Agendar
                    </button>
                    <button class="btn-icon-only btn-icon-danger btn-remove-queue" data-id="${q.id}" title="Remover da fila" aria-label="Remover ${q.patientName} da fila">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        `;
    }

    _attachItemEvents(container) {
        container.querySelectorAll('.btn-schedule-queue').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = this.queue.find(q => q.id === id);
                if (!item) return;

                window.navigationManager.navigateTo('scheduling');
                setTimeout(() => {
                    const patientInput = document.getElementById('schedulingPatient');
                    const specialtyInput = document.getElementById('schedulingSpecialty');
                    if (patientInput) patientInput.value = item.patientName;
                    if (specialtyInput) specialtyInput.value = item.specialty;
                    window.notificationManager.info(`Dados de ${item.patientName} preenchidos no formulário de agendamento.`);
                }, 300);
            });
        });

        container.querySelectorAll('.btn-remove-queue').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = this.queue.find(q => q.id === id);
                if (!item) return;

                window.modalManager.confirm({
                    title: 'Remover da Fila',
                    message: `Deseja remover ${item.patientName} da fila de espera?`,
                    danger: true,
                    onConfirm: () => {
                        const idx = MOCK_QUEUE.findIndex(q => q.id === id);
                        if (idx > -1) MOCK_QUEUE.splice(idx, 1);
                        this.queue = [...MOCK_QUEUE];
                        this.renderQueue();
                        window.notificationManager.success(`${item.patientName} removido da fila.`);
                    }
                });
            });
        });
    }
}

// -----------------------------------------------
// GERENCIADOR DE RELATÓRIOS
// -----------------------------------------------

class ReportManager {
    constructor() {
        this._init();
    }

    _init() {
        this._setupTabs();
        this._setupExportBtn();
    }

    _setupTabs() {
        const tabs = document.querySelectorAll('.report-tab');
        const panels = document.querySelectorAll('.report-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Atualizar abas
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Mostrar painel
                const targetTab = tab.dataset.tab;
                panels.forEach(panel => {
                    if (panel.dataset.tab === targetTab) {
                        panel.removeAttribute('hidden');
                    } else {
                        panel.setAttribute('hidden', '');
                    }
                });

                // Inicializar gráfico da aba
                initReportCharts(targetTab);
            });
        });
    }

    _setupExportBtn() {
        const btn = document.getElementById('exportReportBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                window.notificationManager.info('Exportação de relatório em PDF em desenvolvimento.');
            });
        }
    }
}

// -----------------------------------------------
// INICIALIZAÇÃO PRINCIPAL
// -----------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // Splash screen
    const splash = document.getElementById('splashScreen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }, 2200);
    }

    // Instanciar gerenciadores globais
    window.notificationManager = new NotificationManager();
    window.modalManager        = new ModalManager();
    window.navigationManager   = new NavigationManager();
    window.patientManager      = new PatientManager();
    window.referralManager     = new ReferralManager();
    window.schedulingManager   = new SchedulingManager();
    window.queueManager        = new QueueManager();
    window.reportManager       = new ReportManager();

    // Sidebar mobile toggle
    const sidebarToggle  = document.getElementById('sidebarToggle');
    const sidebar        = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar--open');
            sidebarOverlay.classList.toggle('visible');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('sidebar--open');
            sidebarOverlay.classList.remove('visible');
        });
    }

    // Dropdown do usuário
    const userMenuBtn  = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !userDropdown.hasAttribute('hidden');
            if (isOpen) {
                userDropdown.setAttribute('hidden', '');
                userMenuBtn.setAttribute('aria-expanded', 'false');
            } else {
                userDropdown.removeAttribute('hidden');
                userMenuBtn.setAttribute('aria-expanded', 'true');
                // Fechar painel de notificações
                document.getElementById('notificationPanel')?.setAttribute('hidden', '');
            }
        });
    }

    // Painel de notificações
    const notifBtn   = document.getElementById('notificationBtn');
    const notifPanel = document.getElementById('notificationPanel');

    if (notifBtn && notifPanel) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !notifPanel.hasAttribute('hidden');
            if (isOpen) {
                notifPanel.setAttribute('hidden', '');
            } else {
                notifPanel.removeAttribute('hidden');
                // Fechar dropdown do usuário
                userDropdown?.setAttribute('hidden', '');
                userMenuBtn?.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', () => {
        userDropdown?.setAttribute('hidden', '');
        userMenuBtn?.setAttribute('aria-expanded', 'false');
        notifPanel?.setAttribute('hidden', '');
    });

    // Marcar notificações como lidas
    document.getElementById('markAllRead')?.addEventListener('click', () => {
        document.querySelectorAll('.notification-item.unread').forEach(el => {
            el.classList.remove('unread');
        });
        const badge = document.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';
        window.notificationManager.success('Todas as notificações foram marcadas como lidas.');
        notifPanel?.setAttribute('hidden', '');
    });

    // Inicializar gráficos do dashboard
    setTimeout(initDashboardCharts, 300);

    // Atualizar nome do usuário logado
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.querySelectorAll('.user-name, .sidebar-user-name, .dropdown-user-name, .profile-name-display').forEach(el => {
            el.textContent = currentUser;
        });
        document.querySelectorAll('.avatar-initials').forEach(el => {
            el.textContent = currentUser.substring(0, 2).toUpperCase();
        });
        
        // Preencher inputs do perfil
        const nameInput = document.querySelector('.user-name-input');
        if (nameInput) nameInput.value = currentUser;
        
        const emailInput = document.querySelector('.user-email-input');
        if (emailInput) emailInput.value = currentUser.toLowerCase().replace(/\s/g, '') + '@regulasus.gov.br';
    }

    // Lógica do Formulário de Perfil
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.querySelector('.user-name-input').value.trim();
        if (newName) {
            localStorage.setItem('currentUser', newName);
            window.notificationManager.success('Perfil atualizado com sucesso!');
            
            // Atualizar UI globalmente
            document.querySelectorAll('.user-name, .sidebar-user-name, .dropdown-user-name, .profile-name-display').forEach(el => {
                el.textContent = newName;
            });
            document.querySelectorAll('.avatar-initials').forEach(el => {
                el.textContent = newName.substring(0, 2).toUpperCase();
            });
        }
    });

    // Atualizar hora no dashboard
    function updateClock() {
        const el = document.getElementById('currentDateTime');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    updateClock();
    setInterval(updateClock, 60000);

    // Botão de atualizar dashboard
    document.getElementById('refreshDashboard')?.addEventListener('click', () => {
        window.notificationManager.info('Dados do dashboard atualizados.');
        initDashboardCharts();
    });

    // O fechamento do modal de detalhe agora é tratado automaticamente 
    // pelo atributo data-close-modal ou pela lógica genérica do modalManager.

    // Botão de exportar pacientes
    document.getElementById('exportPatientsBtn')?.addEventListener('click', () => {
        window.notificationManager.info('Exportação de dados em desenvolvimento.');
    });

    // Botão de imprimir fila
    document.getElementById('printQueueBtn')?.addEventListener('click', () => {
        window.print();
    });

    // Logout
    document.querySelector('.dropdown-item--danger')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.notificationManager.info('Saindo do sistema...');
        setTimeout(() => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'auth.html';
        }, 1000);
    });

});
