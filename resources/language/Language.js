/* ========================================
   Language.js - Sistema Multilingual (i18n)
   ======================================== */

const Language = {

    STORAGE_KEY: 'language',

    /** Idioma atual */
    current: 'en',

    /** Idiomas disponíveis registrados */
    available: {},

    /** Traduções do idioma atual */
    translations: {},

    /** Callbacks para re-render quando o idioma muda */
    listeners: [],

    /**
     * Registra um idioma no sistema.
     * Deve ser chamado por cada arquivo de idioma (pt.js, en.js, es.js, etc.)
     * @param {string} code - Código do idioma (ex: 'pt', 'en', 'es')
     * @param {object} data - Objeto com { label, flag, translations }
     */
    register(code, data) {
        this.available[code] = {
            code,
            label: data.label,
            flag: data.flag || '',
            translations: data.translations,
        };
    },

    /**
     * Inicializa o sistema de idiomas.
     * Detecta idioma salvo ou do navegador.
     */
    init() {
        this.current = this.getSavedLanguage();
        this.translations = this.available[this.current]?.translations || {};

        // Persiste o idioma inicial na primeira execução (quando não houver valor salvo)
        if (Storage.get(this.STORAGE_KEY) !== this.current) {
            Storage.set(this.STORAGE_KEY, this.current);
        }

        // Atualiza o atributo lang do HTML
        const langMap = { en: 'en', pt: 'pt-BR', es: 'es' };
        document.documentElement.lang = langMap[this.current] || this.current;

        // Atualiza elementos data-i18n após o DOM estar pronto
        requestAnimationFrame(() => this.updateDOM());
    },

    /**
     * Retorna o idioma salvo, do navegador, ou o padrão 'en'.
     */
    getSavedLanguage() {
        const saved = Storage.get(this.STORAGE_KEY);
        if (saved && this.available[saved]) return saved;

        // Detecta idioma do navegador
        const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
        if (this.available[browserLang]) return browserLang;

        // Fallback
        return 'en';
    },

    /**
     * Traduz uma chave. Suporta chaves aninhadas com ponto: 'header.theme'
     * @param {string} key - Chave de tradução (ex: 'header.language')
     * @param {object} [params] - Parâmetros para substituição: { count: 5 } → {count} no texto
     * @returns {string} Texto traduzido ou a chave se não encontrada
     */
    t(key, params = {}) {
        let value = this.resolve(key, this.translations);

        // Fallback: tenta no primeiro idioma disponível
        if (value === undefined) {
            const fallbackLang = Object.keys(this.available)[0];
            if (fallbackLang) {
                value = this.resolve(key, this.available[fallbackLang].translations);
            }
        }

        // Se ainda não encontrou, retorna a chave
        if (value === undefined) return `[${key}]`;

        // Substituição de parâmetros: {param}
        if (params && typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
            });
        }

        return value;
    },

    /**
     * Resolve chave aninhada: 'a.b.c' → obj.a.b.c
     */
    resolve(key, obj) {
        if (!obj) return undefined;
        return key.split('.').reduce((acc, part) => acc?.[part], obj);
    },

    /**
     * Define o idioma ativo.
     * @param {string} lang - Código do idioma
     */
    set(lang) {
        if (!this.available[lang]) return;

        this.current = lang;
        this.translations = this.available[lang].translations;
        Storage.set(this.STORAGE_KEY, lang);

        // Atualiza o atributo lang do HTML
        const langMap = { en: 'en', pt: 'pt-BR', es: 'es' };
        document.documentElement.lang = langMap[lang] || lang;

        // Notifica todos os listeners
        this.notify();
    },

    /**
     * Registra um callback para ser chamado quando o idioma mudar.
     * @param {Function} callback
     */
    onChange(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    },

    /**
     * Notifica todos os listeners registrados e atualiza o DOM.
     */
    notify() {
        this.updateDOM();
        this.listeners.forEach(fn => {
            try { fn(this.current); } catch (e) { console.error('Language listener error:', e); }
        });
    },

    /**
     * Atualiza automaticamente todos os elementos com atributo data-i18n.
     * - data-i18n="chave" → atualiza textContent
     * - data-i18n-html="chave" → atualiza innerHTML
     * - data-i18n-placeholder="chave" → atualiza placeholder
     * - data-i18n-title="chave" → atualiza title
     * Uso: <span data-i18n="footer.text"></span>
     */
    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) el.innerHTML = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.placeholder = this.t(key);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) el.title = this.t(key);
        });
    },

    /**
     * Retorna a lista de idiomas disponíveis para exibição.
     * @returns {Array<{code, label, flag}>}
     */
    getAvailableLanguages() {
        const preferredOrder = ['en', 'pt', 'es'];
        const ordered = preferredOrder
            .map(code => this.available[code])
            .filter(Boolean);

        const remaining = Object.values(this.available)
            .filter(lang => !preferredOrder.includes(lang.code));

        return [...ordered, ...remaining]
            .map(({ code, label, flag }) => ({ code, label, flag }));
    },
};

// Atalho global para tradução
const t = (key, params) => Language.t(key, params);
