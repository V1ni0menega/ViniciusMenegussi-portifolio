/**
 * ═══════════════════════════════════════════════════════════
 * SHARED COMPONENT: MODAL & EXTERNAL REDIRECT CONFIRMATION
 * Residencia Fullstack — Frontend Challenge
 * ═══════════════════════════════════════════════════════════
 * 
 * Gerencia ciclo de vida, acessibilidade, bloqueio de scroll,
 * atalhos de teclado (Escape/Enter) e eventos declarativos.
 */

(function (window, document) {
    'use strict';

    let currentOpenModal = null;
    let pendingRedirectUrl = null;

    const Modal = {
        /**
         * Retorna se há algum modal aberto no momento
         */
        isOpen() {
            return !!currentOpenModal;
        },

        /**
         * Abre um modal pelo elemento ou seletor/ID
         * @param {HTMLElement|string} modalTarget
         */
        open(modalTarget) {
            const modal = typeof modalTarget === 'string' 
                ? (modalTarget.startsWith('#') || modalTarget.startsWith('.') 
                    ? document.querySelector(modalTarget) 
                    : document.getElementById(modalTarget))
                : modalTarget;

            if (!modal) return;

            // Fecha modal anterior se houver
            if (currentOpenModal && currentOpenModal !== modal) {
                Modal.close(currentOpenModal);
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            currentOpenModal = modal;

            // Foco acessível no botão primário ou botão de fechar
            const focusTarget = modal.querySelector('.btn-modal-confirmar, [data-modal-focus], .modal-btn-close');
            if (focusTarget) {
                setTimeout(() => focusTarget.focus(), 60);
            }

            // Dispara evento customizado
            modal.dispatchEvent(new CustomEvent('modal:open', { bubbles: true, detail: { modal } }));
        },

        /**
         * Fecha um modal específico ou o modal atualmente aberto
         * @param {HTMLElement|string} [modalTarget]
         */
        close(modalTarget) {
            const modal = modalTarget 
                ? (typeof modalTarget === 'string' 
                    ? (modalTarget.startsWith('#') || modalTarget.startsWith('.') 
                        ? document.querySelector(modalTarget) 
                        : document.getElementById(modalTarget)) 
                    : modalTarget)
                : currentOpenModal;

            if (!modal) return;

            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            if (currentOpenModal === modal) {
                currentOpenModal = null;
                pendingRedirectUrl = null;
            }

            modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true, detail: { modal } }));
        },

        /**
         * Abre o modal de redirecionamento para link externo
         * @param {Object} options - { url, projectName, onConfirm }
         */
        confirmExternalLink({ url, projectName = 'Site Externo', onConfirm } = {}) {
            if (!url) return;

            const modal = document.getElementById('modal-link-externo');
            if (!modal) {
                // Fallback de segurança se o modal não estiver no DOM
                if (window.confirm(`Você será redirecionado para a aplicação:\n${url}\n\nDeseja continuar?`)) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                return;
            }

            pendingRedirectUrl = url;

            const urlDisplay = modal.querySelector('#modal-ext-url-display');
            if (urlDisplay) urlDisplay.textContent = url;

            const subtitulo = modal.querySelector('#modal-ext-subtitulo');
            if (subtitulo) subtitulo.textContent = `Acesso à aplicação ${projectName}`;

            // Configura callback de confirmação
            const btnConfirmar = modal.querySelector('#modal-ext-btn-confirmar');
            if (btnConfirmar) {
                btnConfirmar.onclick = (e) => {
                    e.preventDefault();
                    if (typeof onConfirm === 'function') {
                        onConfirm(url);
                    } else {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                    Modal.close(modal);
                };
            }

            Modal.open(modal);
        },

        /**
         * Inicializa listeners globais e bindings declarativos
         */
        init() {
            // Fecha modal ao clicar em elementos com [data-modal-close] ou backdrop
            document.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('[data-modal-close]');
                if (closeBtn) {
                    e.preventDefault();
                    Modal.close();
                    return;
                }

                // Clicar fora do card (no overlay/backdrop direto)
                if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop')) {
                    e.preventDefault();
                    Modal.close();
                    return;
                }

                // Gatilho declarativo [data-modal-target]
                const openTrigger = e.target.closest('[data-modal-target]');
                if (openTrigger) {
                    e.preventDefault();
                    const targetId = openTrigger.getAttribute('data-modal-target');
                    Modal.open(targetId);
                    return;
                }

                // Mockups e elementos com data-external-url
                const externalTrigger = e.target.closest('[data-external-url], .link-externo-confirm');
                if (externalTrigger) {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = externalTrigger.getAttribute('data-external-url') || externalTrigger.getAttribute('href');
                    const name = externalTrigger.getAttribute('data-project-name') || 'Site Externo';
                    if (url && url !== '#') {
                        Modal.confirmExternalLink({ url, projectName: name });
                    }
                }
            });

            // Teclado: Escape fecha o modal ativo
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && Modal.isOpen()) {
                    e.preventDefault();
                    Modal.close();
                }
            });
        }
    };

    // Auto-inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Modal.init());
    } else {
        Modal.init();
    }

    // Exporta para escopo global
    window.Modal = Modal;

})(window, document);
