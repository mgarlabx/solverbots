/* ========================================
   Español (es) - Traducciones
   ======================================== */

Language.register('es', {
    label: 'Español',
    flag: '🇪🇸',
    translations: {

        header: {
            language: 'Idioma',
            theme: 'Tema',
            themeLight: 'Claro',
            themeDark: 'Oscuro',
            settings: 'Configuración',
            storage: 'Storage',
            people: 'Personas',
        },

        storage: {
            title: 'Datos del LocalStorage',
            import: 'Importar',
            export: 'Exportar',
            clearAll: 'Borrar todo',
            key: 'Clave',
            noData: 'No se encontraron datos en el localStorage.',
            parseError: 'Error al procesar los datos: {message}',
            confirmClear: '¿Estás seguro de que deseas borrar el localStorage?',
            cleared: '¡LocalStorage borrado con éxito!',
            imported: '¡Storage importado con éxito!',
            importError: 'Error al importar storage: {message}',
            noFile: 'Ningún archivo seleccionado',
            fileError: 'Error al leer el archivo',
            fileParseError: 'Error al procesar el archivo: {message}',
            confirmDelete: '¿Estás seguro de que deseas eliminar "{key}"?',
            deleted: '¡Elemento eliminado con éxito!',
            deleteItem: 'Eliminar elemento',
            item: 'elemento',
            items: 'elementos',
        },

        chat: {
            options: 'Opciones',
            rename: 'Renombrar chat',
            renameSave: 'Guardar',
            renamed: '¡Chat renombrado con éxito!',
            delete: 'Eliminar chat',
            confirmDelete: '¿Estás seguro de que deseas eliminar el chat "{name}"?',
            deleted: '¡Chat eliminado con éxito!',
            clear: 'Limpiar chat',
            clearing: 'Limpiando...',
            confirmClear: '¿Estás seguro de que deseas limpiar el chat "{name}"?',
            cleared: '¡Chat limpiado con éxito!',
            selectChat: 'Selecciona un chat para comenzar',
            placeholder: 'Escribe un mensaje...',
            send: 'Enviar',
            noMessages: '¡Aún no hay mensajes. ¡Inicia el chat!',
            errorSendBackend: 'Error al enviar mensaje al backend',
            errorResponseBackend: 'Error al generar respuesta en el backend',
            errorDeleteBackend: 'Error al eliminar chat en el backend',
            errorClearBackend: 'Error al limpiar chat en el backend',
            waitResponse: 'Espera a que termine la respuesta antes de cambiar de chat.',
            limitReached: 'Este chat alcanzó el límite de {max} mensajes. Para continuar: (1) limpia el chat o (2) crea un nuevo chat.',
            startHint: '¡Comienza una conversación! Escribe algo y haz clic en el botón de enviar.',
            avatarHint: '¡Elige una persona arriba y haz clic en su avatar para obtener una respuesta!',
        },

        newChat: {
            title: 'Nuevo Chat',
            search: 'Buscar persona...',
            learnMore: 'Saber más...',
            learnMoreTitle: 'Acerca de {name}',
            noBiography: 'La biografía no está disponible en este idioma.',
            filters: 'Filtros',
            allSex: 'Todos los Sexos',
            male: 'Masculino',
            female: 'Femenino',
            allCountries: 'Todos los Países',
            sortName: 'Nombre',
            sortBirth: 'Nacimiento',
            selected: 'seleccionado(s)',
            clearSelection: 'Limpiar',
            groupName: 'Nombre del grupo...',
            cancel: 'Cancelar',
            create: 'Crear Chat',
            noResults: 'Ninguna persona encontrada.',
            noChats: 'Sin chats. Haz clic en el lápiz para crear uno.',
            maxGroup: 'máx. {max}',
        },

        footer: {
            text: 'Esta aplicación es parte integral de',
            rights: 'Todos los derechos reservados.',
        },

        app: {
            name: 'Template',
        },

        persons: {
            id: 'ID',
            image: 'Imagen',
            name: 'Nombre',
            sex: 'Sexo',
            birth: 'Nacimiento',
            death: 'Fallecimiento',
            country: 'País',
            biography: 'Biografía',
            searchPlaceholder: 'Buscar persona por nombre...',
            createPersonTitle: 'Crear persona',
            createButton: 'Crear',
            wikipediaUrlPlaceholder: 'Pega el enlace de Wikipedia',
            wikipediaUrlInvalid: 'Ingresa un enlace válido de Wikipedia.',
            noData: 'Ninguna persona encontrada.',
        },

    }
});
