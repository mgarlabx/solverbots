const Messages = {

    MAX_MESSAGES_PER_CHAT: 30,

    lastMessage: null,
    lastMessageDatetime: null,

    render() {
        if (!Chat.messages) return '';
        return Chat.messages.map(msg => {
            return Message.render(msg);
        }).join('');
    },

    scrollToBottom() {
        const messagesEl = document.getElementById('chatMessages');
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    },

    reachedLimit() {
        const count = Array.isArray(Chat?.messages) ? Chat.messages.length : 0;
        if (count >= this.MAX_MESSAGES_PER_CHAT) {
            Notification?.show?.(
                t('chat.limitReached', { max: this.MAX_MESSAGES_PER_CHAT }),
                'warning'
            );
            return true;
        }
        return false;
    },

    save() {
        const chatIndex = Chats?.chats?.findIndex?.(chat => chat.id === Chat.id);
        Chats.chats[chatIndex].messages = Array.isArray(Chat.messages) ? Chat.messages : [];
        Storage.set('chats', Chats.chats);
    },

    clear() {
        Chat.messages = [];
        Chat.lastMessage = '';
        Chat.lastMessageDatetime = null;
        Chat.save();
        this.save();
        document.getElementById('chatMessages').innerHTML = '';
        Chats.setLast('', '');
    }
     
    

}