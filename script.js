(function () {
    'use strict';

    // ─── Menu mobile ───────────────────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.textContent = isOpen ? '✕' : '☰';
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
            });
        });
    }

    // ─── Link ativo conforme a seção visível ──────────────
    const sections = document.querySelectorAll('main section[id]');
    const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length && sectionLinks.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    sectionLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                    });
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );

        sections.forEach((section) => observer.observe(section));
    }

    // ─── Copiar e-mail ─────────────────────────────────────
    const btnCopiarEmail = document.getElementById('btn-copiar-email');
    const copiarIcon = document.getElementById('copiar-icon');

    if (btnCopiarEmail) {
        btnCopiarEmail.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = 'vmenegussi08@gmail.com';

            try {
                await navigator.clipboard.writeText(email);
            } catch (err) {
                const temp = document.createElement('textarea');
                temp.value = email;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
            }

            if (copiarIcon) {
                const original = copiarIcon.textContent;
                copiarIcon.textContent = '✅';
                setTimeout(() => {
                    copiarIcon.textContent = original;
                }, 1800);
            }
        });
    }

    // ─── Efeito de digitação nas faixas de contato ────────
    // Cada elemento .contact-strip-typing roda seu próprio loop,
    // com frases vindas do atributo data-phrases (separadas por "|").
    const typingEls = document.querySelectorAll('.contact-strip-typing');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    typingEls.forEach((el, index) => {
        const frases = (el.getAttribute('data-phrases') || 'olá!')
            .split('|')
            .map((f) => f.trim())
            .filter(Boolean);

        if (reduceMotion) {
            el.textContent = frases[0];
            return;
        }

        let fraseIndex = 0;
        let charIndex = 0;
        let apagando = false;

        const tick = () => {
            const fraseAtual = frases[fraseIndex];
            let delay = apagando ? 35 : 65;

            if (!apagando && charIndex <= fraseAtual.length) {
                el.textContent = fraseAtual.slice(0, charIndex);
                charIndex++;
                if (charIndex > fraseAtual.length) {
                    apagando = true;
                    delay = 1800;
                }
            } else if (apagando && charIndex >= 0) {
                el.textContent = fraseAtual.slice(0, charIndex);
                charIndex--;
                if (charIndex < 0) {
                    apagando = false;
                    fraseIndex = (fraseIndex + 1) % frases.length;
                    charIndex = 0;
                    delay = 400;
                }
            }

            setTimeout(tick, delay);
        };

        // pequeno atraso escalonado para as faixas não digitarem em sincronia perfeita
        setTimeout(tick, index * 250);
    });

})();
