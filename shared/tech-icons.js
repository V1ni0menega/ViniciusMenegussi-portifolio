/**
 * ═══════════════════════════════════════════════════════════
 * SHARED COMPONENT: TECH ICONS AUTO-INHERIT (Devicons)
 * Residencia Fullstack — Frontend Challenge
 * ═══════════════════════════════════════════════════════════
 * 
 * Injeta automaticamente os ícones oficiais do Devicon nos
 * itens de tecnologia (<li> dentro de .slide-stack ou elementos
 * com [data-tech]), evitando repetição manual de tags <i> no HTML.
 */

(function (window, document) {
    'use strict';

    const ICON_MAP = [
        // Linguagens & Frameworks Frontend
        { match: /\b(angular material|angular 21|angularjs|angular)\b/i, icon: 'devicon-angularjs-plain colored' },
        { match: /\b(react 19\.2|react 19|react icons|lucide react|react|reactjs)\b/i, icon: 'devicon-react-original colored' },
        { match: /\b(vite 8\.0|vite 8|vite|vitejs)\b/i, icon: 'devicon-vitejs-plain colored' },
        { match: /\b(streamlit)\b/i, icon: 'devicon-streamlit-plain colored' },
        { match: /\b(typescript|ts)\b/i, icon: 'devicon-typescript-plain colored' },
        { match: /\b(javascript vanilla|vanilla js|javascript|js)\b/i, icon: 'devicon-javascript-plain colored' },
        { match: /\b(tailwind 4\.2|tailwindcss|tailwind)\b/i, icon: 'devicon-tailwindcss-plain colored' },
        { match: /\b(html|html5|html semântico)\b/i, icon: 'devicon-html5-plain colored' },
        { match: /\b(css|css3|css moderno|vanilla css|css vanilla)\b/i, icon: 'devicon-css3-plain colored' },
        { match: /\b(eleventy|11ty)\b/i, icon: 'devicon-eleventy-plain colored' },
        { match: /\b(storybook)\b/i, icon: 'devicon-storybook-plain colored' },
        { match: /\b(google icons|google ai sdk|google|gemini 3\.7 flash|gemini 3\.7|gemini)\b/i, icon: 'devicon-google-plain colored' },
        { match: /\b(eslint 9\.39|eslint)\b/i, icon: 'devicon-eslint-plain colored' },
        { match: /\b(chart\.js|chartjs|chart)\b/i, icon: 'devicon-chartjs-plain colored' },

        // Linguagens & Frameworks Backend
        { match: /\b(java 25|java)\b/i, icon: 'devicon-java-plain colored' },
        { match: /\b(spring boot 3|spring boot|spring cloud|spring gateway|spring security|spring)\b/i, icon: 'devicon-spring-plain colored' },
        { match: /\b(node\.js|nodejs|node)\b/i, icon: 'devicon-nodejs-plain colored' },
        { match: /\b(python)\b/i, icon: 'devicon-python-plain colored' },
        { match: /\b(fastapi)\b/i, icon: 'devicon-fastapi-plain colored' },
        { match: /\b(pandas|pandas etl)\b/i, icon: 'devicon-pandas-plain colored' },
        { match: /\b(rest apis|rest api|rest)\b/i, icon: 'devicon-spring-plain colored' },
        { match: /\b(jpa)\b/i, icon: 'devicon-spring-plain colored' },
        { match: /\b(hibernate)\b/i, icon: 'devicon-hibernate-plain colored' },

        // Bancos de Dados & Caches
        { match: /\b(postgresql|postgres|postgis)\b/i, icon: 'devicon-postgresql-plain colored' },
        { match: /\b(mysql)\b/i, icon: 'devicon-mysql-plain colored' },
        { match: /\b(mongodb|mongo)\b/i, icon: 'devicon-mongodb-plain colored' },
        { match: /\b(redis|redis cache)\b/i, icon: 'devicon-redis-plain colored' },
        { match: /\b(prisma|prisma orm)\b/i, icon: 'devicon-prisma-original colored' },
        { match: /\b(graphql)\b/i, icon: 'devicon-graphql-plain colored' },

        // DevOps, Infra & Ferramentas
        { match: /\b(docker|docker compose)\b/i, icon: 'devicon-docker-plain colored' },
        { match: /\b(linux)\b/i, icon: 'devicon-linux-plain' },
        { match: /\b(nginx|nginx proxy)\b/i, icon: 'devicon-nginx-original colored' },
        { match: /\b(github actions|github)\b/i, icon: 'devicon-github-original' },
        { match: /\b(git core|git)\b/i, icon: 'devicon-git-plain colored' },
        { match: /\b(swagger|openapi)\b/i, icon: 'devicon-swagger-plain colored' },
        { match: /\b(sonarqube)\b/i, icon: 'devicon-sonarqube-plain colored' },
        { match: /\b(junit 5|junit)\b/i, icon: 'devicon-junit-plain colored' },
        { match: /\b(mockito)\b/i, icon: 'devicon-java-plain colored' },
        { match: /\b(shell script|shell|bash|terminal cli|terminal linux|terminal)\b/i, icon: 'devicon-bash-plain' },
        { match: /\b(websocket|websockets)\b/i, icon: 'devicon-socketio-original colored' }
    ];

    const TechIcons = {
        /**
         * Retorna a classe do Devicon a partir de um nome de tecnologia
         * @param {string} techName 
         * @returns {string|null}
         */
        getIconClass(techName) {
            if (!techName) return null;
            const clean = techName.trim();
            for (const item of ICON_MAP) {
                if (item.match.test(clean)) {
                    return item.icon;
                }
            }
            return null;
        },

        /**
         * Injeta os ícones em todos os itens de stack que ainda não possuem <i>
         * @param {HTMLElement|Document} root 
         */
        inject(root = document) {
            const items = root.querySelectorAll('.slide-stack li, [data-tech]');
            items.forEach(li => {
                // Se já contiver um ícone ou tag <i>, ignora
                if (li.querySelector('i')) return;

                const textKey = li.getAttribute('data-tech') || li.textContent.trim();
                const iconClass = TechIcons.getIconClass(textKey);

                if (iconClass) {
                    const iconEl = document.createElement('i');
                    iconEl.className = iconClass;
                    iconEl.setAttribute('aria-hidden', 'true');
                    li.insertBefore(iconEl, li.firstChild);
                    iconEl.insertAdjacentText('afterend', ' ');
                }
            });
        },

        map: ICON_MAP
    };

    // Auto-executa no DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TechIcons.inject());
    } else {
        TechIcons.inject();
    }

    // Exporta globalmente
    window.TechIcons = TechIcons;

})(window, document);
