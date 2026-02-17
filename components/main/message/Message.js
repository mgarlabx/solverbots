const Message = {

    isGenerating: false,

    render(msg) {
        Chat.lastMessage = msg.content;
        Chat.lastMessageDatetime = msg.time;
        Chat.save();

        const messageBody = msg.content ? `<span class="chat-message-text">${Message.escapeHtml(msg.content)}</span>` : '';
        const timeHTML = msg.time ? `<span class="chat-message-time">${App.stampToDatetime(msg.time)}</span>` : '';
        const senderId = Number(msg?.sender);
        const isUserMessage = Number.isFinite(senderId) && senderId === 0;

        if (!isUserMessage) {
            const person = Person.get(senderId);
            const canOpenBiography = Number.isFinite(senderId) && senderId > 0 && !!person?.id;
            const personName = Message.escapeHtml(person?.name || '');
            const avatarHTML = `
                <div class="chat-message-meta">
                    ${person?.image ? `
                    <img
                        src="${Data.path}images/${person.image}.jpg"
                        alt="${personName}"
                        class="chat-message-avatar"
                        ${canOpenBiography ? `data-person-id="${senderId}" onclick="Message.openBiography(${senderId});"` : ''}
                    >
                    ` : ''}
                    <span
                        class="chat-message-sender"
                        ${canOpenBiography ? `role="button" tabindex="0" data-person-id="${senderId}" onclick="Message.openBiography(${senderId});" onkeydown="Message.handlePersonKeydown(event, ${senderId});"` : ''}
                    >${personName}</span>
                </div>
            `;
            return `
                <div class="chat-message chat-message-bot">
                    <div class="chat-message-bubble">
                        ${avatarHTML}
                        ${messageBody}
                        ${timeHTML}
                    </div>
                </div>
            `;
        }
        return `
                <div class="chat-message chat-message-user">
                    <div class="chat-message-bubble">
                        ${messageBody}
                        ${timeHTML}
                    </div>
                </div>
            `;
    },

    escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    },

    handlePersonKeydown(event, personId) {
        if (!event) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.openBiography(personId);
        }
    },

    openBiography(personId) {
        Biography.openPersonById(personId);
    },

    userSend() {
        if (Messages.reachedLimit()) return;
        const input = document.getElementById('chatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.send(0, text);

        if (!Chat.isGroup) {
            setTimeout(() => this.avatarSend(Chat.members[0]), 750);
        }

    },

    async avatarSend(person_id) {
        if (Messages.reachedLimit() || this.isGenerating) return;
        Chat.hideAvatarHint();

        const person = Person.get(person_id);
        this.isGenerating = true;
        this.setAvatarsDisabled(true);
        this.showStreamingMessage(person);
        Messages.scrollToBottom();

        try {
            const text = await Prompt.run(person_id);
            this.removeStreamingMessage();
            this.send(person_id, text);
        } catch (e) {
            this.removeStreamingMessage();
            console.error('avatarSend error:', e);
        } finally {
            this.setAvatarsDisabled(false);
            this.isGenerating = false;
        }
    },

    showStreamingMessage(person) {
        const messagesEl = document.getElementById('chatMessages');
        if (!messagesEl) return;
        const personName = Message.escapeHtml(person.name || '');
        const html = `
            <div class="chat-message chat-message-bot" id="streaming-message">
                <div class="chat-message-bubble">
                    <div class="chat-message-meta">
                        <img
                            src="${Data.path}images/${person.image}.jpg"
                            alt="${personName}"
                            class="chat-message-avatar"
                        >
                        <span class="chat-message-sender">${personName}</span>
                    </div>
                    <span class="chat-message-text" id="streaming-message-text">
                        <span class="chat-processing-dots"><span></span><span></span><span></span></span>
                    </span>
                </div>
            </div>
        `;
        messagesEl.insertAdjacentHTML('beforeend', html);
    },

    updateStreamingText(text) {
        const el = document.getElementById('streaming-message-text');
        if (!el) return;
        el.innerHTML = `<span class="chat-streaming-text">${Message.escapeHtml(text)}</span>`;
        Messages.scrollToBottom();
    },

    removeStreamingMessage() {
        const el = document.getElementById('streaming-message');
        if (el) el.remove();
    },

    setAvatarsDisabled(disabled) {
        document.querySelectorAll('.chat-member-avatar').forEach(avatar => {
            if (disabled) {
                avatar.classList.add('is-disabled');
                avatar.setAttribute('data-avatar-disabled', '1');
                avatar.setAttribute('aria-disabled', 'true');
            } else {
                avatar.classList.remove('is-disabled');
                avatar.setAttribute('data-avatar-disabled', '0');
                avatar.setAttribute('aria-disabled', 'false');
            }
        });
    },

    send(sender, content) {
        const timestamp = new Date().toISOString();
        Chat.messages.push({
            sender: sender,
            content: content,
            time: timestamp,
        });
        Messages.lastMessage = content;
        Messages.lastMessageDatetime = timestamp;
        const messagesEl = document.getElementById('chatMessages');
        if (messagesEl) {
            messagesEl.innerHTML = Messages.render();
        }
        Messages.save();
        Chat.updateMessageLimitIndicator();
        Messages.scrollToBottom();
        Chats.setLast(App.stampToDatetime(timestamp), content);

        Chat.checkAvatarHint();
    },





}