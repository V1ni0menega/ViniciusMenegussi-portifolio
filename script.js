// ═══════════════════════════════════════════════════════════
// PORTFÓLIO VINICIUS MENEGUSSI — JAVASCRIPT (dvlpr.pro style)
// ═══════════════════════════════════════════════════════════

// ─── 1. Navegação de Seções & Scroll Spy Preciso ───
const sectionIds = ['hero', 'sobre', 'skills', 'projetos', 'contato'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const sidebarItems = document.querySelectorAll('.sidebar-item');
const scrollIndicator = document.getElementById('scroll-indicator');
const scrollText = scrollIndicator.querySelector('.scroll-indicator-text');
const scrollIcon = scrollIndicator.querySelector('.scroll-indicator-icon');

let secaoAtualIndex = 0;
let projetosVisivel = false;
let isNavigating = false;

// Calcula com precisão qual seção está no foco visual da tela (sem pular nenhuma)
function getSecaoAtualIndex() {
    const scrollPos = window.scrollY + (window.innerHeight * 0.45);
    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollPos) {
            activeIdx = i;
        }
    }
    return activeIdx;
}

function sincronizarEstadoNavegacao() {
    const currentIdx = getSecaoAtualIndex();
    secaoAtualIndex = currentIdx;
    const currentId = sectionIds[currentIdx];
    projetosVisivel = (currentId === 'projetos');

    // Atualiza sidebar ativa
    sidebarItems.forEach((item, idx) => {
        if (idx === currentIdx) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Atualiza indicador inferior direito
    if (currentId === 'contato') {
        scrollText.textContent = 'BACK TO TOP';
        scrollIcon.innerHTML = '&uarr;';
        scrollIndicator.setAttribute('href', '#hero');
    } else {
        const nextId = sectionIds[currentIdx + 1] || 'hero';
        scrollText.textContent = 'SCROLL DOWN';
        scrollIcon.innerHTML = '&darr;';
        scrollIndicator.setAttribute('href', `#${nextId}`);
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(sincronizarEstadoNavegacao);
}, { passive: true });

// Navegação suave entre seções
function navegarSecao(direcao) {
    if (isNavigating) return;
    const currentIdx = getSecaoAtualIndex();
    const destIndex = currentIdx + direcao;
    if (destIndex < 0 || destIndex >= sectionIds.length) return;

    isNavigating = true;
    const destEl = sections[destIndex];
    if (destEl) {
        destEl.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
        isNavigating = false;
        sincronizarEstadoNavegacao();
    }, 800);
}

// Clique nos itens da sidebar
sidebarItems.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        isNavigating = true;
        sections[idx].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isNavigating = false;
            sincronizarEstadoNavegacao();
        }, 800);
    });
});

// Clique no scroll indicator
scrollIndicator.addEventListener('click', (e) => {
    e.preventDefault();
    const currentIdx = getSecaoAtualIndex();
    if (currentIdx === sections.length - 1) {
        isNavigating = true;
        sections[0].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isNavigating = false;
            sincronizarEstadoNavegacao();
        }, 800);
    } else {
        navegarSecao(+1);
    }
});

// Atalhos de teclado (↑ / ↓ / PageUp / PageDown / ← / →)
document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (window.Modal && window.Modal.isOpen()) return;

    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            navegarSecao(+1);
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            navegarSecao(-1);
            break;
        case 'ArrowRight':
            if (projetosVisivel) {
                e.preventDefault();
                updateSlider(currentSlide + 1);
            }
            break;
        case 'ArrowLeft':
            if (projetosVisivel) {
                e.preventDefault();
                updateSlider(currentSlide - 1);
            }
            break;
    }
});

// ─── 2. Slider Horizontal de Projetos (dvlpr.pro style) ───
const track = document.getElementById('slider-track');
const slides = document.querySelectorAll('.slide-projeto');
const prevBtn = document.getElementById('proj-prev');
const nextBtn = document.getElementById('proj-next');
const counterEl = document.getElementById('slide-current');
const totalEl = document.getElementById('slide-total');
const dotsContainer = document.querySelector('.slider-dots');
let currentSlide = 0;
const totalSlides = slides.length;

