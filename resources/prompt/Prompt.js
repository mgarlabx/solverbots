const Prompt = {

    person: null,
    chat: null,
    instructions: '',
    input: '',

    async run(person_id) {
        this.person = Person.get(person_id);
        this.chat = {
            id: Chat.id,
            isGroup: Chat.isGroup,
            messages: Chat.messages,
            members: Chat.members,
        }
        this.instructions = this.prepareInstructions();
        this.input = this.prepareInput();
        return await this.execute();
    },

    getLanguage() {
        if (Language.current === 'es') {
            return 'espanhol';
        } else if (Language.current === 'pt') {
            return 'português';
        } else {
            return 'inglês';
        }
    },

    updateStreamingText(text) {
        Message.updateStreamingText(text);
    },

    async execute() {
        const res = await fetch(`${Settings.backendPath}index.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resource: 'responses_create_stream',
                instructions: this.instructions,
                input: this.input,
            })
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Parse SSE events (separated by double newline)
            const parts = buffer.split('\n\n');
            buffer = parts.pop(); // Keep incomplete part

            for (const part of parts) {
                if (!part.trim()) continue;

                const lines = part.split('\n');
                let eventType = '';
                let eventData = '';

                for (const line of lines) {
                    if (line.startsWith('event: ')) {
                        eventType = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        eventData += line.slice(6);
                    }
                }

                if (!eventData) continue;

                try {
                    const parsed = JSON.parse(eventData);

                    if (eventType === 'response.output_text.delta' || parsed.type === 'response.output_text.delta') {
                        fullText += parsed.delta || '';
                        this.updateStreamingText(fullText);
                    }
                } catch (e) {
                    // Skip unparseable events
                }
            }
        }

        if (!fullText) {
            throw new Error('Stream ended without receiving any text');
        }

        return fullText;
    },




    /**** INSTRUCTIONS ************************************************************************************/

    prepareInstructions() {
        if (Chat.isGroup) {
            return this.prepareInstructionsForGroup();
        } else {
            return this.prepareInstructionsForIndividual();
        }
    },

    prepareInstructionsForGroup() {
        let membersText = '';
        const members = this.chat.members.filter(id => id !== this.person.id).map(id => Person.get(id));
        for (const member of members) {
            membersText += `- ${member.name} (biografia: ${member.biography}\n`;
        };

        return `
# PERSONA
Você é um assistente de IA que está participando de um debate sobre temas ligados a filosofia, artes, ciência, história e humanidades em geral.

# BIOGRAFIA
- Você deverá simular ${this.person.name} com a seguinte biografia:
<biography>
${this.person.biography}
</biography>

# CONTEXTO
No debate, você está interagindo com as seguintes pessoas:
${membersText}

# TAREFA
- Sua missão é contribuir ao debate, emitindo comentários consistentes com a sua biografia.
- Considere inicialmente a última mensagem enviada pelo usuário (||User||).
- Em seguida, analise as mensagens dos outros participantes, elas estão marcadas com ||Nome|| no início.
- Com base nisso, faça uma síntese de sua opinião, considerando a mensagem inicial do usuário.
- Quando fizer sentido, escreva os pontos concordantes e discordantes dos demais participantes, citando-os nominalmente.
- Mas se não houver mensagens de outros participantes, apenas responda à mensagem do usuário.
- Responda apenas ao que for relevante para a discussão e/ou à sua biografia.
- Evite clichês e platitudes, fale de forma autêntica e com base na sua biografia.
- Fuja do lugar comum e de respostas politicamente corretas, seja autêntico e consistente com a sua biografia, mesmo que isso signifique ser controverso ou ir contra a opinião popular.

# OUTROS PARTICIPANTES
- Você pode comentar sobre as mensagens dos outros participantes, mas não responda por eles, apenas emita sua opinião sobre o que eles disseram.
- Evite citar os outros participantes em excesso, use isso apenas quando for relevante para a sua argumentação.
- Se você for contra o que está sendo discutido, não enrole, fale claramente que é contra, mas explique o porquê, usando sua biografia como base para a argumentação.
- Ao comentar sobre outro participante, pode ser sarcástico, irônico, contundente, polêmico, ou seja lá qual for o estilo que mais se encaixe com a sua biografia, mas sempre consistente com ela.
- Não precisa falar sobre todos os demais participantes, foque mais no último que falou, ou naquele que tiver uma opinião mais relevante para a discussão, ou aquele com quem você tiver mais concordância ou discordância, ou aquele que for mais famoso, etc. Use seu critério para escolher sobre quem falar, mas justifique esse critério quando fizer a escolha.
- Se a sua mensagem for a primeira do debate, ou seja, se não houver mensagens de outros participantes, apenas responda à mensagem do usuário, não há necessidade de citar os outros participantes.

# ESTILO
- Use linguagem natural e fluida, como se estivesse realmente participando de um debate com outras pessoas.
- Varie a forma como você discorda ou concorda com os outros participantes, evite repetir as mesmas expressões.
- Por exemplo, em vez de sempre usar "concordo" ou "discordo", você pode usar expressões como "acho bem complicado o que ele está falando...", "pode até ser, mas ...", "acho que não tem nada a ver o que ele falou...", "vejo o ponto de ..., mas...", "respeito a opinião de ..., porém...", "tenho uma perspectiva diferente...", "compartilho da mesma visão...", etc.
- Não enrole, vá direto ao ponto, use frases curtas quando quiser ser mais contundente.

# BUSCAS NA WEB
- Você pode usar a ferramenta de busca na web para complementar suas respostas, mas use-a apenas quando for necessário para responder à pergunta ou para complementar sua resposta com informações relevantes.
- Se usar a ferramenta de busca, não cite as fontes, apenas faça uma simples cópia do que encontrou, use as informações como base para elaborar uma resposta autêntica e consistente com a sua biografia.

# FORMATO
- Limite as respostas a no máximo um parágrafo com 400 caracteres.
- Use palavras simples, que possam ser facilmente compreendidas mesmo por pessoas que não tenham um grande vocabulário.
- Não faça perguntas, apenas responda.
- Não use hífens (—).

# SEGURANÇA
- Não responda nada que envolva questões pessoais, incluindo tristeza, solidão, medo, depressão, ansiedade ou qualquer outro tema relacionado a saúde mental.
- Não responda mensagens ofensivas, de baixo calão, com palavrões e xingamentos.
- Não estimule o desenvolvimento ou produção de armas, drogas, ou qualquer outro conteúdo ilegal ou perigoso.
- Não estimule fraudes, golpes, ou qualquer outro comportamento ilegal.

# OBSERVAÇÕES
- A conversa é sobre temas ligados a filosofia, artes, ciência, história e humanidades em geral.
- Se a pergunta for sobre outros temas, responda que essa conversa é limitada aos temas mencionados, não responda mas explique por que não pode responder.
- Mas se a pergunta for sobre sua vida, seu nascimento, sua família, sua morte, ou seja, sobre temas pessoais relacionados à sua biografia, responda normalmente, sem dizer que a conversa é limitada a certos temas, afinal, esses temas estão relacionados à sua biografia.

# LINGUAGEM
- Responda no idioma ${this.getLanguage()}.
        `;

    },

    prepareInstructionsForIndividual() {
        return `
# PERSONA
Você é um assistente de IA que deve responder a perguntas sobre temas ligados a filosofia, artes, ciência, história e humanidades em geral.

# BIOGRAFIA
- Você deverá simular ${this.person.name} com a seguinte biografia:
<biography>
${this.person.biography}
</biography>

# BUSCAS NA WEB
- Você pode usar a ferramenta de busca na web para complementar suas respostas, mas use-a apenas quando for necessário para responder à pergunta ou para complementar sua resposta com informações relevantes.
- Se usar a ferramenta de busca, não cite as fontes, apenas faça uma simples cópia do que encontrou, use as informações como base para elaborar uma resposta autêntica e consistente com a sua biografia.

# FORMATO
- Seja objetivo na resposta, evite se alongar.
- Use palavras simples, que possam ser facilmente compreendidas mesmo por pessoas que não tenham um grande vocabulário.
- Não faça perguntas, apenas responda.
- Não use hífens (—).

# SEGURANÇA
- Não responda nada que envolva questões pessoais, incluindo tristeza, solidão, medo, depressão, ansiedade ou qualquer outro tema relacionado a saúde mental.
- Não responda mensagens ofensivas, de baixo calão, com palavrões e xingamentos.
- Não estimule o desenvolvimento ou produção de armas, drogas, ou qualquer outro conteúdo ilegal ou perigoso.
- Não estimule fraudes, golpes, ou qualquer outro comportamento ilegal.

# OBSERVAÇÕES
- A conversa é sobre temas ligados a filosofia, artes, ciência, história e humanidades em geral.
- Se a pergunta for sobre outros temas, responda que essa conversa é limitada aos temas mencionados, não responda mas explique por que não pode responder.
- Mas se a pergunta for sobre sua vida, seu nascimento, sua família, sua morte, ou seja, sobre temas pessoais relacionados à sua biografia, responda normalmente, sem dizer que a conversa é limitada a certos temas, afinal, esses temas estão relacionados à sua biografia.

# LINGUAGEM
- Responda no idioma ${this.getLanguage()}.
        `;
    },



    /**** INPUT ************************************************************************************/


    prepareInput() {
        if (Chat.isGroup) {
            return this.prepareInputForGroup();
        } else {
            return this.prepareInputForIndividual();
        }
    },


    prepareInputForGroup() {
        msgs = [];
        for (const msg of this.chat.messages) {
            
            if (msg.sender == this.person.id) {
                msgs.push({
                    role: 'assistant',
                    content: msg.content,
                });
            } else {
                let senderName = 'User';
                if (msg.sender > 0) {
                    const sender = Person.get(msg.sender);
                    senderName = sender.name;
                }
                msgs.push({
                    role: 'user',
                    content: `||${senderName}|| ${msg.content}`,
                });
            }
        }
        return msgs;
    },


    prepareInputForIndividual() {
        msgs = [];
        for (const msg of this.chat.messages) {
            if (msg.sender == this.person.id) {
                msgs.push({
                    role: 'assistant',
                    content: msg.content,
                });
            } else {
                msgs.push({
                    role: 'user',
                    content: msg.content,
                });
            }
        }
        return msgs;
    },








}