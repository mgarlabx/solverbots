const Storage = {

    item: {},

    init() {
        // Inicialização do storage
        this.createModalIfNotExists();

        // Re-cria o modal quando o idioma mudar
        Language.onChange(() => {
            const modal = document.getElementById('storageModal');
            if (modal) modal.remove();
            this.createModalIfNotExists();
        });
    },

    createModalIfNotExists() {
        // Verifica se o modal já existe
        if (document.getElementById('storageModal')) {
            return;
        }

        // Cria o modal dinamicamente
        const modalHTML = `
            <div id="storageModal" class="storage-modal">
                <div class="storage-modal-content">
                    <div class="storage-modal-header">
                        <h2>${t('storage.title')}</h2>
                        <div class="storage-modal-actions">
                            <button id="uploadStorageBtn" class="storage-modal-action" title="${t('storage.import')}">
                                ${Icons.upload}
                            </button>
                            <button id="downloadStorageBtn" class="storage-modal-action" title="${t('storage.export')}">
                                ${Icons.download}
                            </button>
                            <button id="clearStorageBtn" class="storage-modal-action" title="${t('storage.clearAll')}">
                                ${Icons.trash}
                            </button>
                            <button id="closeStorageModal" class="storage-modal-close">
                                ${Icons.close}
                            </button>
                        </div>
                    </div>
                    <div class="storage-modal-body">
                        <div class="storage-info">
                            <strong>${t('storage.key')}:</strong> <span id="storageKeyName">${App.name}</span>
                        </div>
                        <div id="storageContent" class="storage-content"></div>
                    </div>
                </div>
            </div>
        `;

        // Adiciona o modal ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    clearHandler() {
        if (confirm(t('storage.confirmClear'))) {
            this.clear();

            // Atualizar o modal se estiver aberto
            const modal = document.getElementById('storageModal');
            if (modal && modal.classList.contains('show')) {
                this.refreshModalContent();
            }

            Notification.show(t('storage.cleared'));
        }
    },

    async uploadHandler() {
        try {
            await this.upload();
            Notification.show(t('storage.imported'));

            // Atualizar o modal se estiver aberto
            const modal = document.getElementById('storageModal');
            if (modal && modal.classList.contains('show')) {
                this.refreshModalContent();
            }
        } catch (error) {
            Notification.show(t('storage.importError', { message: error.message }));
        }
    },

    refreshModalContent() {
        const content = document.getElementById('storageContent');
        if (!content) return;

        // Pegar dados do localStorage
        const storageData = localStorage.getItem(App.name);

        if (!storageData) {
            content.innerHTML = `<div class="json-empty">${t('storage.noData')}</div>`;
        } else {
            try {
                const parsed = JSON.parse(storageData);

                // Envolver o JSON raiz em uma estrutura clicável
                const isArray = Array.isArray(parsed);
                const count = Object.keys(parsed).length;
                const bracket = isArray ? '[' : '{';
                const closeBr = isArray ? ']' : '}';

                let html = '<div class="json-root">';
                html += '<div class="json-line" data-expandable="true">';
                html += `<span class="json-toggle expanded">${Icons.arrow}</span>`;
                html += `<span class="json-bracket">${bracket}</span>`;
                html += `<span class="json-count">${count} ${count === 1 ? t('storage.item') : t('storage.items')}</span>`;
                html += `<span class="json-bracket"> ${closeBr}</span>`;
                html += '</div>';
                html += `<div class="json-children expanded">${this.renderJSON(parsed, 1)}</div>`;
                html += '</div>';

                content.innerHTML = html;

                this.attachJSONToggleListeners(content);
                this.attachDeleteListeners(content, parsed);
            } catch (error) {
                content.innerHTML = `<div class="json-empty">${t('storage.parseError', { message: error.message })}</div>`;
            }
        }
    },

    save() {
        localStorage.setItem(App.name, JSON.stringify(this.item));
    },

    load() {
        const data = localStorage.getItem(App.name);
        if (data) {
            this.item = JSON.parse(data);
        }
    },

    clear() {
        localStorage.removeItem(App.name);
        this.item = {};
    },

    download() {
        const dataStr = JSON.stringify(this.item, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${App.name}-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    upload() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) {
                    reject(new Error(t('storage.noFile')));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.item = data;
                        this.save();
                        resolve(data);
                    } catch (error) {
                        reject(new Error(t('storage.fileParseError', { message: error.message })));
                    }
                };
                reader.onerror = () => reject(new Error(t('storage.fileError')));
                reader.readAsText(file);
            };

            input.click();
        });
    },

    view() {
        // Garante que o modal existe
        this.createModalIfNotExists();

        const modal = document.getElementById('storageModal');
        const content = document.getElementById('storageContent');
        const closeBtn = document.getElementById('closeStorageModal');
        const uploadBtn = document.getElementById('uploadStorageBtn');
        const downloadBtn = document.getElementById('downloadStorageBtn');
        const clearBtn = document.getElementById('clearStorageBtn');

        if (!modal || !content) return;

        // Configurar handlers dos botões de ação
        if (uploadBtn) {
            uploadBtn.onclick = (e) => {
                e.stopPropagation();
                this.uploadHandler();
            };
        }

        if (downloadBtn) {
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                this.download();
            };
        }

        if (clearBtn) {
            clearBtn.onclick = (e) => {
                e.stopPropagation();
                this.clearHandler();
            };
        }

        // Pegar dados do localStorage
        const storageData = localStorage.getItem(App.name);

        if (!storageData) {
            content.innerHTML = `<div class="json-empty">${t('storage.noData')}</div>`;
        } else {
            try {
                const parsed = JSON.parse(storageData);

                // Envolver o JSON raiz em uma estrutura clicável
                const isArray = Array.isArray(parsed);
                const count = Object.keys(parsed).length;
                const bracket = isArray ? '[' : '{';
                const closeBr = isArray ? ']' : '}';

                let html = '<div class="json-root">';
                html += '<div class="json-line" data-expandable="true">';
                html += `<span class="json-toggle expanded">${Icons.arrow}</span>`;
                html += `<span class="json-bracket">${bracket}</span>`;
                html += `<span class="json-count">${count} ${count === 1 ? t('storage.item') : t('storage.items')}</span>`;
                html += `<span class="json-bracket"> ${closeBr}</span>`;
                html += '</div>';
                html += `<div class="json-children expanded">${this.renderJSON(parsed, 1)}</div>`;
                html += '</div>';

                content.innerHTML = html;

                this.attachJSONToggleListeners(content);
                this.attachDeleteListeners(content, parsed);
            } catch (error) {
                content.innerHTML = `<div class="json-empty">${t('storage.parseError', { message: error.message })}</div>`;
            }
        }

        // Mostrar modal
        modal.classList.add('show');

        // Fechar modal ao clicar no botão de fechar
        const closeModal = () => {
            modal.classList.remove('show');
        };

        closeBtn.onclick = closeModal;

        // Fechar modal ao clicar fora do conteúdo
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };

        // Fechar modal com a tecla ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };

        document.addEventListener('keydown', handleEscape);
    },

    renderJSON(data, level = 0, path = []) {
        if (data === null) {
            return '<span class="json-value null">null</span>';
        }

        if (typeof data !== 'object') {
            const type = typeof data;
            return `<span class="json-value ${type}">${this.escapeHTML(JSON.stringify(data))}</span>`;
        }

        const isArray = Array.isArray(data);
        const entries = Object.entries(data);
        const isEmpty = entries.length === 0;

        if (isEmpty) {
            return `<span class="json-bracket">${isArray ? '[]' : '{}'}</span>`;
        }

        let html = '';

        entries.forEach(([key, value], index) => {
            const isExpandable = value !== null && typeof value === 'object' && Object.keys(value).length > 0;
            const comma = index < entries.length - 1 ? ',' : '';
            const currentPath = [...path, key];
            const pathStr = JSON.stringify(currentPath);

            html += '<div class="json-item">';
            html += `<div class="json-line" data-expandable="${isExpandable}" data-path='${this.escapeHTML(pathStr)}'>`;

            if (isExpandable) {
                html += `<span class="json-toggle">${Icons.arrow}</span>`;
            } else {
                html += '<span class="json-toggle" style="visibility: hidden;"></span>';
            }

            if (!isArray) {
                html += `<span class="json-key">"${this.escapeHTML(key)}"</span>`;
                html += '<span class="json-colon">:</span>';
            }

            if (isExpandable) {
                const valueIsArray = Array.isArray(value);
                const valueCount = Object.keys(value).length;
                const bracket = valueIsArray ? '[' : '{';
                const closeBr = valueIsArray ? ']' : '}';
                html += `<span class="json-bracket">${bracket}</span>`;
                html += `<span class="json-count">${valueCount} ${valueCount === 1 ? t('storage.item') : t('storage.items')}</span>`;
                html += `<span class="json-bracket"> ${closeBr}</span>`;
                html += `<span class="json-value">${comma}</span>`;
                html += `<span class="json-delete" title="${t('storage.deleteItem')}">${Icons.trash}</span>`;
                html += '</div>';
                html += `<div class="json-children">${this.renderJSON(value, level + 1, currentPath)}</div>`;
            } else {
                html += this.renderJSON(value, level + 1, currentPath);
                html += `<span class="json-value">${comma}</span>`;
                html += `<span class="json-delete" title="${t('storage.deleteItem')}">${Icons.trash}</span>`;
                html += '</div>';
            }

            html += '</div>';
        });

        return html;
    },

    attachJSONToggleListeners(container) {
        const lines = container.querySelectorAll('.json-line[data-expandable="true"]');

        lines.forEach(line => {
            line.addEventListener('click', (e) => {
                // Ignorar clique se for no botão de delete
                if (e.target.closest('.json-delete')) {
                    return;
                }

                e.stopPropagation();

                const toggle = line.querySelector('.json-toggle');
                const children = line.nextElementSibling;

                if (toggle && children && children.classList.contains('json-children')) {
                    const isExpanded = children.classList.contains('expanded');

                    if (isExpanded) {
                        toggle.classList.remove('expanded');
                        children.classList.remove('expanded');
                    } else {
                        toggle.classList.add('expanded');
                        children.classList.add('expanded');
                    }
                }
            });
        });
    },

    attachDeleteListeners(container, data) {
        const deleteButtons = container.querySelectorAll('.json-delete');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();

                const line = btn.closest('.json-line');
                const pathStr = line.getAttribute('data-path');

                if (!pathStr) return;

                const path = JSON.parse(pathStr);
                const key = path[path.length - 1];

                if (confirm(t('storage.confirmDelete', { key }))) {
                    this.deleteItemByPath(data, path);
                    this.item = data;
                    this.save();

                    // Recarregar a visualização
                    this.view();

                    Notification.show(t('storage.deleted'));
                }
            });
        });
    },

    deleteItemByPath(obj, path) {
        if (path.length === 0) return;

        if (path.length === 1) {
            delete obj[path[0]];
            return;
        }

        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
            if (!current) return;
        }

        const lastKey = path[path.length - 1];
        if (Array.isArray(current)) {
            current.splice(parseInt(lastKey), 1);
        } else {
            delete current[lastKey];
        }
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },



    // Daqui para cima são métodos agnósticos, podem ser usados em qualquer aplicação
    // ###########################################################################################################
    // A partir daqui, métodos são específicos para a aplicação

    get(key) {
        return this.item[key] ?? null;
    },

    del(key) {
        delete this.item[key];
        this.save();
    },

    set(key, value) {
        this.item[key] = value;
        this.save();
    },


};

