/**
 * =====================================================
 * REGULASUS — UTILS.JS
 * Funções utilitárias reutilizáveis
 * =====================================================
 */

'use strict';

/**
 * Formata uma data ISO (YYYY-MM-DD) para o padrão brasileiro (DD/MM/AAAA)
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
    if (!dateString) return '—';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Formata um número de telefone para o padrão (XX) XXXXX-XXXX
 * @param {string} phone
 * @returns {string}
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

/**
 * Formata CPF: aplica máscara XXX.XXX.XXX-XX
 * @param {string} cpf
 * @returns {string}
 */
function formatCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Valida formato de CPF (apenas 11 dígitos numéricos)
 * @param {string} cpf
 * @returns {boolean}
 */
function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
}

/**
 * Valida formato de e-mail
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} str
 * @returns {string}
 */
function titleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Trunca um texto longo com reticências
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(text, maxLength = 60) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
}

/**
 * Retorna o label de prioridade formatado
 * @param {string} priority
 * @returns {string}
 */
function getPriorityLabel(priority) {
    const labels = {
        urgencia:   'Urgência',
        emergencia: 'Emergência',
        rotina:     'Rotina',
        media:      'Média',
        baixa:      'Baixa'
    };
    return labels[priority] || priority;
}

/**
 * Retorna a classe CSS de badge para prioridade
 * @param {string} priority
 * @returns {string}
 */
function getPriorityBadgeClass(priority) {
    const classes = {
        urgencia:   'badge--danger',
        emergencia: 'badge--danger',
        rotina:     'badge--info',
        media:      'badge--warning',
        baixa:      'badge--gray'
    };
    return classes[priority] || 'badge--gray';
}

/**
 * Retorna a classe CSS de badge para status de encaminhamento
 * @param {string} status
 * @returns {string}
 */
function getStatusBadgeClass(status) {
    const classes = {
        pendente:   'badge--warning',
        autorizado: 'badge--success',
        rejeitado:  'badge--danger',
        agendado:   'badge--info'
    };
    return classes[status] || 'badge--gray';
}

/**
 * Retorna o label de status formatado
 * @param {string} status
 * @returns {string}
 */
function getStatusLabel(status) {
    const labels = {
        pendente:   'Pendente',
        autorizado: 'Autorizado',
        rejeitado:  'Rejeitado',
        agendado:   'Agendado',
        ativo:      'Ativo',
        inativo:    'Inativo'
    };
    return labels[status] || titleCase(status);
}

/**
 * Cria um debounce para uma função
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Obtém as iniciais de um nome (máximo 2 letras)
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Aplica máscara de CPF em tempo real
 * @param {HTMLInputElement} input
 */
function applyCPFMask(input) {
    input.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        value = value
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        this.value = value;
    });
}

/**
 * Aplica máscara de telefone em tempo real
 * @param {HTMLInputElement} input
 */
function applyPhoneMask(input) {
    input.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length <= 10) {
            value = value
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }
        this.value = value;
    });
}

/**
 * Retorna a data atual no formato YYYY-MM-DD
 * @returns {string}
 */
function getTodayISO() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param {string} dateStr1
 * @param {string} dateStr2
 * @returns {number}
 */
function daysBetween(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    return Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)));
}
