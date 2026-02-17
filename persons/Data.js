const Data = {

    path: './persons/',
    persons: [],

    getCurrentLang() {
        const lang = Language?.current;
        return ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
    },

    getLocalizedValue(person, baseKey, lang = this.getCurrentLang()) {
        if (!person) return '';

        return (
            person[`${baseKey}_${lang}`]
            || person[`${baseKey}_pt`]
            || person[`${baseKey}_en`]
            || person[`${baseKey}_es`]
            || person[baseKey]
            || ''
        );
    },

    localizePerson(person, lang = this.getCurrentLang()) {
        if (!person) return null;

        return {
            ...person,
            name: this.getLocalizedValue(person, 'name', lang),
            country: this.getLocalizedValue(person, 'country', lang),
            biography: this.getLocalizedValue(person, 'biography', lang),
        };
    },

    async load() {
        const storagePersons = Storage?.get?.('persons');
        if (Array.isArray(storagePersons)) {
            this.persons = storagePersons;
            return;
        }

        try {
            const response = await fetch(`${this.path}Data.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.persons = await response.json();
            Storage?.set?.('persons', this.persons);
        } catch (error) {
            console.error('Failed to load data.json:', error);
            this.persons = [];
        }
    },

    getAll() {
        return this.persons.map(p => this.localizePerson(p));
    },

    getById(id) {
        const person = this.persons.find(p => p.id === id);
        return this.localizePerson(person);
    },

    getRawById(id) {
        return this.persons.find(p => p.id === id);
    },

    getByName(name) {
        return this.getAll().filter(p =>
            p.name.toLowerCase().includes(name.toLowerCase())
        );
    },

};
