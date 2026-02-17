/* ========================================
   Footer.js - Footer da aplicação
   ======================================== */

const Footer = {

    init() {
        this.render();
    },

    render() {
        const container = document.querySelector('.footer-container');
        if (!container) return;

        container.innerHTML = `
            <div class="footer-left">
                <a href="https://solvertank.tech" target="_blank" rel="noopener noreferrer">
                    <img src="img/cubo.png" alt="Logo" class="footer-logo">
                </a>
            </div>
            <div class="footer-right">
                <span class="footer-text">
                    <span data-i18n="footer.text"></span> <a href="https://solvertank.tech/solveredu" target="_blank" rel="noopener noreferrer">SolverEdu</a>. <span data-i18n="footer.rights"></span>
                </span>
            </div>
        `;
    }
};
