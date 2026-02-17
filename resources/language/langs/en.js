/* ========================================
   English (en) - Translations
   ======================================== */

Language.register('en', {
    label: 'English',
    flag: '🇺🇸',
    translations: {

        header: {
            language: 'Language',
            theme: 'Theme',
            themeLight: 'Light',
            themeDark: 'Dark',
            settings: 'Settings',
            storage: 'Storage',
            people: 'People',
        },

        storage: {
            title: 'LocalStorage Data',
            import: 'Import',
            export: 'Export',
            clearAll: 'Clear all',
            key: 'Key',
            noData: 'No data found in localStorage.',
            parseError: 'Error processing data: {message}',
            confirmClear: 'Are you sure you want to clear localStorage?',
            cleared: 'LocalStorage cleared successfully!',
            imported: 'Storage imported successfully!',
            importError: 'Error importing storage: {message}',
            noFile: 'No file selected',
            fileError: 'Error reading file',
            fileParseError: 'Error processing file: {message}',
            confirmDelete: 'Are you sure you want to delete "{key}"?',
            deleted: 'Item deleted successfully!',
            deleteItem: 'Delete item',
            item: 'item',
            items: 'items',
        },

        chat: {
            options: 'Options',
            rename: 'Rename chat',
            renameSave: 'Save',
            renamed: 'Chat renamed successfully!',
            delete: 'Delete chat',
            confirmDelete: 'Are you sure you want to delete the chat "{name}"?',
            deleted: 'Chat deleted successfully!',
            clear: 'Clear chat',
            clearing: 'Clearing...',
            confirmClear: 'Are you sure you want to clear the chat "{name}"?',
            cleared: 'Chat cleared successfully!',
            selectChat: 'Select a chat to start',
            placeholder: 'Type a message...',
            send: 'Send',
            noMessages: 'No messages yet. Start the chat!',
            errorSendBackend: 'Error sending message to backend',
            errorResponseBackend: 'Error generating response on backend',
            errorDeleteBackend: 'Error deleting chat on backend',
            errorClearBackend: 'Error clearing chat on backend',
            waitResponse: 'Wait for the response to finish before switching chats.',
            limitReached: 'This chat has reached the limit of {max} messages. To continue: (1) clear the chat or (2) create a new chat.',
            startHint: 'Start a conversation! Type something and click the send button.',
            avatarHint: 'Choose a person above and click on their avatar to get a response!',
        },

        newChat: {
            title: 'New Chat',
            search: 'Search person...',
            learnMore: 'Learn more...',
            learnMoreTitle: 'About {name}',
            noBiography: 'Biography is not available in this language.',
            filters: 'Filters',
            allSex: 'All Genders',
            male: 'Male',
            female: 'Female',
            allCountries: 'All Countries',
            sortName: 'Name',
            sortBirth: 'Birth Year',
            selected: 'selected',
            clearSelection: 'Clear',
            groupName: 'Group name...',
            cancel: 'Cancel',
            create: 'Create Chat',
            noResults: 'No persons found.',
            noChats: 'No chats. Click the pencil to create one.',
            maxGroup: 'max. {max}',
        },

        footer: {
            text: 'This application is part of',
            rights: 'All rights reserved.',
        },

        app: {
            name: 'Template',
        },

        persons: {
            id: 'ID',
            image: 'Image',
            name: 'Name',
            sex: 'Sex',
            birth: 'Birth',
            death: 'Death',
            country: 'Country',
            biography: 'Biography',
            searchPlaceholder: 'Search person by name...',
            createPersonTitle: 'Create person',
            createButton: 'Create',
            wikipediaUrlPlaceholder: 'Paste the Wikipedia link',
            wikipediaUrlInvalid: 'Please provide a valid Wikipedia link.',
            noData: 'No persons found.',
        },

    }
});
