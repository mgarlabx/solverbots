/* ========================================
    Chats.js - Lista de conversas (estilo WhatsApp)
   ======================================== */

const Chats = {

    chats: [],
    newChatHintDismissed: false,

    init() {
        this.loadChats();
        this.render();
    },

    loadChats() {
        this.chats = Storage.get('chats');
        if (!this.chats) {
            this.chats = [];
            Storage.set('chats', this.chats);
        }
        this.sortChatsByLastMessageDatetime();
        this.showFirstChat();
    },

    saveChats() {
        Storage.set('chats', this.chats);
    },

    sortChatsByLastMessageDatetime() {
        if (this.chats.length === 0) return;
        this.chats.sort((a, b) => {
            const aDatetime = Number(a.id);
            const bDatetime = Number(b.id);
            return bDatetime - aDatetime;
        });
    },

    refreshList() {
        this.sortChatsByLastMessageDatetime();
        const list = document.getElementById('chatList');
        if (list) {
            list.innerHTML = this.renderChatList();
        }
        this.syncNewChatHint();
    },

    render() {
        const container = document.querySelector('#chats-container');
        container.innerHTML = `
            <div class="chats-header">
                <h2 class="chats-title">Chats</h2>
                <div class="chats-header-actions">
                    <button class="chats-header-btn" id="newChatBtn" title="${t('newChat.title')}" onclick="Chats.openNewChat()">
                        ${Icons.pencil}
                    </button>
                </div>
            </div>
            <div class="chats-search">
                <div class="chats-search-box">
                    ${Icons.search}
                    <input type="text" placeholder="${t('newChat.search')}" class="chats-search-input" id="chatSearchInput" oninput="Chats.filterChats(this.value)">
                </div>
            </div>
            <div class="chats-list" id="chatList">
                ${this.renderChatList()}
            </div>
        `;

        this.syncNewChatHint();
    },

    openNewChat() {
        this.newChatHintDismissed = true;
        this.removeNewChatHint();
        NewChat.open();
    },

    removeNewChatHint() {
        document.querySelector('.chats-new-chat-hint')?.remove();
    },

    syncNewChatHint() {
        const actions = document.querySelector('.chats-header-actions');
        if (!actions) return;

        const currentHint = actions.querySelector('.chats-new-chat-hint');

        if (this.chats.length === 0 && !this.newChatHintDismissed) {
            if (!currentHint) {
                actions.insertAdjacentHTML('beforeend', `
                    <div class="chats-new-chat-hint">${t('newChat.noChats')}</div>
                `);
            }
            return;
        }

        if (this.chats.length > 0) {
            this.newChatHintDismissed = false;
        }

        currentHint?.remove();
    },

    renderChatList() {
        if (this.chats.length === 0) {
            return `<div class="chats-empty">
                <div class="chats-empty-icon">${Icons.chat}</div>
                <p>${t('newChat.noChats')}</p>
            </div>`;
        }

        return this.chats.map(chat => {
            const displayName = this.getChatDisplayName(chat);
            const avatarContent = chat.image
                ? `<img src="${Data.path}images/${chat.image}.jpg" alt="${displayName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                : (chat.isGroup ? Icons.users : Icons.user);

            return `
            <div class="chats-chat-item ${chat.id === this.selectedChatId ? 'active' : ''}" data-chat-id="${chat.id}" onclick="Chats.selectChat(parseInt(this.dataset.chatId))">
                <div class="chats-chat-avatar" style="background-color: ${chat.color}">
                    ${avatarContent}
                </div>
                <div class="chats-chat-info">
                    <div class="chats-chat-top">
                        <span class="chats-chat-name">${displayName}</span>
                        <span class="chats-chat-time" id="chats-chat-time-${chat.id}">${App.stampToDatetime(chat.lastMessageDatetime)}</span>
                    </div>
                    <div class="chats-chat-bottom">
                        <span class="chats-chat-message" id="chats-chat-message-${chat.id}">
                            ${chat.lastMessage || ''}
                        </span>
                    </div>
                </div>
                <button class="chats-chat-menu-btn" data-chat-menu="${chat.id}" title="${t('chat.options')}" onclick="event.stopPropagation(); Chats.showChatMenu(parseInt(this.dataset.chatMenu), this)">
                    ${Icons.chevronDown}
                </button>
            </div>
        `}).join('');
    },

    getChatDisplayName(chat) {
        if (!chat) return '';

        if (chat.name) return chat.name;

        if (!chat.isGroup && Array.isArray(chat.members) && chat.members.length === 1) {
            const person = Data.getById(chat.members[0]);
            if (person?.name) return person.name;
        }

        return chat.name || '';
    },


    addChat(chat) {
        this.chats.push(chat);
        this.sortChatsByLastMessageDatetime();
        this.saveChats();
        this.refreshList();
        this.selectChat(chat.id);
    },


    filterChats(query) {
        const q = query.toLowerCase();
        const items = document.querySelectorAll('.chats-chat-item');
        items.forEach(item => {
            const name = item.querySelector('.chats-chat-name').textContent.toLowerCase();
            const msg = item.querySelector('.chats-chat-message');
            const message = msg ? msg.textContent.toLowerCase() : '';
            item.style.display = (name.includes(q) || message.includes(q)) ? '' : 'none';
        });
    },

    selectChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        if (Message?.isGenerating && this.selectedChatId !== chat.id) {
            Notification?.show?.(t('chat.waitResponse'));
            return;
        }

        this.selectedChatId = chat.id;

        const items = document.querySelectorAll('.chats-chat-item');
        items.forEach(item => {
            const id = Number(item.dataset.chatId);
            item.classList.toggle('active', id === chat.id);
        });

        Chat.id = chat.id;
        Chat.name = chat.name;
        Chat.image = chat.image;
        Chat.isGroup = chat.isGroup;
        Chat.members = chat.members;
        Chat.messages = chat.messages;
        Chat.load();
    },


    // *************************************************************************************************************************************
    // ******* MENU DE CONTEXTO DO CHAT ****************************************************************************************************
    // *************************************************************************************************************************************

    showChatMenu(chatId, anchorEl) {
        this.closeChatMenu();

        const chat = this.chats.find(c => c.id === chatId);
        const rect = anchorEl.getBoundingClientRect();

        const renameBtn = chat ? `
                <button class="chats-chat-context-item" data-action="rename">
                    ${Icons.edit}
                    <span>${t('chat.rename')}</span>
                </button>` : '';

        const menuHTML = `
            <div class="chats-chat-context-menu" id="chatContextMenu" data-chat-id="${chatId}">
                ${renameBtn}
                <button class="chats-chat-context-item" data-action="clear">
                    ${Icons.eraser}
                    <span>${t('chat.clear')}</span>
                </button>
                <button class="chats-chat-context-item delete" data-action="delete">
                    ${Icons.trash}
                    <span>${t('chat.delete')}</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', menuHTML);

        const menu = document.getElementById('chatContextMenu');
        if (!menu) return;

        // Posicionar o menu
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.left = `${rect.left - 120}px`;

        // Ajustar se sair da tela
        requestAnimationFrame(() => {
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                menu.style.left = `${window.innerWidth - menuRect.width - 8}px`;
            }
            if (menuRect.left < 0) {
                menu.style.left = '8px';
            }
            if (menuRect.bottom > window.innerHeight) {
                menu.style.top = `${rect.top - menuRect.height - 4}px`;
            }
            menu.classList.add('show');
        });

        // Eventos do menu
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.chats-chat-context-item');
            if (!item) return;

            if (item.disabled) {
                e.preventDefault();
                return;
            }

            const action = item.dataset.action;
            const id = parseInt(menu.dataset.chatId);

            if (action === 'delete') {
                this.deleteChat(id);
            } else if (action === 'rename') {
                this.openRenameChat(id);
            } else if (action === 'clear') {
                this.clearChat(id);
            }

            this.closeChatMenu();
        });

        // Fechar ao clicar fora
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!menu.contains(e.target) && e.target !== anchorEl) {
                    this.closeChatMenu();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 10);
    },

    closeChatMenu() {
        const existing = document.getElementById('chatContextMenu');
        if (existing) existing.remove();
    },

    openRenameChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        // Remove modal existente
        const existing = document.getElementById('renameChatModal');
        if (existing) existing.remove();

        const modalHTML = `
            <div id="renameChatModal" class="rename-chat-modal">
                <div class="rename-chat-modal-content">
                    <h3 class="rename-chat-modal-title">${t('chat.rename')}</h3>
                    <input type="text" id="renameChatInput" class="rename-chat-input" value="${this.getChatDisplayName(chat).replace(/"/g, '&quot;')}" maxlength="80">
                    <div class="rename-chat-actions">
                        <button id="renameChatCancel" class="new-chat-btn secondary">${t('newChat.cancel')}</button>
                        <button id="renameChatConfirm" class="new-chat-btn primary">${t('chat.renameSave')}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('renameChatModal');
        const input = document.getElementById('renameChatInput');
        const cancelBtn = document.getElementById('renameChatCancel');
        const confirmBtn = document.getElementById('renameChatConfirm');

        // Focar e selecionar texto
        requestAnimationFrame(() => {
            modal.classList.add('show');
            input.focus();
            input.select();
        });

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 200);
        };

        const doRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== chat.name) {
                this.renameChat(chatId, newName);
            }
            closeModal();
        };

        confirmBtn.addEventListener('click', doRename);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doRename();
            if (e.key === 'Escape') closeModal();
        });
    },

    renameChat(chatId, newName) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;
        chat.name = newName;
        this.saveChats();
        this.refreshList();
        document.getElementById('chat-header-name').textContent = newName;
    },

    clearChat(chatId) {
        const confirmed = confirm(t('chat.confirmClear', { name: this.getChatDisplayName(this.chats.find(c => c.id === chatId)) }));
        if (!confirmed) return false;
        Messages.clear();
    },

    deleteChat(chatId) {
        const confirmed = confirm(t('chat.confirmDelete', { name: this.getChatDisplayName(this.chats.find(c => c.id === chatId)) }));
        if (!confirmed) return false;
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return false;
        this.chats = this.chats.filter(c => c.id !== chatId);
        this.saveChats();
        this.refreshList();
        this.showFirstChat();
    },

    showFirstChat() {
        if (this.chats.length == 0) {
            document.getElementById('chat-container').innerHTML = `<div class="chat-empty">
                <div class="chat-empty-icon">${Icons.chat}</div>
                <p>${t('chat.selectChat')}</p>
            </div>`;
        } else {
            this.selectChat(this.chats[0].id);
            Chat.closeMobile();
        }
    },

    setLast(timestamp, content) {
        document.getElementById(`chats-chat-time-${Chat.id}`).textContent = timestamp;
        document.getElementById(`chats-chat-message-${Chat.id}`).textContent = content;
    }


};
