/* ========================================
   Main.js - Container principal com 3 colunas
   ======================================== */

const Main = {

    init() {
        this.render();
        Chats.init();
    },

    render() {
        const container = document.querySelector('.main-container');
        container.innerHTML = `
            <div id="chats-container"></div>
            <div id="chat-container"></div>
        `;
    }
};
