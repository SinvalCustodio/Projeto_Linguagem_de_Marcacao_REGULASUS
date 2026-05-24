/**
 * =====================================================
 * REGULASUS — MODALS.JS
 * Gerenciador de modais e formulários
 * =====================================================
 */

'use strict';

class ModalManager {
    constructor() {
        this.modals = {};
        this._initModals();
        this._setupPatientModal();
        this._setupConfirmModal();
    }

    /**
     * Registra todos os modais da página
     */
    _initModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            const id = modal.id;
            this.modals[id] = { element: modal, isOpen: false };

            // Fechar ao clicar no botão de fechar
            const closeBtn = modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(id));
            }

            // Fechar ao clicar no overlay (fora do container)
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.close(id);
            });

            // Fechar com Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modals[id]?.isOpen) {
                    this.close(id);
                }
            });
        });
    }

    /**
     * Abre um modal pelo ID
     * @param {string} modalId
     */
    open(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        modal.element.removeAttribute('hidden');
        modal.isOpen = true;
        document.body.style.overflow = 'hidden';

        // Foco no primeiro campo interativo
        setTimeout(() => {
            const firstInput = modal.element.querySelector('input, select, textarea, button:not(.modal-close-btn)');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    /**
     * Fecha um modal pelo ID
     * @param {string} modalId
     */
    close(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        modal.element.setAttribute('hidden', '');
        modal.isOpen = false;

        // Restaurar scroll se nenhum outro modal estiver aberto
        const anyOpen = Object.values(this.modals).some(m => m.isOpen);
        if (!anyOpen) {
            document.body.style.overflow = '';
        }
    }

    /**
     * Configura o modal de cadastro de paciente
     */
    _setupPatientModal() {
        // Botões que abrem o modal
        ['newPatientBtn', 'newPatientBtnToolbar', 'quickNewPatient'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.open('patientModal'));
        });

        // Botão cancelar
        const cancelBtn = document.getElementById('cancelPatientForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close('patientModal'));
        }

        // Máscara de CPF e telefone
        const cpfInput = document.getElementById('cpf');
        const phoneInput = document.getElementById('phone');
        if (cpfInput) applyCPFMask(cpfInput);
        if (phoneInput) applyPhoneMask(phoneInput);

        // Submissão do formulário
        const patientForm = document.getElementById('patientForm');
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => this._handlePatientSubmit(e));
        }
    }

    /**
     * Processa o envio do formulário de paciente
     */
    _handlePatientSubmit(event) {
        event.preventDefault();

        const form = event.target;
        let valid = true;

        // Coletar dados
        const data = {
            name:         document.getElementById('firstName').value.trim(),
            cpf:          document.getElementById('cpf').value.trim(),
            birthDate:    document.getElementById('birthDate').value,
            gender:       document.getElementById('gender').value,
            email:        document.getElementById('email').value.trim(),
            phone:        document.getElementById('phone').value.trim(),
            address:      document.getElementById('address').value.trim(),
            neighborhood: document.getElementById('neighborhood').value.trim(),
            city:         document.getElementById('city').value.trim()
        };

        // Validações
        this._clearErrors();

        if (!data.name || data.name.length < 3) {
            this._showError('firstNameError', 'Informe o nome completo (mínimo 3 caracteres).');
            valid = false;
        }

        if (!validateCPF(data.cpf)) {
            this._showError('cpfError', 'CPF inválido. Informe 11 dígitos numéricos.');
            valid = false;
        }

        if (!validateEmail(data.email)) {
            this._showError('emailError', 'Informe um e-mail válido.');
            valid = false;
        }

        if (!valid) return;

        // Adicionar à lista de pacientes
        const newPatient = {
            id: MOCK_PATIENTS.length + 1,
            ...data,
            registrationDate: getTodayISO(),
            status: 'ativo'
        };

        MOCK_PATIENTS.push(newPatient);

        // Feedback e limpeza
        window.notificationManager.success(`Paciente ${data.name} cadastrado com sucesso!`);
        form.reset();
        this.close('patientModal');

        // Recarregar tabela
        if (window.patientManager) {
            window.patientManager.loadPatients();
        }
    }

    /**
     * Configura o modal de confirmação genérico
     */
    _setupConfirmModal() {
        const cancelBtn = document.getElementById('confirmCancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close('confirmModal'));
        }
    }

    /**
     * Abre modal de confirmação com callback
     * @param {Object} options
     */
    confirm({ title = 'Confirmação', message = 'Tem certeza?', onConfirm, danger = false }) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;

        const confirmBtn = document.getElementById('confirmOk');
        const icon = document.getElementById('confirmIconWrapper');

        // Estilo de perigo
        if (danger) {
            confirmBtn.className = 'btn btn-danger';
            icon.querySelector('i').className = 'fas fa-exclamation-triangle';
            icon.style.color = 'var(--danger)';
        } else {
            confirmBtn.className = 'btn btn-primary';
            icon.querySelector('i').className = 'fas fa-question-circle';
            icon.style.color = 'var(--warning)';
        }

        // Remover listeners anteriores e adicionar novo
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

        newBtn.addEventListener('click', () => {
            this.close('confirmModal');
            if (typeof onConfirm === 'function') onConfirm();
        });

        this.open('confirmModal');
    }

    /**
     * Exibe mensagem de erro em um campo
     */
    _showError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.removeAttribute('hidden');
        }
    }

    /**
     * Limpa todos os erros do formulário
     */
    _clearErrors() {
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
            el.setAttribute('hidden', '');
        });
    }

    /**
     * Valida CPF (alias para compatibilidade com testes)
     */
    validateCPF(cpf) {
        return validateCPF(cpf);
    }
}
