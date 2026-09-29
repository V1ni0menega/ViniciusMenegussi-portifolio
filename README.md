# >_ Vinicius Menegussi | Portfolio

<div align="center">

![Deploy Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Design](https://img.shields.io/badge/Design-DVLPR%20Style-8B5CF6?style=for-the-badge)
![Acessibilidade](https://img.shields.io/badge/WCAG-AA%20Compliant-00C853?style=for-the-badge)

<p align="center">
  <strong>Portfólio interativo de alta fidelidade desenvolvido com Vanilla Web puro (HTML5, CSS3 e JavaScript).</strong><br>
  Interface imersiva dark mode inspirada na estética do <a href="https://dvlpr.pro" target="_blank">dvlpr.pro</a>, com navegação por seções, showcase slider e mockups realistas de sistemas em produção.
</p>

[🌐 Acessar Portfólio](#) • [💼 LinkedIn](https://www.linkedin.com/in/vinicius-menegussi-dev) • [🐙 GitHub](https://github.com/V1ni0menega)

</div>

---

## ✨ Destaques & Funcionalidades

- **Design System Tailored**: Identidade visual escura (`#0e0e10`), grade de pontos decorativa (*dot-matrix*), paleta violeta neônio (`#8B5CF6`) e tipografia responsiva fluida com `clamp()`.
- **Navegação por Seções com Scroll Snap**: Transições suaves e ancoragem precisa entre as seções:
  - `00 // HOME` (Hero interativo com card de código flutuante)
  - `01 // SOBRE` (Trajetória, impacto público real e pilares de engenharia)
  - `02 // SKILLS` (Grid moderno de tecnologias centrais)
  - `03 // PROJETOS` (Showcase Slider interativo)
  - `04 // CONTATO` (Canais de conexão direta e redes)
- **Showcase Slider Escalável**:
  - Slider fullscreen com suporte a arrastar com o mouse (*drag*), gestos de toque (*swipe* mobile), setas do teclado e roda do mouse (*wheel*).
  - Cálculo dinâmico de paginação e geração automatizada de indicadores no DOM.
- **Mockups de Navegador com Prints Reais**:
  - Apresentação fiel de sistemas municipais e corporativos em produção (Portal PMA, ViewVerde, Painel Público Esteio).
  - Decisão técnica que substitui `iframes`, protegendo cotas de infraestrutura e evitando bloqueios de `X-Frame-Options`.
- **Arquitetura Modular `shared/`**:
  - Componente global `window.Modal` desacoplado, com travamento de scroll (`overflow: hidden`), fechamento com `Escape` ou clique externo, e conformidade com WAI-ARIA.
  - Alerta de redirecionamento seguro ao clicar em links externos de produção.
- **Zero Dependências Externas**: Código 100% nativo, leve, veloz e otimizado para carregamento instantâneo.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend Core:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Grid, Flexbox, Scroll Snap), JavaScript ES6+ (IIFE, Data Attributes).
- **Ícones & Tipografia:** [Devicon CDN](https://devicon.dev/) para tecnologias, Google Fonts (Inter & JetBrains Mono).
- **Hospedagem & CI/CD:** [Vercel](https://vercel.com/) com deploy contínuo integrado ao GitHub.

---

## 📁 Estrutura do Projeto

```text
ViniciusMenegussi-portifolio/
├── assets/                          # Screenshots reais, imagens e avatar
│   ├── pma-preview.png              # Interface do Portal PMA (Prefeitura de Esteio)
│   ├── viewverde-pre-view.png       # Interface da plataforma ViewVerde
│   ├── painel-preview.png           # Dashboard do Painel Público Esteio
│   ├── hero-dev-transparent.png     # Ilustração do desenvolvedor
│   └── avatar.jpg                   # Foto de perfil profissional
├── shared/                          # Componentes utilitários desacoplados
│   ├── modal.css                    # Estilos encapsulados de janelas modais
│   └── modal.js                     # Gerenciador global e acessível de modais
├── index.html                       # Estrutura semântica e acessível (WCAG AA)
├── style.css                        # Design System, variáveis CSS e layouts
├── script.js                        # Lógica de slider, navegação e scroll observer
└── README.md                        # Documentação do projeto
```

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/V1ni0menega/ViniciusMenegussi-portifolio.git
   cd ViniciusMenegussi-portifolio
   ```

2. **Abra no navegador:**
   - Basta abrir o arquivo `index.html` diretamente no seu navegador, ou:
   - Use a extensão **Live Server** no VS Code, ou:
   - Execute com qualquer servidor estático local:
     ```bash
     npx serve .
     ```

---

## ☁️ Deploy na Vercel

Este projeto está pronto para a Vercel com **Zero Configuração**:
1. Conecte sua conta do GitHub na [Vercel](https://vercel.com/).
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório `ViniciusMenegussi-portifolio`.
4. Mantenha as configurações padrão (Root Directory: `./`, Framework Preset: `Other`).
5. Clique em **Deploy**! A cada `git push origin main`, uma nova versão é publicada automaticamente.

---

## 👤 Autor

**Vinicius Menegussi**  
Desenvolvedor Fullstack | ResTIC55 & Dell Technologies  
- **LinkedIn:** [linkedin.com/in/vinicius-menegussi-dev](https://www.linkedin.com/in/vinicius-menegussi-dev)  
- **GitHub:** [@V1ni0menega](https://github.com/V1ni0menega)  
- **E-mail:** [vmenegussi08@gmail.com](mailto:vmenegussi08@gmail.com)

---

<div align="center">
  <sub>Feito com foco em performance, acessibilidade e engenharia de software limpa.</sub>
</div>
