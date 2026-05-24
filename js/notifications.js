/**
 * =====================================================
 * REGULASUS — NOTIFICATIONS.JS
 * Sistema de notificações toast
 * =====================================================
 */

'use strict';

class NotificationManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toastCount = 0;
    }

    /**
     * Exibe uma notificação toast
     * @param {string} message
     * @param {string} type - 'success' | 'error' | 'warning' | 'info'
     * @param {number} duration - em ms (0 = permanente)
     */
    show(message, type = 'info', duration = APP_CONFIG.TOAST_DURATION) {
        const icons = {
            success: 'fa-check-circle',
            error:   'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info:    'fa-info-circle'
        };

        const titles = {
            success: 'Sucesso',
            error:   'Erro',
            warning: 'Aviso',
            info:    'Informação'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        toast.innerHTML = `
            <div class="toast-icon" aria-hidden="true">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-body">
                <p class="toast-title">${titles[type]}</p>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" aria-label="Fechar notificação">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;

        // Botão de fechar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this._removeToast(toast);
        });

        this.container.appendChild(toast);

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => this._removeToast(toast), duration);
        }

        return toast;
    }

    /**
     * Remove um toast com animação
     * @param {HTMLElement} toast
     */
    _removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.add('toast--removing');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /** Atalho: sucesso */
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    /** Atalho: erro */
    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    /** Atalho: aviso */
    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    /** Atalho: informação */
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}
