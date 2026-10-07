/* ═══════════════════════════════════════════════════════════
   COSMOS — Fundo 3D: buraco negro estilo "Gargantua"
   Disco de acreção quase de perfil + anel de fóton (lente gravitacional)
   Three.js (CDN) · partículas animadas na GPU via shader
   Fallback: se WebGL falhar, o grid de pontos do CSS continua.
═══════════════════════════════════════════════════════════ */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const container = document.getElementById("cosmos-bg");
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 960px)").matches;

// Densidade adaptada ao dispositivo (performance)
const QTD_DISCO = isMobile ? 14000 : 34000;
const QTD_FOTON = isMobile ? 3500 : 8000;
const QTD_HALO_LENTE = isMobile ? 2500 : 6000;
const QTD_ESTRELAS = isMobile ? 1500 : 3500;

// Paleta: branco-quente no núcleo → lavanda → violeta do portfólio
const COR_BG = new THREE.Color("#0e0e10");
const COR_BRANCO = new THREE.Color("#ffffff");
const COR_LAVANDA = new THREE.Color("#e9d5ff");
const COR_ACCENT = new THREE.Color("#8B5CF6"); // --cor-accent
const COR_FRIA = new THREE.Color("#3730a3");

const R = 2;                 // raio do horizonte de eventos (unidades locais)
const DIST_CAMERA = 20;
const FOV = 45;
const INCLINACAO = 0.09;     // quase de perfil, como na referência

let renderer;
try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
} catch (e) {
    console.warn("[cosmos] WebGL indisponível — mantendo fundo CSS.", e);
}

if (renderer && container) iniciar();

