# SolverBots

SolverBots is an interactive chatbot platform based on historical and philosophical personalities. The application allows users to chat with bots that assume the identity of great thinkers, scientists, and historical figures, answering questions in the style and context of each personality.

## How It Works

Users create individual or group conversations (with up to 5 personalities) and interact through text messages. Each bot responds based on a prompt that includes the personality's biography, the selected language, and the conversation history. Responses are generated in real time via streaming (Server-Sent Events) through the OpenAI API, relayed by the PHP backend acting as a proxy.

The application is multilingual (Portuguese, English, and Spanish), features light/dark themes, and stores conversations and settings in the browser's `localStorage`. New personalities can be automatically created from Wikipedia URLs.

---

## Project Structure

```
solverbots/
│
├── index.html                      # Main page (entry point)
├── readme.md                       # Project documentation
│
├── backend/                        # PHP backend (proxy for the OpenAI API)
│   ├── config.php                  # OpenAI API key
│   ├── index.php                   # Request router (CORS, validation, routing)
│   ├── inc_responses_create_stream.php  # Response streaming via SSE (GPT)
│   └── inc_person_create.php       # Personality creation from Wikipedia URL
│
├── components/                     # UI visual components
│   ├── header/
│   │   ├── Header.js               # Header with menu (language, theme, settings)
│   │   └── Header.css
│   ├── main/
│   │   ├── Main.js                 # Main container (chats and conversation columns)
│   │   ├── Main.css
│   │   ├── biography/
│   │   │   ├── Biography.js        # Personality biography modal
│   │   │   └── Biography.css
│   │   ├── chat/
│   │   │   ├── Chat.js             # Active conversation panel (messages + input)
│   │   │   └── Chat.css
│   │   ├── chats/
│   │   │   ├── Chats.js            # Conversation list (WhatsApp-style sidebar)
│   │   │   └── Chats.css
│   │   ├── message/
│   │   │   ├── Message.js          # Message rendering and sending
│   │   │   └── Message.css
│   │   ├── messages/
│   │   │   ├── Messages.js         # Message history management
│   │   │   └── Messages.css
│   │   └── newChat/
│   │       ├── NewChat.js          # New conversation modal (individual/group)
│   │       └── NewChat.css
│   └── footer/
│       ├── Footer.js               # Footer with credits
│       └── Footer.css
│
├── persons/                        # Personality data and logic
│   ├── Data.js                     # Data loading and access (with localization)
│   ├── Data.json                   # Personality database (JSON)
│   ├── Person.js                   # Class for personality resolution by ID/name
│   ├── Persons.js                  # Personality management modal (CRUD)
│   ├── Persons.css
│   └── images/                     # Personality photos (.jpg)
│
├── resources/                      # Application resources and utilities
│   ├── app/
│   │   ├── App.js                  # Application initialization (JS entry point)
│   │   └── App.css                 # Global styles
│   ├── buttons/
│   │   ├── Buttons.js              # Reusable button component
│   │   ├── Buttons.css
│   │   └── index.html              # Button demo page
│   ├── icons/
│   │   ├── Icons.js                # SVG icon library
│   │   ├── index.html              # Icon demo page
│   │   ├── script.js
│   │   └── style.css
│   ├── language/
│   │   ├── Language.js             # Internationalization system (i18n)
│   │   └── langs/
│   │       ├── pt.js               # Portuguese translations
│   │       ├── en.js               # English translations
│   │       └── es.js               # Spanish translations
│   ├── notification/
│   │   ├── Notification.js         # Toast notification system
│   │   ├── Notification.css
│   │   └── index.html              # Demo page
│   ├── prompt/
│   │   └── Prompt.js               # Prompt assembly and backend communication (SSE)
│   ├── settings/
│   │   └── Settings.js             # Settings (backend URL)
│   ├── storage/
│   │   ├── Storage.js              # localStorage management (import/export/clear)
│   │   └── Storage.css
│   └── theme/
│       ├── Theme.js                # Light/dark theme system
│       └── Theme.css
│
└── img/                            # General images (logo, icon)
```

---

## File Descriptions

### index.html

Main application page. Loads all CSS styles and JS scripts, as well as external dependencies (Marked for Markdown and SolverJS). Defines the base structure with `header`, `main`, and `footer`.

### backend/

- **config.php** — Stores the OpenAI API key.
- **index.php** — Backend entry point. Configures CORS, validates the POST method and JSON body, and routes to the appropriate resource (`responses_create_stream` or `person_create`).
- **inc_responses_create_stream.php** — Sends the prompt to the OpenAI API (GPT model) and relays the response via streaming (SSE) directly to the client.
- **inc_person_create.php** — Receives a Wikipedia URL and uses the OpenAI API to extract structured personality data (name, biography, country) in three languages.

### components/

Visual components organized by functionality:

- **Header** — Menu with language selection, theme toggle, and access to settings (storage and personalities).
- **Main** — Container that organizes the conversation sidebar and chat panel.
- **Chats** — Side panel listing conversations with search and date sorting.
- **Chat** — Active conversation panel with message area, input, and member avatars.
- **NewChat** — Modal for creating individual or group conversations, with filters for sex, country, and sorting.
- **Messages** — Message history control (limit of 30 per conversation).
- **Message** — Message rendering (user and bot), sending, and response streaming.
- **Biography** — Modal displaying the formatted biography of a personality.
- **Footer** — Footer with credits and link to SolverEdu.

### persons/

- **Data.js** — Loads `Data.json` and provides query methods with localization support (pt/en/es).
- **Data.json** — Database with all personalities (name, biography, country, birth, death, sex, image).
- **Person.js** — Utility class to resolve a personality by ID or name.
- **Persons.js** — Personality management modal (listing, editing, deleting, and creation via Wikipedia).
- **images/** — Personality photos in JPG format.

### resources/

- **App.js** — JavaScript entry point. Initializes all modules in the correct order.
- **Language.js** — i18n system with automatic browser language detection and nested key translation support.
- **Prompt.js** — Assembles the prompt with instructions, biography, and history, and manages backend communication via streaming (SSE).
- **Settings.js** — Defines the backend URL (with automatic local/production environment detection).
- **Storage.js** — Manages `localStorage` with a visual interface for importing, exporting, and clearing data.
- **Theme.js** — Toggles between light and dark themes, with persistence and system preference listening.
- **Notification.js** — Displays temporary toast notifications (success, error, warning, info).
- **Icons.js** — SVG icon library used in the interface.
- **Buttons.js** — Reusable button component.

---

## Technologies

- **Frontend:** Plain HTML, CSS, and JavaScript (no frameworks)
- **Backend:** PHP
- **AI:** OpenAI API 
- **External dependencies:**
  - [Marked](https://github.com/markedjs/marked) — Markdown rendering
  - [SolverJS](https://solvertank.tech/solverjs/) — Utility library

---

## Installation

1. Copy all project files to a directory on the Apache server (e.g., `/var/www/html/solverbots/` or the corresponding `htdocs` folder).
2. Edit the `backend/config.php` file and insert your OpenAI API key:

   ```php
   <?php
   $openai_api_key = "your-key-here";
   ```
3. Make sure PHP is enabled on Apache and the `curl` extension is active.
