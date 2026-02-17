/* ========================================
   NewChat.js - Modal para criar nova conversa
   ======================================== */

const NewChat = {

    MAX_GROUP: 5,       // Máximo de bots por grupo
    selected: [],       // IDs das persons selecionadas
    filterSex: '',      // Filtro por sexo: '' | 'M' | 'F'
    filterCountry: '',  // Filtro por país
    sortField: 'name',  // Campo de ordenação: 'name' | 'birth'
    sortDir: 'asc',     // Direção: 'asc' | 'desc'

    open() {
        this.selected = [];
        this.filterSex = '';
        this.filterCountry = '';
        this.sortField = 'name';
        this.sortDir = 'asc';
        this.createModal();
        this.renderPersonsList();
        this.attachEvents();

        const modal = document.getElementById('newChatModal');
        if (modal) modal.classList.add('show');
    },

    close() {
        const modal = document.getElementById('newChatModal');
        if (modal) modal.classList.remove('show');
        Biography?.close?.();
        setTimeout(() => { if (modal) modal.remove(); }, 300);
    },

    /** Retorna lista de países únicos */
    getCountries() {
        const persons = Data.getAll();
        const countries = [...new Set(persons.map(p => p.country))].sort();
        return countries;
    },

    createModal() {
        // Remove modal existente
        const existing = document.getElementById('newChatModal');
        if (existing) existing.remove();

        const countries = this.getCountries();
        const countryOptions = countries.map(c =>
            `<option value="${c}">${c}</option>`
        ).join('');

        const modalHTML = `
            <div id="newChatModal" class="new-chat-modal">
                <div class="new-chat-modal-content">
                    <div class="new-chat-modal-header">
                        <h2>${t('newChat.title')}</h2>
                        <button id="newChatCloseBtn" class="new-chat-modal-close">
                            ${Icons.close}
                        </button>
                    </div>

                    <div class="new-chat-controls">
                        <!-- Busca -->
                        <div class="new-chat-search-box">
                            ${Icons.search}
                            <input type="text" id="newChatSearch" placeholder="${t('newChat.search')}" class="new-chat-search-input">
                        </div>

                        <!-- Filtros -->
                        <div class="new-chat-filters">
                            <select id="newChatFilterSex" class="new-chat-select">
                                <option value="">${t('newChat.allSex')}</option>
                                <option value="M">${t('newChat.male')}</option>
                                <option value="F">${t('newChat.female')}</option>
                            </select>
                            <select id="newChatFilterCountry" class="new-chat-select">
                                <option value="">${t('newChat.allCountries')}</option>
                                ${countryOptions}
                            </select>
                        </div>

                        <!-- Ordenação -->
                        <div class="new-chat-sort">
                            <button id="newChatSortName" class="new-chat-sort-btn active" data-sort="name">
                                ${t('newChat.sortName')} <span class="sort-arrow">↑</span>
                            </button>
                            <button id="newChatSortBirth" class="new-chat-sort-btn" data-sort="birth">
                                ${t('newChat.sortBirth')} <span class="sort-arrow">↑</span>
                            </button>
                        </div>
                    </div>

                    <!-- Selecionados -->
                    <div class="new-chat-selected-bar" id="newChatSelectedBar" style="display:none;">
                        <span id="newChatSelectedCount"></span>
                        <button id="newChatClearSelection" class="new-chat-clear-btn">${t('newChat.clearSelection')}</button>
                    </div>

                    <!-- Lista de persons -->
                    <div class="new-chat-list" id="newChatList"></div>

                    <!-- Footer com ações -->
                    <div class="new-chat-footer">
                        <div class="new-chat-group-name-wrapper" id="newChatGroupWrapper" style="display:none;">
                            <input type="text" id="newChatGroupName" placeholder="${t('newChat.groupName')}" class="new-chat-group-input">
                        </div>
                        <div class="new-chat-footer-actions">
                            <button id="newChatCancelBtn" class="new-chat-btn secondary">${t('newChat.cancel')}</button>
                            <button id="newChatCreateBtn" class="new-chat-btn primary" disabled>${t('newChat.create')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    /** Filtra, ordena e renderiza a lista de persons */
    renderPersonsList() {
        let persons = Data.getAll().slice();

        // Busca por texto
        const searchInput = document.getElementById('newChatSearch');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        if (query) {
            persons = persons.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.reference && p.reference.toLowerCase().includes(query))
            );
        }

        // Filtro sexo
        if (this.filterSex) {
            persons = persons.filter(p => p.sex === this.filterSex);
        }

        // Filtro país
        if (this.filterCountry) {
            persons = persons.filter(p => p.country === this.filterCountry);
        }

        // Ordenação
        const dir = this.sortDir === 'asc' ? 1 : -1;
        if (this.sortField === 'name') {
            persons.sort((a, b) => a.name.localeCompare(b.name) * dir);
        } else if (this.sortField === 'birth') {
            persons.sort((a, b) => (a.birth - b.birth) * dir);
        }

        const list = document.getElementById('newChatList');
        if (!list) return;

        if (persons.length === 0) {
            list.innerHTML = `<div class="new-chat-empty">${t('newChat.noResults')}</div>`;
            return;
        }

        const atLimit = this.selected.length >= this.MAX_GROUP;

        list.innerHTML = persons.map(person => {
            const isSelected = this.selected.includes(person.id);
            const isDisabled = atLimit && !isSelected;
            const birthYear = person.birth < 0 ? `${Math.abs(person.birth)} a.C.` : person.birth;
            const deathYear = person.death < 0 ? `${Math.abs(person.death)} a.C.` : person.death;

            return `
                <div class="new-chat-person ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-person-id="${person.id}">
                    <div class="new-chat-person-check">
                        <div class="new-chat-checkbox ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}">
                            ${isSelected ? Icons.checkmarkSmall : ''}
                        </div>
                    </div>
                    <div class="new-chat-person-avatar">
                        <img src="${Data.path}images/${person.image}.jpg" alt="${person.name}">
                    </div>
                    <div class="new-chat-person-info">
                        <span class="new-chat-person-name">${person.name} <span class="new-chat-person-sex ${person.sex === 'F' ? 'female' : 'male'}">${person.sex === 'F' ? Icons.female : Icons.male}</span></span>
                        <span class="new-chat-person-details">
                            ${person.country} · ${birthYear} – ${deathYear}
                        </span>
                    </div>
                    <button type="button" class="new-chat-person-more-btn" data-person-more-id="${person.id}" title="${t('newChat.learnMore')}">
                        ${Icons.about}
                    </button>

                </div>
            `;
        }).join('');

        this.bindAvatarFallbacks(list);
    },

    bindAvatarFallbacks(listEl) {
        const avatars = listEl.querySelectorAll('.new-chat-person-avatar img');
        avatars.forEach((img) => {
            img.addEventListener('error', () => {
                const avatar = img.parentElement;
                if (!avatar) return;
                avatar.innerHTML = Icons.user;
            }, { once: true });
        });
    },

    updateSelectedBar() {
        const bar = document.getElementById('newChatSelectedBar');
        const countEl = document.getElementById('newChatSelectedCount');
        const createBtn = document.getElementById('newChatCreateBtn');
        const groupWrapper = document.getElementById('newChatGroupWrapper');

        if (!bar || !countEl || !createBtn) return;

        const count = this.selected.length;

        if (count === 0) {
            bar.style.display = 'none';
            createBtn.disabled = true;
            if (groupWrapper) groupWrapper.style.display = 'none';
        } else {
            bar.style.display = 'flex';
            createBtn.disabled = false;

            const names = this.selected.map(id => {
                const p = Data.getById(id);
                return p ? p.name : '';
            }).filter(Boolean);

            const limitText = count >= this.MAX_GROUP ? ` (${t('newChat.maxGroup', { max: this.MAX_GROUP })})` : '';
            countEl.innerHTML = `<strong>${count}</strong> ${t('newChat.selected')}: ${names.join(', ')}${limitText}`;

            // Mostrar campo de nome do grupo se mais de 1 selecionado
            if (groupWrapper) {
                groupWrapper.style.display = count > 1 ? 'block' : 'none';
            }
        }
    },

    togglePerson(personId) {
        const idx = this.selected.indexOf(personId);
        if (idx >= 0) {
            this.selected.splice(idx, 1);
        } else {
            if (this.selected.length >= this.MAX_GROUP) return;
            this.selected.push(personId);
        }
        this.renderPersonsList();
        this.updateSelectedBar();
    },

    clearSelection() {
        this.selected = [];
        this.renderPersonsList();
        this.updateSelectedBar();
    },

    createChat() {
        if (this.selected.length === 0) return;

        const isGroup = this.selected.length > 1;
        const members = this.selected.map(id => Data.getById(id)).filter(Boolean);

        let chatName;
        let chatImage = null;

        if (isGroup) {
            const groupInput = document.getElementById('newChatGroupName');
            chatName = groupInput && groupInput.value.trim()
                ? groupInput.value.trim()
                : members.map(m => m.name).join(', ');
        } else {
            chatName = members[0].name;
            chatImage = members[0].image;
        }

        const chat = {
            id: Date.now(),
            name: chatName,
            image: chatImage,
            isGroup: isGroup,
            members: this.selected.slice(),
            color: this.randomColor(),
            messages: [],
            lastMessage: '',
            lastMessageDatetime: Date.now()
        };

        Chats.addChat(chat);
        this.close();
    },

    randomColor() {
        const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#dce775', '#fff176', '#ffd54f', '#ffb74d', '#ff8a65'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    attachEvents() {
        // Fechar
        const closeBtn = document.getElementById('newChatCloseBtn');
        const cancelBtn = document.getElementById('newChatCancelBtn');
        const modal = document.getElementById('newChatModal');

        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // ESC para fechar
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (Biography?.isOpen?.()) {
                    Biography.close();
                    return;
                }
                this.close();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Busca
        const searchInput = document.getElementById('newChatSearch');
        searchInput?.addEventListener('input', () => this.renderPersonsList());

        // Filtro sexo
        const filterSex = document.getElementById('newChatFilterSex');
        filterSex?.addEventListener('change', (e) => {
            this.filterSex = e.target.value;
            this.renderPersonsList();
        });

        // Filtro país
        const filterCountry = document.getElementById('newChatFilterCountry');
        filterCountry?.addEventListener('change', (e) => {
            this.filterCountry = e.target.value;
            this.renderPersonsList();
        });

        // Ordenação
        const sortName = document.getElementById('newChatSortName');
        const sortBirth = document.getElementById('newChatSortBirth');

        sortName?.addEventListener('click', () => this.toggleSort('name'));
        sortBirth?.addEventListener('click', () => this.toggleSort('birth'));

        // Clique em person
        const list = document.getElementById('newChatList');
        list?.addEventListener('click', (e) => {
            const moreBtn = e.target.closest('.new-chat-person-more-btn');
            if (moreBtn) {
                e.preventDefault();
                e.stopPropagation();
                const personId = parseInt(moreBtn.dataset.personMoreId);
                if (!Number.isNaN(personId)) Biography?.openPersonById?.(personId);
                return;
            }

            const personEl = e.target.closest('.new-chat-person');
            if (!personEl) return;
            const personId = parseInt(personEl.dataset.personId);
            this.togglePerson(personId);
        });

        // Limpar seleção
        const clearBtn = document.getElementById('newChatClearSelection');
        clearBtn?.addEventListener('click', () => this.clearSelection());

        // Criar chat
        const createBtn = document.getElementById('newChatCreateBtn');
        createBtn?.addEventListener('click', () => this.createChat());
    },

    toggleSort(field) {
        if (this.sortField === field) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDir = 'asc';
        }

        // Atualizar visual dos botões
        document.querySelectorAll('.new-chat-sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === this.sortField);
            const arrow = btn.querySelector('.sort-arrow');
            if (arrow && btn.dataset.sort === this.sortField) {
                arrow.textContent = this.sortDir === 'asc' ? '↑' : '↓';
            }
        });

        this.renderPersonsList();
    }
};
