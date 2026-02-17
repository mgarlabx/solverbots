/* ========================================
   Buttons.js - Sistema de Botões Reutilizáveis
   ======================================== */

const Buttons = {

    // ── SVG do Spinner ─────────────────────
    get spinnerSVG() {
        return `<span class="btn-spinner"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" stroke-dashoffset="10"/></svg></span>`;
    },

    get dotsLoaderHTML() {
        return `<span class="btn-dots" aria-hidden="true"><span class="btn-dot"></span><span class="btn-dot"></span><span class="btn-dot"></span></span>`;
    },

    // ── Criar Botão ────────────────────────
    // Retorna um HTMLButtonElement configurado
    //
    // Opções:
    //   text      {string}   - Texto do botão (ex: "Salvar")
    //   icon      {string}   - HTML do ícone SVG (ex: Icons.trash)
    //   variant   {string}   - "primary" | "secondary" | "danger" | "ghost" (default: "primary")
    //   size      {string}   - "sm" | "md" | "lg" (default: "md")
    //   tooltip   {string}   - Texto do tooltip (aparece ao hover)
    //   tooltipPos {string}  - "top" | "bottom" (default: "top")
    //   onClick   {function} - Handler de clique
    //   id        {string}   - ID do elemento
    //   classList {string[]} - Classes CSS adicionais
    //   disabled  {boolean}  - Se o botão começa desativado
    //   type      {string}   - Tipo do botão: "button" | "submit" | "reset" (default: "button")
    //
    create(options = {}) {
        const {
            text = '',
            icon = '',
            variant = 'primary',
            size = 'md',
            tooltip = '',
            tooltipPos = 'top',
            onClick = null,
            id = '',
            classList = [],
            disabled = false,
            type = 'button',
        } = options;

        const btn = document.createElement('button');
        btn.type = type;
        btn.className = `btn btn-${variant} btn-${size}`;

        if (id) btn.id = id;
        if (disabled) btn.disabled = true;
        if (onClick) btn.addEventListener('click', onClick);

        classList.forEach(cls => btn.classList.add(cls));

        // Tooltip
        if (tooltip) {
            btn.setAttribute('data-tooltip', tooltip);
            if (tooltipPos === 'bottom') {
                btn.setAttribute('data-tooltip-pos', 'bottom');
            }
        }

        // Conteúdo
        let html = '';
        if (icon) html += icon;
        if (text) html += `<span class="btn-label">${text}</span>`;
        btn.innerHTML = html;

        return btn;
    },


    // ── Criar Botão de Ícone ───────────────
    // Atalho para botões quadrados com ícone + tooltip
    //
    // Opções:
    //   icon       {string}   - HTML do ícone SVG (obrigatório)
    //   tooltip    {string}   - Texto do tooltip (obrigatório)
    //   tooltipPos {string}   - "top" | "bottom" (default: "top")
    //   variant    {string}   - Variante de cor: "default" | "primary" | "danger" (default: "default")
    //   size       {string}   - "sm" | "md" | "lg" (default: "md")
    //   onClick    {function} - Handler de clique
    //   id         {string}   - ID do elemento
    //   disabled   {boolean}  - Se o botão começa desativado
    //
    createIconButton(options = {}) {
        const {
            icon = '',
            tooltip = '',
            tooltipPos = 'top',
            variant = 'default',
            size = 'md',
            onClick = null,
            id = '',
            disabled = false,
        } = options;

        const btn = document.createElement('button');
        btn.type = 'button';

        // Classe base + variante opcional
        let classes = `btn btn-icon btn-${size}`;
        if (variant !== 'default') classes += ` btn-${variant}`;
        btn.className = classes;

        if (id) btn.id = id;
        if (disabled) btn.disabled = true;
        if (onClick) btn.addEventListener('click', onClick);

        // Tooltip
        if (tooltip) {
            btn.setAttribute('data-tooltip', tooltip);
            if (tooltipPos === 'bottom') {
                btn.setAttribute('data-tooltip-pos', 'bottom');
            }
        }

        btn.innerHTML = icon;
        return btn;
    },


    // ── Processing State ───────────────────
    // Ativa o estado "a processar" num botão — desativa interação,
    // guarda o conteúdo original e substitui por spinner + texto.
    //
    //   button   {HTMLButtonElement} - O botão alvo
    //   label    {string}            - Texto enquanto processa (default: "A processar...")
    //   options  {object}            - Configuração opcional
    //     indicator {string}         - "spinner" | "dots" (default: "spinner")
    //
    startProcessing(button, label = 'A processar...', options = {}) {
        if (!button || button.classList.contains('btn-processing')) return;

        const indicator = options?.indicator === 'dots' ? 'dots' : 'spinner';

        // Guardar conteúdo original
        button.dataset.originalContent = button.innerHTML;
        button.dataset.originalWidth = getComputedStyle(button).width;

        // Manter largura para evitar saltos de layout
        button.style.minWidth = button.dataset.originalWidth;

        button.classList.add('btn-processing');
        if (indicator === 'dots') {
            button.classList.add('btn-processing-dots');
            button.innerHTML = this.dotsLoaderHTML;
            return;
        }

        button.innerHTML = `${this.spinnerSVG}<span class="btn-label">${label}</span>`;
    },


    // Restaura o botão ao estado original após processamento
    //
    //   button  {HTMLButtonElement} - O botão alvo
    //
    stopProcessing(button) {
        if (!button || !button.classList.contains('btn-processing')) return;

        button.classList.remove('btn-processing');
        button.classList.remove('btn-processing-dots');
        button.innerHTML = button.dataset.originalContent || '';
        button.style.minWidth = '';

        delete button.dataset.originalContent;
        delete button.dataset.originalWidth;
    },


    // ── Criar Toolbar ──────────────────────
    // Retorna um HTMLDivElement container para botões
    //
    // Opções:
    //   buttons  {HTMLElement[]}         - Array de botões a inserir
    //   groups   {HTMLElement[][]}       - Array de grupos (cada grupo é um array de botões)
    //   id       {string}               - ID do container
    //   classList {string[]}            - Classes adicionais
    //   bordered {boolean}             - Com fundo e borda (default: true)
    //   label    {string}              - Label opcional da toolbar
    //
    createToolbar(options = {}) {
        const {
            buttons = [],
            groups = [],
            id = '',
            classList = [],
            bordered = true,
            label = '',
        } = options;

        const toolbar = document.createElement('div');
        toolbar.className = 'btn-toolbar';
        toolbar.setAttribute('role', 'toolbar');

        if (bordered) toolbar.classList.add('btn-toolbar-bordered');
        if (id) toolbar.id = id;
        classList.forEach(cls => toolbar.classList.add(cls));

        // Label (opcional)
        if (label) {
            const lbl = document.createElement('span');
            lbl.className = 'btn-toolbar-label';
            lbl.textContent = label;
            toolbar.appendChild(lbl);
        }

        // Modo simples: lista de botões
        if (buttons.length > 0) {
            buttons.forEach(btn => toolbar.appendChild(btn));
        }

        // Modo agrupado: grupos com separadores entre eles
        if (groups.length > 0) {
            groups.forEach((group, i) => {
                const groupEl = document.createElement('div');
                groupEl.className = 'btn-toolbar-group';
                group.forEach(btn => groupEl.appendChild(btn));
                toolbar.appendChild(groupEl);

                // Separador entre grupos (exceto último)
                if (i < groups.length - 1) {
                    toolbar.appendChild(this.createSeparator());
                }
            });
        }

        return toolbar;
    },


    // ── Separador ──────────────────────────
    // Cria uma linha vertical separadora para uso em toolbars
    //
    createSeparator() {
        const sep = document.createElement('div');
        sep.className = 'btn-toolbar-separator';
        return sep;
    },

};