function iniciar() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(COR_BG, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 0, DIST_CAMERA);

    const texturaGlow = criarTexturaGlow();

    // ─── Materiais: partículas orbitando na GPU ───
    const materialDisco = criarMaterialOrbital(renderer.getPixelRatio(), 0.55); // com Doppler
    const materialLente = criarMaterialOrbital(renderer.getPixelRatio(), 0.0);
    const materiais = [materialDisco, materialLente];

    // ─── Buraco negro ───
    const buracoNegro = new THREE.Group();
    buracoNegro.rotation.x = INCLINACAO;
    scene.add(buracoNegro);

    // Halo difuso atrás do horizonte
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texturaGlow, color: new THREE.Color("#a78bfa"), transparent: true,
        opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    halo.scale.set(R * 6, R * 6, 1);
    buracoNegro.add(halo);

    // Horizonte de eventos: esfera preta que oculta a parte de trás do disco
    const horizonte = new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    horizonte.renderOrder = 1;
    buracoNegro.add(horizonte);

    // Disco de acreção: fino, longo, afinando nas pontas
    const disco = new THREE.Points(
        criarAnel({ qtd: QTD_DISCO, raioMin: R * 1.3, raioMax: R * 15, espessura: 0.012, concentracao: 2.6, brilho: 1.7 }),
        materialDisco
    );
    disco.renderOrder = 2;
    buracoNegro.add(disco);

    // Lente gravitacional: sempre de frente para a câmera → arcos acima e abaixo da esfera
    const grupoLente = new THREE.Group();
    const anelFoton = new THREE.Points( // anel de fóton: fino e muito brilhante
        criarAnel({ qtd: QTD_FOTON, raioMin: R * 1.02, raioMax: R * 1.14, espessura: 0, concentracao: 1.4, brilho: 2.4, tamanhoMax: 1.6 }),
        materialLente
    );
    const haloLente = new THREE.Points( // imagem lenteada do disco de trás, mais difusa
        criarAnel({ qtd: QTD_HALO_LENTE, raioMin: R * 1.14, raioMax: R * 1.7, espessura: 0, concentracao: 2.2, brilho: 0.9 }),
        materialLente
    );
    [anelFoton, haloLente].forEach((p) => {
        p.rotation.x = Math.PI / 2; // plano XY local
        p.renderOrder = 2;
        grupoLente.add(p);
    });
    scene.add(grupoLente);

    // ─── Campo de estrelas ───
    const estrelas = criarEstrelas(QTD_ESTRELAS, texturaGlow);
    scene.add(estrelas);

    // ─── Nebulosas difusas ───
    const nebulosas = new THREE.Group();
    [
        { cor: "#6d28d9", pos: [-26, 6, -45], escala: 60, op: 0.13 },
        { cor: "#1e3a8a", pos: [22, -14, -50], escala: 65, op: 0.15 },
        { cor: "#a21caf", pos: [4, 18, -55], escala: 45, op: 0.06 },
    ].forEach(({ cor, pos, escala, op }) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texturaGlow, color: new THREE.Color(cor), transparent: true,
            opacity: op, blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        s.position.set(...pos);
        s.scale.set(escala, escala, 1);
        nebulosas.add(s);
    });
    scene.add(nebulosas);

    // ─── Fundo James Webb (JWST Deep Field SMACS 0723) ───
    const jwstTexLoader = new THREE.TextureLoader();
    const jwstTex = jwstTexLoader.load('./assets/jwst-deep-field.webp', () => {
        // Redraw once loaded if prefers-reduced-motion is active
        if (reduzirMovimento) renderizar();
    });
    jwstTex.colorSpace = THREE.SRGBColorSpace;

    // Shader com desvanecimento suave nas bordas para integração perfeita
    const jwstMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uMap: { value: jwstTex },
            uOpacity: { value: isMobile ? 0.38 : 0.45 },
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D uMap;
            uniform float uOpacity;
            void main() {
                vec4 tex = texture2D(uMap, vUv);
                vec2 center = vUv - 0.5;
                float dist = length(center) * 2.0; // 0 no centro, 1 na borda
                float vignette = smoothstep(1.0, 0.35, dist);
                // Matiz levemente adaptada para realçar estrelas e galáxias distantes
                vec3 col = tex.rgb;
                gl_FragColor = vec4(col, tex.a * vignette * uOpacity);
            }
        `,
    });

    const jwstMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(160, 160),
        jwstMaterial
    );
    jwstMesh.position.set(0, 0, -85);
    scene.add(jwstMesh);


    // ─── Layout: ancora o buraco negro em pixels da tela ───
    // Desktop: faixa do topo, centralizado (livre do texto e do card do hero)
    // Mobile: atrás do título, um pouco menor
    const cameraBase = new THREE.PerspectiveCamera(FOV, 1, 0.1, 300);
    cameraBase.position.set(0, 0, DIST_CAMERA);
    cameraBase.lookAt(0, 0, 0);

    function telaParaMundo(px, py, w, h) {
        cameraBase.aspect = w / h;
        cameraBase.updateProjectionMatrix();
        const v = new THREE.Vector3((px / w) * 2 - 1, -(py / h) * 2 + 1, 0.5).unproject(cameraBase);
        const dir = v.sub(cameraBase.position).normalize();
        const t = -cameraBase.position.z / dir.z;
        return cameraBase.position.clone().add(dir.multiplyScalar(t));
    }

    let compensacao = 0;
    function posicionar() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        const desktop = w > 960;
        const raioPx = desktop ? Math.min(58, h * 0.065) : 34;   // raio visual do horizonte
        const ancoraY = desktop ? Math.max(170, h * 0.2) : h * 0.56; // mobile: entre os botões e o card
        const pxPorUnidade = h / (2 * DIST_CAMERA * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
        const escala = raioPx / (R * pxPorUnidade);

        const p = telaParaMundo(w / 2, ancoraY, w, h);
        buracoNegro.position.copy(p);
        buracoNegro.scale.setScalar(escala);
        grupoLente.position.copy(p);
        grupoLente.scale.setScalar(escala);
        // compensa o ângulo de visão (a câmera olha "de baixo" p/ o topo da tela)
        // → mantém o disco visto levemente de cima, com a faixa frontal nítida
        compensacao = Math.atan2(p.y, DIST_CAMERA);
        materiais.forEach((m) => (m.uniforms.uEscala.value = escala));
    }
    posicionar();
    window.addEventListener("resize", posicionar);

    // ─── Interação: mouse (parallax sutil) e scroll ───
    const alvo = { x: 0, y: 0, scroll: 0 };
    window.addEventListener("pointermove", (e) => {
        alvo.x = (e.clientX / window.innerWidth - 0.5) * 2;
        alvo.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    window.addEventListener("scroll", () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        alvo.scroll = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });

    // ─── Loop ───
    const relogio = new THREE.Clock();
    let rodando = true;
    let rafId;
    const atual = { x: 0, y: 0, scroll: 0 };

    function renderizar() {
        const t = relogio.getElapsedTime();
        materiais.forEach((m) => (m.uniforms.uTime.value = t));

        atual.x += (alvo.x - atual.x) * 0.04;
        atual.y += (alvo.y - atual.y) * 0.04;
        atual.scroll += (alvo.scroll - atual.scroll) * 0.05;

        camera.position.x = atual.x * 0.8;
        camera.position.y = -atual.y * 0.5;
        camera.lookAt(0, 0, 0);

        // ao rolar, o disco inclina levemente revelando mais da face
        buracoNegro.rotation.x = INCLINACAO + compensacao + atual.scroll * 0.18 + atual.y * 0.03;
        buracoNegro.rotation.z = -atual.x * 0.02;
        grupoLente.lookAt(camera.position); // lente sempre de frente

        estrelas.rotation.y = t * 0.006;
        nebulosas.rotation.z = t * 0.003;
        jwstMesh.rotation.z = t * 0.0008 + atual.scroll * 0.05;
        jwstMesh.position.x = atual.x * 2.5;
        jwstMesh.position.y = -atual.y * 1.5;

        renderer.render(scene, camera);
    }

    function loop() {
        if (!rodando) return;
        renderizar();
        rafId = requestAnimationFrame(loop);
    }

    // pausa quando a aba não está visível (economia de bateria/CPU)
    document.addEventListener("visibilitychange", () => {
        rodando = !document.hidden && !reduzirMovimento;
        if (rodando) loop(); else cancelAnimationFrame(rafId);
    });

    if (reduzirMovimento) {
        materiais.forEach((m) => (m.uniforms.uTime.value = 12));
        renderizar(); // um único frame estático
        window.addEventListener("resize", renderizar);
    } else {
        loop();
    }

    document.body.classList.add("cosmos-ativo");
    requestAnimationFrame(() => container.classList.add("visivel"));
}

/* ─── Shader de partículas orbitais (posição calculada na GPU) ─── */
function criarMaterialOrbital(pixelRatio, doppler) {
    return new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: pixelRatio },
            uEscala: { value: 1 },
            uDoppler: { value: doppler },
        },
        vertexShader: /* glsl */ `
            attribute float aRaio;
            attribute float aAngulo;
            attribute float aVelocidade;
            attribute float aTamanho;
            attribute float aAltura;
            attribute float aBrilho;
            attribute vec3 aCor;
            uniform float uTime;
            uniform float uPixelRatio;
            uniform float uEscala;
            uniform float uDoppler;
            varying vec3 vCor;
            varying float vBrilho;
            void main() {
                float ang = aAngulo + uTime * aVelocidade;
                vec3 pos = vec3(cos(ang) * aRaio, aAltura, sin(ang) * aRaio);
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mv;
                gl_PointSize = aTamanho * uPixelRatio * (34.0 / -mv.z) * (0.55 + uEscala * 0.6);
                vCor = aCor;
                // Doppler beaming: o lado que se aproxima da câmera brilha mais
                float beaming = 1.0 + uDoppler * cos(ang);
                // cintilação sutil
                float pisca = 0.8 + 0.2 * sin(uTime * 2.3 + aAngulo * 9.0);
                vBrilho = aBrilho * beaming * pisca;
            }
        `,
        fragmentShader: /* glsl */ `
            varying vec3 vCor;
            varying float vBrilho;
            void main() {
                float d = length(gl_PointCoord - 0.5);
                float a = smoothstep(0.5, 0.0, d);
                gl_FragColor = vec4(vCor, a * vBrilho);
            }
        `,
    });
}

/* ─── Geometria de um anel de partículas orbitais ─── */
function criarAnel({ qtd, raioMin, raioMax, espessura, concentracao = 1.8, brilho = 1, tamanhoMax = 2.2 }) {
    const g = new THREE.BufferGeometry();
    const raio = new Float32Array(qtd);
    const angulo = new Float32Array(qtd);
    const velocidade = new Float32Array(qtd);
    const tamanho = new Float32Array(qtd);
    const altura = new Float32Array(qtd);
    const brilhoArr = new Float32Array(qtd);
    const cor = new Float32Array(qtd * 3);
    const c = new THREE.Color();

    for (let i = 0; i < qtd; i++) {
        // mais densidade perto do horizonte
        const t = Math.pow(Math.random(), concentracao);
        const r = raioMin + t * (raioMax - raioMin);
        raio[i] = r;
        angulo[i] = Math.random() * Math.PI * 2;
        // órbitas internas mais rápidas (≈ Kepler)
        velocidade[i] = 2.2 / Math.pow(r, 1.1);
        // disco afina nas pontas: espessura cai com o raio
        altura[i] = (Math.random() - 0.5) * espessura * r * (1 - t * 0.7);
        tamanho[i] = 0.5 + Math.random() * tamanhoMax * (1 - t * 0.6);
        brilhoArr[i] = brilho * Math.pow(1 - t, 1.3) * (0.45 + Math.random() * 0.55);

        // gradiente de temperatura: branco → lavanda → violeta → índigo
        if (t < 0.08) c.copy(COR_BRANCO).lerp(COR_LAVANDA, t / 0.08);
        else if (t < 0.3) c.copy(COR_LAVANDA).lerp(COR_ACCENT, (t - 0.08) / 0.22);
        else c.copy(COR_ACCENT).lerp(COR_FRIA, (t - 0.3) / 0.7);
        cor[i * 3] = c.r; cor[i * 3 + 1] = c.g; cor[i * 3 + 2] = c.b;
    }

    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(qtd * 3), 3));
    g.setAttribute("aRaio", new THREE.BufferAttribute(raio, 1));
    g.setAttribute("aAngulo", new THREE.BufferAttribute(angulo, 1));
    g.setAttribute("aVelocidade", new THREE.BufferAttribute(velocidade, 1));
    g.setAttribute("aTamanho", new THREE.BufferAttribute(tamanho, 1));
    g.setAttribute("aAltura", new THREE.BufferAttribute(altura, 1));
    g.setAttribute("aBrilho", new THREE.BufferAttribute(brilhoArr, 1));
    g.setAttribute("aCor", new THREE.BufferAttribute(cor, 3));
    // posições reais são calculadas no shader → bounding sphere manual evita culling incorreto
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), raioMax * 1.5);
    return g;
}

/* ─── Campo de estrelas distante ─── */
function criarEstrelas(qtd, textura) {
    const pos = new Float32Array(qtd * 3);
    const cor = new Float32Array(qtd * 3);
    const paleta = ["#ffffff", "#e9d5ff", "#c7d2fe", "#fde68a"].map((h) => new THREE.Color(h));
    for (let i = 0; i < qtd; i++) {
        const r = 50 + Math.random() * 80;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos[i * 3 + 2] = r * Math.cos(ph);
        const c = paleta[Math.floor(Math.random() * paleta.length)];
        const b = 0.35 + Math.random() * 0.65;
        cor[i * 3] = c.r * b; cor[i * 3 + 1] = c.g * b; cor[i * 3 + 2] = c.b * b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(cor, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({
        size: 0.4, map: textura, vertexColors: true, transparent: true,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    }));
}

/* ─── Textura radial suave gerada em canvas (sem imagens externas) ─── */
function criarTexturaGlow() {
    const s = 128;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const ctx = cv.getContext("2d");
    const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
