/* ========================================
   Português (pt) - Traduções
   ======================================== */

Language.register('pt', {
    label: 'Português',
    flag: '🇧🇷',
    translations: {

        header: {
            language: 'Idioma',
            theme: 'Tema',
            themeLight: 'Claro',
            themeDark: 'Escuro',
            settings: 'Configurações',
            storage: 'Storage',
            people: 'Pessoas',
        },

        storage: {
            title: 'Dados do LocalStorage',
            import: 'Importar',
            export: 'Exportar',
            clearAll: 'Limpar tudo',
            key: 'Chave',
            noData: 'Nenhum dado encontrado no localStorage.',
            parseError: 'Erro ao processar os dados: {message}',
            confirmClear: 'Tem certeza que deseja limpar o localStorage?',
            cleared: 'LocalStorage limpo com sucesso!',
            imported: 'Storage importado com sucesso!',
            importError: 'Erro ao importar storage: {message}',
            noFile: 'Nenhum arquivo selecionado',
            fileError: 'Erro ao ler o arquivo',
            fileParseError: 'Erro ao processar o arquivo: {message}',
            confirmDelete: 'Tem certeza que deseja excluir "{key}"?',
            deleted: 'Item excluído com sucesso!',
            deleteItem: 'Excluir item',
            item: 'item',
            items: 'itens',
        },

        chat: {
            options: 'Opções',
            rename: 'Renomear chat',
            renameSave: 'Salvar',
            renamed: 'Chat renomeado com sucesso!',
            delete: 'Excluir chat',
            confirmDelete: 'Tem certeza que deseja excluir o chat "{name}"?',
            deleted: 'Chat excluído com sucesso!',
            clear: 'Limpar chat',
            clearing: 'Limpando...',
            confirmClear: 'Tem certeza que deseja limpar o chat "{name}"?',
            cleared: 'Chat limpo com sucesso!',
            selectChat: 'Selecione um chat para começar',
            placeholder: 'Digite uma mensagem...',
            send: 'Enviar',
            noMessages: 'Nenhuma mensagem ainda. Comece o chat!',
            errorSendBackend: 'Erro ao enviar mensagem ao backend',
            errorResponseBackend: 'Erro ao gerar resposta no backend',
            errorDeleteBackend: 'Erro ao excluir chat no backend',
            errorClearBackend: 'Erro ao limpar chat no backend',
            waitResponse: 'Aguarde a resposta terminar antes de trocar de chat.',
            limitReached: 'Este chat atingiu o limite de {max} mensagens. Para continuar: (1) limpe o chat ou (2) crie um novo chat.',
            startHint: 'Comece uma conversa! Escreva algo e clique no botão de enviar.',
            avatarHint: 'Escolha uma pessoa acima e clique no avatar dela para obter uma resposta!',
        },

        newChat: {
            title: 'Novo Chat',
            search: 'Buscar pessoa...',
            learnMore: 'Saiba mais...',
            learnMoreTitle: 'Sobre {name}',
            noBiography: 'Biografia não disponível neste idioma.',
            filters: 'Filtros',
            allSex: 'Todos os Sexos',
            male: 'Masculino',
            female: 'Feminino',
            allCountries: 'Todos os Países',
            sortName: 'Nome',
            sortBirth: 'Nascimento',
            selected: 'selecionado(s)',
            clearSelection: 'Limpar',
            groupName: 'Nome do grupo...',
            cancel: 'Cancelar',
            create: 'Criar Chat',
            noResults: 'Nenhuma pessoa encontrada.',
            noChats: 'Nenhum chat. Clique no lápis para criar um.',
            maxGroup: 'máx. {max}',
        },

        footer: {
            text: 'Essa aplicação é parte integrante da',
            rights: 'Todos os direitos reservados.',
        },

        app: {
            name: 'Template',
        },

        persons: {
            id: 'ID',
            image: 'Imagem',
            name: 'Nome',
            sex: 'Sexo',
            birth: 'Nascimento',
            death: 'Falecimento',
            country: 'País',
            biography: 'Biografia',
            searchPlaceholder: 'Buscar pessoa por nome...',
            createPersonTitle: 'Criar pessoa',
            createButton: 'Criar',
            wikipediaUrlPlaceholder: 'Cole o link da Wikipedia',
            wikipediaUrlInvalid: 'Informe um link válido da Wikipedia.',
            noData: 'Nenhuma pessoa encontrada.',
        },

    }
});
