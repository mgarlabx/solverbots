const DataQuestions = [];
const DataTerms = [];

const App = {

    name: 'solverbots',

    async init() {

        const lang = Z.languageBrowser() 
        Z.terms(this.name, lang, res => {
            if (res === false) {
                Z.termsError(lang);
                return;
            } else {
                Z.recordAccess(this.name);
            }
        });

        Storage.load();
        await Data.load();
        Language.init();
        Storage.init();
        Persons.init();
        Theme.init();
        Header.init();
        Main.init();
        Footer.init();

    },

    stampToDatetime(stamp) {
        if (!stamp) return '';
        const date = new Date(stamp);

        if (Number.isNaN(date.getTime())) return '';

        const lang = Language?.current;
        const pad = value => String(value).padStart(2, '0');

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = String(date.getFullYear()).slice(-2);
        const minutes = pad(date.getMinutes());

        if (lang === 'en') {
            const hours24 = date.getHours();
            const period = hours24 >= 12 ? 'PM' : 'AM';
            const hours12 = hours24 % 12 || 12;
            const hour = pad(hours12);

            return `${month}/${day}/${year} ${hour}:${minutes} ${period}`;
        }

        const hour = pad(date.getHours());
        return `${day}/${month}/${year} ${hour}:${minutes}`;
    },


};

// Inicialização quando o DOM estiver pronto
// Esse é o ponto de entrada da aplicação
document.addEventListener("DOMContentLoaded", () => App.init());

