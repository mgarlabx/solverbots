class Person {

	constructor(input) {
		this.person = this.resolvePerson(input);
	}

	resolvePerson(input) {
		if (typeof input === 'number') {
			return Data.getById(input);
		}

		if (typeof input === 'string') {
			const matches = Data.getByName(input);
			return Array.isArray(matches) ? (matches[0] || null) : null;
		}

		return null;
	}

	toObject() {
		if (!this.person) {
			return {
				id: null,
				name: '',
				image: '',
				biography: '',
			};
		}

		return {
			id: this.person.id || null,
			name: Data.getLocalizedValue(this.person, 'name'),
			image: this.person.image,
			biography: Data.getLocalizedValue(this.person, 'biography'),
		};
	}

	static get(input) {
		return new Person(input).toObject();
	}

}
