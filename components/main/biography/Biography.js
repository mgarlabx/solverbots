/* ========================================
   Biography.js - Modal de biografia
   ======================================== */

const Biography = {

	MODAL_ID: 'biographyModal',
	CLOSE_BTN_ID: 'biographyCloseBtn',

	getBiographyKey() {
		const lang = Language?.current;
		return ['pt', 'en', 'es'].includes(lang) ? `biography_${lang}` : 'biography_pt';
	},

	getBiography(person) {
		if (!person) return '';
		const biographyKey = this.getBiographyKey();
		return person[biographyKey] || person.biography_pt || person.biography_en || person.biography_es || '';
	},

	getBiographyTitle(personName) {
		const lang = Language?.current || 'pt';
		const titles = {
			pt: `Sobre ${personName}`,
			en: `About ${personName}`,
			es: `Acerca de ${personName}`,
		};

		return titles[lang] || t('newChat.learnMoreTitle', { name: personName });
	},

	escapeHtml(text) {
		const value = text || '';
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	},

	format(text) {
		const escaped = this.escapeHtml(text);
		const withSentenceBreaks = escaped.replace(/\.\s+/g, '.<br><br>');
		return withSentenceBreaks
			.split(/\n\s*\n/)
			.map(paragraph => paragraph.replace(/\n/g, '<br>').trim())
			.filter(Boolean)
			.map(paragraph => `<p>${paragraph}</p>`)
			.join('');
	},

	openPersonById(personId) {
		const person = Data.getById(personId);
		if (!person) return;

		this.close();

		const biography = this.getBiography(person);
		const biographyText = biography
			? this.format(biography)
			: `<p>${this.escapeHtml(t('newChat.noBiography'))}</p>`;
		const biographyTitle = this.getBiographyTitle(person.name);

		const modalHTML = `
			<div id="${this.MODAL_ID}" class="biography-modal">
				<div class="biography-modal-content">
					<div class="biography-modal-header">
						<h3>${biographyTitle}</h3>
						<button id="${this.CLOSE_BTN_ID}" class="biography-modal-close" type="button">
							${Icons.close}
						</button>
					</div>
					<div class="biography-modal-body">${biographyText}</div>
				</div>
			</div>
		`;

		document.body.insertAdjacentHTML('beforeend', modalHTML);

		const modal = document.getElementById(this.MODAL_ID);
		const closeBtn = document.getElementById(this.CLOSE_BTN_ID);

		requestAnimationFrame(() => modal?.classList.add('show'));

		closeBtn?.addEventListener('click', () => this.close());
		modal?.addEventListener('click', (e) => {
			if (e.target === modal) this.close();
		});
	},

	isOpen() {
		return !!document.getElementById(this.MODAL_ID);
	},

	close() {
		const modal = document.getElementById(this.MODAL_ID);
		if (!modal) return;
		modal.classList.remove('show');
		setTimeout(() => modal.remove(), 200);
	},
};