// Sincroniza contador total dinamicamente
if (totalEl) {
    totalEl.textContent = String(totalSlides).padStart(2, '0');
}

// Gera dots dinamicamente baseado na quantidade de slides
if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `dot-indicator${i === 0 ? ' active' : ''}`;
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', `Ir para projeto ${i + 1}`);
        dot.addEventListener('click', () => updateSlider(i));
        dotsContainer.appendChild(dot);
    }
}

function updateSlider(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
    });

    const allDots = dotsContainer ? dotsContainer.querySelectorAll('.dot-indicator') : [];
    allDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });

    if (counterEl) {
        counterEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
}

if (prevBtn) prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));

// Suporte a swipe touch / drag
let startX = 0, dist = 0;
const viewport = document.getElementById('slider-viewport');

viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dist = 0;
}, { passive: true });

viewport.addEventListener('touchmove', (e) => {
    dist = e.touches[0].clientX - startX;
}, { passive: true });

viewport.addEventListener('touchend', () => {
    if (Math.abs(dist) > 50) {
        if (dist < 0) updateSlider(currentSlide + 1);
        else updateSlider(currentSlide - 1);
    }
});

// Scroll do mouse sobre o slider de projetos
let scrollCooldown = false;
viewport.addEventListener('wheel', (e) => {
    if (scrollCooldown) return;

    // Se estiver rolando para baixo no último slide, permite descer para contato
    if (e.deltaY > 0 && currentSlide === totalSlides - 1) {
        return;
    }
    // Se estiver rolando para cima no primeiro slide, permite subir para skills
    if (e.deltaY < 0 && currentSlide === 0) {
        return;
    }

    e.preventDefault();
    scrollCooldown = true;
    if (e.deltaY > 0 || e.deltaX > 0) {
        updateSlider(currentSlide + 1);
    } else {
        updateSlider(currentSlide - 1);
    }
    setTimeout(() => { scrollCooldown = false; }, 600);
}, { passive: false });

// Drag com mouse no slider
let mouseDown = false, mouseStartX = 0, mouseDist = 0;

viewport.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseStartX = e.clientX;
    mouseDist = 0;
    viewport.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    viewport.style.cursor = '';
    if (Math.abs(mouseDist) > 60) {
        if (mouseDist < 0) updateSlider(currentSlide + 1);
        else updateSlider(currentSlide - 1);
    }
});

document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    mouseDist = e.clientX - mouseStartX;
});

// Inicialização
sincronizarEstadoNavegacao();

// ─── 4. Cópia Rápida de E-mail com Feedback Visual ───
const btnCopiarEmail = document.getElementById('btn-copiar-email');
const emailVinicius = 'vmenegussi08@gmail.com';

function copiarEmailParaClipboard(e) {
    if (e) e.preventDefault();

    function darFeedback() {
        if (!btnCopiarEmail) return;
        const textoEl = document.getElementById('copiar-texto');
        const iconEl = document.getElementById('copiar-icon');

        btnCopiarEmail.classList.add('copiado');
        if (textoEl) textoEl.textContent = 'Copiado!';
        if (iconEl) iconEl.textContent = '✓';

        setTimeout(() => {
            btnCopiarEmail.classList.remove('copiado');
            if (textoEl) textoEl.textContent = 'Copiar';
            if (iconEl) iconEl.textContent = '📋';
        }, 2200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailVinicius)
            .then(darFeedback)
            .catch(() => fallbackCopiar(emailVinicius, darFeedback));
    } else {
        fallbackCopiar(emailVinicius, darFeedback);
    }
}

function fallbackCopiar(texto, callback) {
    const tempInput = document.createElement('textarea');
    tempInput.value = texto;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    tempInput.style.top = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        if (typeof callback === 'function') callback();
    } catch (err) {
        console.error('Falha ao copiar:', err);
    }
    document.body.removeChild(tempInput);
}

if (btnCopiarEmail) {
    btnCopiarEmail.addEventListener('click', copiarEmailParaClipboard);
}

