(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const root = document.getElementById('pd-root');
    const projetos = window.PROJETOS || [];
    const projeto = projetos.find((p) => p.id === id);

    if (!projeto) {
        root.querySelector('.container').innerHTML = `
            <a href="index.html#projetos" class="pd-back">&larr; Voltar para projetos</a>
            <div class="pd-head">
                <h1>Projeto não encontrado</h1>
                <p class="pd-subtitulo">O projeto que você procura não existe ou foi movido.</p>
            </div>
        `;
        document.title = 'Projeto não encontrado | Vinicius Menegussi';
        return;
    }

    document.title = `${projeto.titulo} | Vinicius Menegussi`;

    document.getElementById('pd-categoria').textContent = `Estudo de caso ${projeto.ano}`;
    document.getElementById('pd-titulo').innerHTML = `${projeto.titulo}<span class="pd-dot">.</span>`;
    document.getElementById('pd-subtitulo').textContent = projeto.subtitulo;
    document.getElementById('pd-status').textContent = projeto.status;
    document.getElementById('pd-categoria-valor').textContent = projeto.categoria;
    document.getElementById('pd-objetivo').textContent = `"${projeto.objetivo}"`;
    document.getElementById('pd-desafio').textContent = projeto.desafio;
    document.getElementById('pd-solucao').textContent = projeto.solucao;
    document.getElementById('pd-arquitetura').textContent = projeto.arquitetura;

    const tagsWrap = document.getElementById('pd-tags');
    projeto.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'pd-tag';
        span.textContent = tag;
        tagsWrap.appendChild(span);
    });

    const imageWrap = document.getElementById('pd-image-wrap');
    if (projeto.imagem) {
        imageWrap.innerHTML = `
            <picture>
                <source srcset="${projeto.imagem}" type="image/webp">
                <img src="${projeto.imagem}" alt="Interface do projeto ${projeto.titulo}" loading="eager" decoding="async">
            </picture>
        `;
    } else {
        imageWrap.classList.add('pd-image-fallback');
        imageWrap.innerHTML = `<i class="devicon-${projeto.tags.includes('Python') ? 'python-plain' : 'code-plain'} colored"></i>`;
    }

    const techList = document.getElementById('pd-tech-list');
    projeto.tags.forEach((tag) => {
        const li = document.createElement('li');
        li.setAttribute('data-tech', tag);
        li.innerHTML = `<span>${tag}</span><span class="pd-tech-check">✓</span>`;
        techList.appendChild(li);
    });

    const actions = document.getElementById('pd-actions');
    if (projeto.live) {
        const a = document.createElement('a');
        a.href = projeto.live;
        a.className = 'btn btn-fill';
        a.textContent = 'Ver ao vivo →';
        a.setAttribute('data-external-url', projeto.live);
        a.setAttribute('data-project-name', projeto.titulo);
        actions.appendChild(a);
    }
    if (projeto.github) {
        const a = document.createElement('a');
        a.href = projeto.github;
        a.className = 'btn btn-outline';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Ver no GitHub';
        actions.appendChild(a);
    }
    if (projeto.privado) {
        const p = document.createElement('p');
        p.className = 'pd-privado';
        p.innerHTML = `🔒 ${projeto.privado}`;
        actions.appendChild(p);
    }

    if (window.TechIcons) {
        window.TechIcons.inject(document);
    }

})();
