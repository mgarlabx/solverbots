/* ========================================
   Chat.js - Painel de conversa (direita)
   ======================================== */

const Chat = {

    id: null,
    name: '',
    image: '',
    isGroup: false,
    members: [],
    messages: [],
    lastMessage: '',
    lastMessageDatetime: null,
    startHintTimeoutId: null,

    load() {
        this.render();
        this.bindInputEvents();
        this.updateMessageLimitIndicator();
        this.openMobile();
        this.scheduleStartHint();
        this.checkAvatarHint();
    },

    render() {
        const container = document.querySelector('#chat-container');
        if (!this.id) {
            container.innerHTML = `
                <div class="chat-empty">
                    <div class="chat-empty-icon">${Icons.chat}</div>
                    <p>${t('chat.selectChat')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="chat-header">
                <button class="chat-back-btn" id="chatBackBtn">${Icons.arrowLeft}</button>
                <div class="chat-header-info">
                    <span id="chat-header-name">${this.name}</span>
                </div>
                <div class="chat-header-members">
                    ${this.renderMemberAvatars()}
                </div>
            </div>
            <div class="messages" id="chatMessages">
                 ${Messages.render()}
            </div>
            <div class="chat-input-area">
                <div class="chat-input-box">
                    <textarea
                        id="chatInput"
                        class="chat-input"
                        placeholder="${t('chat.placeholder')}"
                        rows="1"
                        oninput="document.querySelector('.chat-start-hint')?.remove()"
                    ></textarea>
                    <button class="chat-send-btn" id="chatSendBtn" title="${t('chat.send')}" onclick="Message.userSend();">
                        ${Icons.send}
                    </button>
                    <div
                        class="chat-message-limit-indicator"
                        id="chatMessageLimitIndicator"
                        role="img"
                        aria-label=""
                    ></div>
                </div>
            </div>
        `;

        Messages.scrollToBottom();
    },


    renderMemberAvatars() {
        return this.members.map(memberId => {
            const isProcessing = false; // Placeholder for any processing state logic
            const person = Data.getById(memberId);
            return `
                <div
                    class="chat-member-avatar ${isProcessing ? 'is-disabled' : ''}"
                    data-person-id="${person.id}"
                    data-avatar-disabled="${isProcessing ? '1' : '0'}"
                    aria-disabled="${isProcessing ? 'true' : 'false'}"
                    onclick="Message.avatarSend(${person.id});"
                >
                    <img src="${Data.path}images/${person.image}.jpg" alt="${person.name}">
                    <span class="chat-avatar-tooltip">${person.name}</span>
                </div>
            `;
        }).join('');
    },

    openMobile() {
        const container = document.getElementById('chat-container');
        if (container) container.classList.add('chat-mobile-open');
    },

    closeMobile() {
        const container = document.getElementById('chat-container');
        if (container) container.classList.remove('chat-mobile-open');
    },

    bindInputEvents() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        chatInput.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' || event.isComposing) return;
            event.preventDefault();
            Message.userSend();
        });

        const backBtn = document.getElementById('chatBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.closeMobile());
        }
    },

    updateMessageLimitIndicator() {
        const indicatorEl = document.getElementById('chatMessageLimitIndicator');
        const count = this.messages ? this.messages.length : 0;
        const max = Messages.MAX_MESSAGES_PER_CHAT;
        const progress = max > 0 ? Math.min(100, (count / max) * 100) : 0;
        indicatorEl.style.setProperty('--chat-limit-progress', `${progress}%`);
        indicatorEl.setAttribute('title', `${count}/${max}`);
        indicatorEl.setAttribute('aria-label', `${count}/${max}`);
    },

    save() {
        const chatIndex = Chats?.chats?.findIndex?.(chat => chat.id === Chat.id);
        Chats.chats[chatIndex].lastMessage = Chat.lastMessage;
        Chats.chats[chatIndex].lastMessageDatetime = Chat.lastMessageDatetime;
        Storage.set('chats', Chats.chats);
    },

    showAvatarHint() {
        if (document.querySelector('.chat-avatar-hint')) return;
        const membersEl = document.querySelector('.chat-header-members');
        if (!membersEl) return;
        const hint = document.createElement('div');
        hint.className = 'chat-avatar-hint';
        hint.textContent = t('chat.avatarHint');
        membersEl.appendChild(hint);
    },

    hideAvatarHint() {
        document.querySelector('.chat-avatar-hint')?.remove();
    },

    scheduleStartHint() {
        if (this.startHintTimeoutId) {
            clearTimeout(this.startHintTimeoutId);
            this.startHintTimeoutId = null;
        }

        if (this.messages.length !== 0) return;

        this.startHintTimeoutId = setTimeout(() => {
            if (this.messages.length !== 0) return;
            if (document.querySelector('.chat-start-hint')) return;

            const inputArea = document.querySelector('.chat-input-area');
            const inputEl = document.getElementById('chatInput');
            if (!inputArea || !inputEl || inputEl.value.trim()) return;

            inputArea.insertAdjacentHTML('afterbegin', `
                <div class="chat-start-hint">
                    ${t('chat.startHint')}
                </div>
            `);
        }, 2000);
    },

    checkAvatarHint() {
        if (!this.isGroup || !this.messages.length) return;
        const hasUserMessages = this.messages.some(m => Number(m.sender) === 0);
        const hasAvatarMessages = this.messages.some(m => Number(m.sender) !== 0);
        if (hasUserMessages && !hasAvatarMessages) {
            setTimeout(() => this.showAvatarHint(), 2000);
        }
    },

};