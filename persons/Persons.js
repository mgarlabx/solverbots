const Persons = {

    editState: {},
    createPanelOpen: false,
    createPersonSubmitting: false,
    searchQuery: '',

    init() {
        this.createModalIfNotExists();

        Language.onChange(() => {
            const modal = document.getElementById('personsModal');
            if (modal) modal.remove();
            this.createModalIfNotExists();
        });
    },

    createModalIfNotExists() {
        if (document.getElementById('personsModal')) return;

        const modalHTML = `
            <div id="personsModal" class="persons-modal">
                <div class="persons-modal-content">
                    <div class="persons-modal-header">
                        <div class="persons-modal-header-main">
                            <h2>${t('header.people')}</h2>
                            <div class="persons-modal-actions">
                                <button id="createPersonBtn" class="persons-modal-action" title="${t('persons.createPersonTitle')}">
                                    ${Icons.plus}
                                </button>
                                <button id="closePersonsModal" class="persons-modal-close">
                                    ${Icons.close}
                                </button>
                            </div>
                        </div>
                        <div class="person-search-wrap">
                            <input id="personSearchInput" class="person-search-input" type="text" placeholder="${t('persons.searchPlaceholder')}">
                            <button id="personSearchClearBtn" class="person-search-clear" type="button" title="${t('settings.clear') || 'Limpar'}" aria-label="${t('settings.clear') || 'Limpar'}">
                                ${Icons.close}
                            </button>
                        </div>
                        <div id="personCreatePanel" class="person-create-panel" style="display: none;">
                            <input id="personCreateWikipediaUrl" class="person-create-input" type="text" placeholder="${t('persons.wikipediaUrlPlaceholder')}">
                            <button id="personCreateSubmitBtn" class="person-create-submit">${t('persons.createButton')}</button>
                        </div>
                    </div>
                    <div class="persons-modal-body">
                        <div id="personsList" class="persons-list"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    open() {
        this.createModalIfNotExists();
        this.renderList();

        const modal = document.getElementById('personsModal');
        const closeBtn = document.getElementById('closePersonsModal');
        const createBtn = document.getElementById('createPersonBtn');
        const createSubmitBtn = document.getElementById('personCreateSubmitBtn');
        const createInput = document.getElementById('personCreateWikipediaUrl');
        const searchInput = document.getElementById('personSearchInput');
        const searchClearBtn = document.getElementById('personSearchClearBtn');

        modal.classList.add('show');

        const close = () => modal.classList.remove('show');

        closeBtn.onclick = close;
        if (createBtn) {
            createBtn.onclick = (event) => this.toggleCreatePanel(event);
        }
        if (createSubmitBtn) {
            createSubmitBtn.onclick = (event) => this.submitCreatePerson(event);
        }
        if (createInput) {
            createInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.submitCreatePerson(event);
                }
            };
        }
        if (searchInput) {
            searchInput.value = this.searchQuery;
            searchInput.oninput = (event) => {
                this.searchQuery = event.target.value || '';
                this.renderList();
                this.updateSearchClearButton();
            };
        }
        if (searchClearBtn) {
            searchClearBtn.onclick = (event) => {
                event.stopPropagation();
                this.searchQuery = '';
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                this.renderList();
                this.updateSearchClearButton();
            };
        }
        this.updateSearchClearButton();

        modal.onclick = (e) => {
            if (e.target === modal) close();
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    },

    toggleCreatePanel(event) {
        event?.stopPropagation?.();
        const panel = document.getElementById('personCreatePanel');
        const input = document.getElementById('personCreateWikipediaUrl');
        if (!panel) return;

        this.createPanelOpen = !this.createPanelOpen;
        panel.style.display = this.createPanelOpen ? 'flex' : 'none';

        if (this.createPanelOpen && input) {
            requestAnimationFrame(() => input.focus());
        }
    },

    isWikipediaUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol.startsWith('http')
                && (parsed.hostname === 'wikipedia.org' || parsed.hostname.endsWith('.wikipedia.org'));
        } catch {
            return false;
        }
    },

    async submitCreatePerson(event) {
        event?.stopPropagation?.();

        if (this.createPersonSubmitting) return;

        const input = document.getElementById('personCreateWikipediaUrl');
        if (!input) return;

        const wikipediaUrl = input.value.trim();
        if (!this.isWikipediaUrl(wikipediaUrl)) {
            Notification?.show?.(t('persons.wikipediaUrlInvalid'));
            return;
        }

        this.setCreatePersonSubmitting(true);

        try {
            const response = await fetch(`${Settings.backendPath}index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resource: 'person_create',
                    wikipedia_url: wikipediaUrl,
                })
            });
            const contentType = response.headers.get('content-type') || '';
            const isJson = contentType.includes('application/json');
            const responseBody = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                console.error('person_create HTTP error:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: responseBody,
                });
                Notification?.show?.(t('chat.errorResponseBackend'));
                return;
            }

            const responseJson = responseBody;

            if (responseJson?.error) {
                console.error('person_create backend error:', responseJson.error);
                Notification?.show?.(t('chat.errorResponseBackend'));
                return;
            }

            const personSchemaData = this.parsePersonMessage(responseJson?.message);
            if (!personSchemaData) {
                console.error('person_create invalid message payload:', responseJson);
                Notification?.show?.(t('chat.errorResponseBackend'));
                return;
            }

            const personRecord = this.buildPersonRecordFromSchema(personSchemaData);

            if (!Array.isArray(Data.persons)) {
                Data.persons = [];
            }

            const maxId = Data.persons.reduce((max, person) => {
                const personId = Number(person?.id);
                return Number.isFinite(personId) ? Math.max(max, personId) : max;
            }, 0);
            personRecord.id = maxId + 1;

            Data.persons.push(personRecord);
            Storage?.set?.('persons', Data.persons);

            this.renderList();

            input.value = '';
            this.createPanelOpen = false;
            const panel = document.getElementById('personCreatePanel');
            if (panel) panel.style.display = 'none';

            Notification?.show?.(t('storage.imported'));
            
        } catch (error) {
            console.error('person_create request failed:', error);
            Notification?.show?.(t('chat.errorResponseBackend'));
        } finally {
            this.setCreatePersonSubmitting(false);
        }
    },

    setCreatePersonSubmitting(isSubmitting) {
        const input = document.getElementById('personCreateWikipediaUrl');
        const submitBtn = document.getElementById('personCreateSubmitBtn');

        this.createPersonSubmitting = Boolean(isSubmitting);

        if (input) {
            input.disabled = this.createPersonSubmitting;
        }

        if (!submitBtn) return;

        submitBtn.disabled = this.createPersonSubmitting;

        if (this.createPersonSubmitting) {
            if (typeof Buttons !== 'undefined' && typeof Buttons.startProcessing === 'function') {
                Buttons.startProcessing(submitBtn, '', { indicator: 'dots' });
            }
            return;
        }

        if (typeof Buttons !== 'undefined' && typeof Buttons.stopProcessing === 'function') {
            Buttons.stopProcessing(submitBtn);
        }
    },

    parsePersonMessage(message) {
        if (message == null) return null;

        if (typeof message === 'string') {
            try {
                return JSON.parse(message);
            } catch {
                return null;
            }
        }

        if (typeof message === 'object' && !Array.isArray(message)) {
            return message;
        }

        return null;
    },

    buildPersonRecordFromSchema(schemaData) {

        return {
            id: Number(schemaData.id),
            name_pt: `${schemaData.name_pt ?? ''}`.trim(),
            name_en: `${schemaData.name_en ?? ''}`.trim(),
            name_es: `${schemaData.name_es ?? ''}`.trim(),
            image: '_person',
            sex: `${schemaData.sex ?? ''}`.toUpperCase().trim() === 'F' ? 'F' : 'M',
            birth: Number(schemaData.birth),
            death: schemaData.death == null ? '' : Number(schemaData.death),
            country_pt: `${schemaData.country_pt ?? ''}`.trim(),
            country_en: `${schemaData.country_en ?? ''}`.trim(),
            country_es: `${schemaData.country_es ?? ''}`.trim(),
            biography_pt: `${schemaData.biography_pt ?? ''}`.trim(),
            biography_en: `${schemaData.biography_en ?? ''}`.trim(),
            biography_es: `${schemaData.biography_es ?? ''}`.trim(),
        };
    },

    renderList() {
        const listContainer = document.getElementById('personsList');
        if (!listContainer) return;

        const persons = Data.getAll().filter((person) => this.matchesPersonSearch(person)).sort((a, b) => {
            const nameA = (a?.name || '').trim();
            const nameB = (b?.name || '').trim();
            return nameA.localeCompare(nameB, Language.current || 'pt', { sensitivity: 'base' });
        });

        if (persons.length === 0) {
            listContainer.innerHTML = `<div class="persons-empty">${t('persons.noData')}</div>`;
            return;
        }

        listContainer.innerHTML = persons.map(person => `
            <div class="person-item" onclick="Persons.toggleDetails(${person.id})">
                <div class="person-header">
                    <div class="person-avatar">
                        <img src="${Data.path}images/${person.image}.jpg" alt="${person.name}">
                    </div>
                    <div class="person-info">
                        <div class="person-name">${person.name}</div>
                        <div class="person-bio">${person.biography ? person.biography.substring(0, 100) + '...' : ''}</div>
                    </div>
                </div>
                <div id="person-details-${person.id}" class="person-details" style="display: none;" onclick="event.stopPropagation()"></div>
            </div>
        `).join('');
    },

    matchesPersonSearch(person) {
        const query = this.normalizeSearchText(this.searchQuery || '');
        if (!query) return true;

        const personRaw = Data.getRawById(person.id) || {};
        const candidates = [
            person?.name,
            person?.name_pt,
            person?.name_en,
            person?.name_es,
            personRaw?.name,
            personRaw?.name_pt,
            personRaw?.name_en,
            personRaw?.name_es,
        ];

        return candidates.some((value) => this.normalizeSearchText(value).includes(query));
    },

    normalizeSearchText(value) {
        return `${value ?? ''}`
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
            .trim();
    },

    updateSearchClearButton() {
        const searchClearBtn = document.getElementById('personSearchClearBtn');
        if (!searchClearBtn) return;
        const hasQuery = (this.searchQuery || '').trim() !== '';
        searchClearBtn.style.visibility = hasQuery ? 'visible' : 'hidden';
    },

    toggleDetails(id) {
        const details = document.getElementById(`person-details-${id}`);
        if (!details) return;

        const isHidden = details.style.display === 'none';

        if (isHidden) {
            const person = Data.getRawById(id); // Get raw data to support language switching
            if (!person) return;

            // Renderiza estrutura de tabs e conteúdo na primeira abertura
            if (details.innerHTML.trim() === '') {
                const availableLangs = Language.getAvailableLanguages();
                const currentLang = Language.current;

                const tabsHTML = availableLangs.map(lang => `
                    <button class="person-tab ${lang.code === currentLang ? 'active' : ''}" 
                            onclick="event.stopPropagation(); Persons.switchTab(${id}, '${lang.code}')">
                        ${lang.flag} ${lang.label}
                    </button>
                `).join('');

                const personLocalized = Data.localizePerson(person, currentLang);

                details.innerHTML = `
                    <div class="person-details-toolbar">
                        <div class="person-tabs">
                            ${tabsHTML}
                        </div>
                        <button class="person-delete-btn" onclick="event.stopPropagation(); Persons.deletePerson(${id}, event)" title="${t('storage.deleteItem')}">
                            ${Icons.trash}
                        </button>
                    </div>
                    <div id="person-content-${id}" class="person-content">
                        ${this.getDetailsTableHTML(personLocalized.id, currentLang)}
                    </div>
                `;
            }
            details.style.display = 'block';
            details.parentElement.classList.add('expanded');
        } else {
            details.style.display = 'none';
            details.parentElement.classList.remove('expanded');
        }
    },

    switchTab(id, langCode) {
        // Atualiza estilo das tabs
        const detailsContainer = document.getElementById(`person-details-${id}`);
        if (!detailsContainer) return;

        const tabs = detailsContainer.querySelectorAll('.person-tab');
        tabs.forEach(tab => {
            // Using a simpler check or data attribute would be better, but label matching works if labels are unique
            // Better: re-render tabs or check against the onclick attribute content
            if (tab.getAttribute('onclick').includes(`'${langCode}'`)) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Atualiza conteúdo da tabela
        const contentContainer = document.getElementById(`person-content-${id}`);
        const personRaw = Data.getRawById(id);
        if (!personRaw) return;

        contentContainer.innerHTML = this.getDetailsTableHTML(personRaw.id, langCode);
    },

    deletePerson(id, event) {
        event?.stopPropagation?.();

        const personRaw = Data.getRawById(id);
        if (!personRaw) return;

        const personName = Data.getLocalizedValue(personRaw, 'name') || personRaw.name || `${id}`;
        const confirmMessage = t('storage.confirmDelete', { key: personName }) || `Excluir ${personName}?`;

        if (!confirm(confirmMessage)) return;

        const index = Data.persons.findIndex((person) => person.id === id);
        if (index === -1) return;

        Data.persons.splice(index, 1);
        this.cleanEditStateForPerson(id);
        Storage?.set?.('persons', Data.persons);
        this.renderList();

        Notification?.show?.(t('storage.deleted'));
    },

    startEdit(id, field, langCode, event) {
        event?.stopPropagation?.();
        const key = `${id}_${langCode}_${field}`;
        const editMeta = { editing: true };

        if (field === 'biography') {
            const displayEl = document.getElementById(this.getDisplayId(id, field, langCode));
            if (displayEl) {
                const rect = displayEl.getBoundingClientRect();
                editMeta.width = Math.ceil(rect.width);
                editMeta.height = Math.ceil(rect.height);
            }
        }

        this.editState[key] = editMeta;
        this.rerenderDetailsContent(id, langCode);
    },

    cancelEdit(id, field, langCode, event) {
        event?.stopPropagation?.();
        delete this.editState[`${id}_${langCode}_${field}`];
        this.rerenderDetailsContent(id, langCode);
    },

    saveField(id, field, langCode, event) {
        event?.stopPropagation?.();

        const personRaw = Data.getRawById(id);
        if (!personRaw) return;

        const inputId = this.getInputId(id, field, langCode);
        const input = document.getElementById(inputId);
        if (!input) return;

        const rawKey = this.getRawFieldKey(field, langCode);
        if (!rawKey) return;

        const oldId = personRaw.id;
        const value = this.parseFieldValue(field, input.value);

        if (value === null && field !== 'death') {
            return;
        }

        personRaw[rawKey] = value;
        Storage?.set?.('persons', Data.persons);

        delete this.editState[`${id}_${langCode}_${field}`];

        const updatedId = personRaw.id;
        this.renderList();

        requestAnimationFrame(() => {
            this.toggleDetails(updatedId);
            this.switchTab(updatedId, langCode);
            if (field === 'id' && updatedId !== oldId) {
                this.cleanEditStateForPerson(oldId);
            }
        });
    },

    cleanEditStateForPerson(personId) {
        const prefix = `${personId}_`;
        Object.keys(this.editState).forEach((key) => {
            if (key.startsWith(prefix)) {
                delete this.editState[key];
            }
        });
    },

    rerenderDetailsContent(id, langCode) {
        const contentContainer = document.getElementById(`person-content-${id}`);
        if (!contentContainer) return;
        contentContainer.innerHTML = this.getDetailsTableHTML(id, langCode);
    },

    isEditing(id, field, langCode) {
        return !!this.editState[`${id}_${langCode}_${field}`];
    },

    getEditMeta(id, field, langCode) {
        const state = this.editState[`${id}_${langCode}_${field}`];
        if (state && typeof state === 'object') return state;
        return {};
    },

    getInputId(id, field, langCode) {
        return `person-edit-${id}-${langCode}-${field}`;
    },

    getDisplayId(id, field, langCode) {
        return `person-display-${id}-${langCode}-${field}`;
    },

    getRawFieldKey(field, langCode) {
        if (field === 'name' || field === 'country' || field === 'biography') {
            return `${field}_${langCode}`;
        }
        if (['id', 'image', 'sex', 'birth', 'death'].includes(field)) {
            return field;
        }
        return null;
    },

    getFieldValue(personRaw, field, langCode) {
        if (!personRaw) return '';

        if (field === 'name' || field === 'country' || field === 'biography') {
            return Data.getLocalizedValue(personRaw, field, langCode);
        }

        return personRaw[field] ?? '';
    },

    parseFieldValue(field, value) {
        if (field === 'biography') return value;

        if (field === 'id' || field === 'birth') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        }

        if (field === 'death') {
            if (value === '' || value === '-') return '';
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : '';
        }

        if (field === 'sex') {
            return (value || '').toUpperCase().trim().slice(0, 1) || 'M';
        }

        return value;
    },

    getDisplayFieldValue(field, value) {
        if (field === 'sex') {
            if (value === 'M') return t('newChat.male');
            if (value === 'F') return t('newChat.female');
        }
        if (field === 'death') {
            return value || '-';
        }
        if (field === 'biography') {
            return value || t('newChat.noBiography');
        }
        return value;
    },

    escapeHTML(value) {
        const div = document.createElement('div');
        div.textContent = `${value ?? ''}`;
        return div.innerHTML;
    },

    getEditableFieldHTML(personId, field, label, value, langCode, multiline = false) {
        const isEditing = this.isEditing(personId, field, langCode);
        const editMeta = this.getEditMeta(personId, field, langCode);
        const inputId = this.getInputId(personId, field, langCode);
        const displayId = this.getDisplayId(personId, field, langCode);
        const safeValue = this.escapeHTML(value);
        const displayValue = this.escapeHTML(this.getDisplayFieldValue(field, value));
        const actionTitle = t('settings.edit') || 'Editar';
        const saveTitle = t('settings.save') || 'Salvar';
        const cancelTitle = t('settings.cancel') || 'Cancelar';

        const inputHTML = (() => {
            if (field === 'sex') {
                return `
                    <select id="${inputId}" class="person-inline-input">
                        <option value="M" ${value === 'M' ? 'selected' : ''}>${this.escapeHTML(t('newChat.male'))}</option>
                        <option value="F" ${value === 'F' ? 'selected' : ''}>${this.escapeHTML(t('newChat.female'))}</option>
                    </select>
                `;
            }

            if (multiline) {
                const dimensionStyle = editMeta.width && editMeta.height
                    ? ` style="width:${editMeta.width}px;height:${editMeta.height}px;"`
                    : '';
                return `<textarea id="${inputId}" class="person-inline-input person-inline-textarea"${dimensionStyle}>${safeValue}</textarea>`;
            }

            return `<input id="${inputId}" class="person-inline-input" type="text" value="${safeValue}">`;
        })();

        return `
            <tr>
                <td class="person-label">${label}</td>
                <td class="person-value ${field === 'biography' ? 'bio-text' : ''}">
                    <div class="person-value-row">
                        <div class="person-value-content">
                            ${isEditing ? inputHTML : `<div id="${displayId}">${displayValue}</div>`}
                        </div>
                        <div class="person-field-actions">
                            ${isEditing
                                ? `
                                    <button class="person-field-btn" title="${saveTitle}" onclick="event.stopPropagation(); Persons.saveField(${personId}, '${field}', '${langCode}', event)">
                                        ${Icons.checkmarkSmall}
                                    </button>
                                    <button class="person-field-btn" title="${cancelTitle}" onclick="event.stopPropagation(); Persons.cancelEdit(${personId}, '${field}', '${langCode}', event)">
                                        ${Icons.close}
                                    </button>
                                `
                                : `
                                    <button class="person-field-btn" title="${actionTitle}" onclick="event.stopPropagation(); Persons.startEdit(${personId}, '${field}', '${langCode}', event)">
                                        ${Icons.pencil}
                                    </button>
                                `
                            }
                        </div>
                    </div>
                </td>
            </tr>
        `;
    },

    getDetailsTableHTML(personId, langCode) {
        const personRaw = Data.getRawById(personId);
        if (!personRaw) return '';

        const fields = [
            { key: 'image', label: t('persons.image') },
            { key: 'name', label: t('persons.name') },
            { key: 'sex', label: t('persons.sex') },
            { key: 'birth', label: t('persons.birth') },
            { key: 'death', label: t('persons.death') },
            { key: 'country', label: t('persons.country') },
            { key: 'biography', label: t('persons.biography'), multiline: true }
        ];

        const rowsHTML = fields.map((field) => {
            const value = this.getFieldValue(personRaw, field.key, langCode);
            return this.getEditableFieldHTML(personRaw.id, field.key, field.label, value, langCode, field.multiline);
        }).join('');

        return `
            <table class="person-table">
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>
        `;
    }

};
