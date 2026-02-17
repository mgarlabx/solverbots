/* ========================================
   Theme.js - Sistema de Dark/Light Mode
   ======================================== */

const Theme = {

    STORAGE_KEY: 'theme',
    
    /** Tema atual: 'light' ou 'dark' */
    current: 'light',

    /**
        * Inicializa o sistema de tema.
        * Detecta preferência salva ou usa light como padrão.
     */
    init() {
        this.current = this.getSavedTheme();
        this.apply(this.current);
        this.listenSystemChange();
    },

    /**
     * Retorna o tema salvo ou light como padrão.
     */
    getSavedTheme() {
        const saved = Storage.get(this.STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
        return 'light';
    },

    /**
     * Aplica o tema no documento.
     */
    apply(theme) {
        this.current = theme;
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set(this.STORAGE_KEY, theme);
        
        // Atualiza meta theme-color para mobile
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f8fafc');
        }
    },

    /**
     * Alterna entre dark e light.
     */
    toggle() {
        const next = this.current === 'dark' ? 'light' : 'dark';
        this.apply(next);
    },

    /**
     * Escuta mudanças de preferência do sistema operacional.
     */
    listenSystemChange() {
        if (!window.matchMedia) return;
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Só muda automaticamente se o usuário não definiu preferência manualmente
            if (!Storage.get(this.STORAGE_KEY)) {
                this.apply(e.matches ? 'dark' : 'light');
            }
        });
    },

    /**
     * Define um tema específico programaticamente.
     * @param {'light'|'dark'} theme
     */
    set(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.apply(theme);
        }
    },

    /**
     * Verifica se o tema atual é dark.
     */
    get isDark() {
        return this.current === 'dark';
    },

    /**
     * Reseta para a preferência do sistema.
     */
    reset() {
        Storage.del(this.STORAGE_KEY);
        const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.apply(systemTheme);
    },

};
