/* ========================================
   Header.js - Header com menu hamburger
   ======================================== */

const Header = {

    init() {
        this.render();
        this.attachEvents();
    },

    render() {
        const container = document.querySelector('.header-container');
        if (!container) return;

        // Gera as opções de idioma dinamicamente a partir dos idiomas registrados
        const langOptions = Language.getAvailableLanguages().map(lang => `
            <button class="header-menu-option" data-lang="${lang.code}">
                <span class="header-menu-option-check" id="langCheck_${lang.code}"></span>
                ${lang.flag} ${lang.label}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="header-left">
                <img src="img/icon.png" alt="Logo" class="header-logo">
                <span class="header-app-name">SolverBots</span>
            </div>
            <div class="header-right">
                <button class="header-menu-btn" id="headerMenuBtn" aria-label="Menu">
                    ${Icons.menu}
                </button>
            </div>

            <!-- Overlay -->
            <div class="header-menu-overlay" id="headerMenuOverlay"></div>

            <!-- Menu Dropdown -->
            <nav class="header-menu" id="headerMenu">
                
                <!-- Idioma -->
                <div class="header-menu-section">
                    <div class="header-menu-section-title">
                        ${Icons.globe}
                        <span>${t('header.language')}</span>
                    </div>
                    <div class="header-menu-options">
                        ${langOptions}
                    </div>
                </div>

                <!-- Tema -->
                <div class="header-menu-section">
                    <div class="header-menu-section-title">
                        ${Icons.palette}
                        <span>${t('header.theme')}</span>
                    </div>
                    <div class="header-menu-options">
                        <button class="header-menu-option" data-theme="light">
                            <span class="header-menu-option-check" id="themeCheckLight"></span>
                            ${t('header.themeLight')}
                        </button>
                        <button class="header-menu-option" data-theme="dark">
                            <span class="header-menu-option-check" id="themeCheckDark"></span>
                            ${t('header.themeDark')}
                        </button>
                    </div>
                </div>

                <!-- Configurações -->
                <div class="header-menu-section">
                    <div class="header-menu-section-title">
                        ${Icons.items}
                        <span>${t('header.settings')}</span>
                    </div>
                    <div class="header-menu-options">
                        <button class="header-menu-item" id="menuStorageBtn">
                            ${Icons.database}
                            <span>${t('header.storage')}</span>
                        </button>
                        <button class="header-menu-item" id="menuPeopleBtn">
                            ${Icons.user}
                            <span>${t('header.people')}</span>
                        </button>
                    </div>
                </div>

            </nav>
        `;

        this.updateChecks();
    },

    attachEvents() {
        const menuBtn = document.getElementById('headerMenuBtn');
        const overlay = document.getElementById('headerMenuOverlay');
        const menu = document.getElementById('headerMenu');

        // Reiniciar app ao clicar no logo
        const logo = document.querySelector('.header-logo');
        logo?.addEventListener('click', () => {
            location.reload();
        });

        // Toggle menu
        menuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Fechar ao clicar no overlay
        overlay?.addEventListener('click', () => this.closeMenu());

        // Fechar ao pressionar Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });

        // Idioma
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                Language.set(lang);
            });
        });

        // Re-render quando o idioma mudar
        Language.onChange(() => {
            this.render();
            this.attachEvents();
        });

        // Tema
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                Theme.set(theme);
                this.updateChecks();
            });
        });

        // Storage
        document.getElementById('menuStorageBtn')?.addEventListener('click', () => {
            this.closeMenu();
            Storage.view();
        });

        // Pessoas
        document.getElementById('menuPeopleBtn')?.addEventListener('click', () => {
            this.closeMenu();
            Persons.open();
        });
    },

    toggleMenu() {
        const menu = document.getElementById('headerMenu');
        const overlay = document.getElementById('headerMenuOverlay');
        const isOpen = menu?.classList.contains('open');

        if (isOpen) {
            this.closeMenu();
        } else {
            this.updateChecks();
            menu?.classList.add('open');
            overlay?.classList.add('open');
        }
    },

    closeMenu() {
        document.getElementById('headerMenu')?.classList.remove('open');
        document.getElementById('headerMenuOverlay')?.classList.remove('open');
    },

    updateChecks() {
        const lang = Language.current;
        const theme = Theme.current;

        // Limpar todos os checks
        document.querySelectorAll('.header-menu-option-check').forEach(el => {
            el.innerHTML = '';
        });

        // Marcar idioma ativo (dinâmico para qualquer idioma registrado)
        const langCheck = document.getElementById(`langCheck_${lang}`);
        if (langCheck) langCheck.innerHTML = Icons.checkmarkSmall;

        // Marcar tema ativo
        const themeCheckId = theme === 'dark' ? 'themeCheckDark' : 'themeCheckLight';
        const themeCheck = document.getElementById(themeCheckId);
        if (themeCheck) themeCheck.innerHTML = Icons.checkmarkSmall;
    },

};
