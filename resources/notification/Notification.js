const Notification = {

    show(message, type = 'info', duration = 2000) {
        // Remove notificações anteriores
        const existingNotifications = document.querySelectorAll('.app-notification');
        existingNotifications.forEach(notif => notif.remove());

        // Cria a notificação
        const notification = document.createElement('div');
        notification.className = `app-notification app-notification-${type}`;
        notification.innerHTML = `
                <div class="app-notification-content">
                    <span class="app-notification-icon">${this.getIcon(type)}</span>
                    <span class="app-notification-message">${message}</span>
                </div>
            `;

        // Adiciona ao body
        document.body.appendChild(notification);

        // Trigger reflow para iniciar a animação
        setTimeout(() => {
            notification.classList.add('app-notification-show');
        }, 10);

        // Remove após o tempo especificado
        setTimeout(() => {
            notification.classList.remove('app-notification-show');
            notification.classList.add('app-notification-hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    },

    getIcon(type) {
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ⓘ'
        };
        return icons[type] || icons['info'];
    }


};
