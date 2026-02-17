const Icons = {

    // Helper function to generate SVG with common attributes
    get(attrs = {}, content = '') {
        const { width, height, viewBox, fill, stroke = 'currentColor', strokeWidth = '2', ...rest } = attrs;
        let svg = '<svg xmlns="http://www.w3.org/2000/svg"';
        if (width) svg += ` width="${width}"`;
        if (height) svg += ` height="${height}"`;
        if (viewBox) svg += ` viewBox="${viewBox}"`;
        if (fill !== undefined) svg += ` fill="${fill}"`;
        if (stroke) svg += ` stroke="${stroke}"`;
        if (strokeWidth) svg += ` stroke-width="${strokeWidth}"`;
        for (let key in rest) {
            svg += ` ${key}="${rest[key]}"`;
        }
        svg += `>${content}</svg>`;
        return svg;
    },

    get about() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'
        );
    },

    get alertCircle() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        );
    },

    get analysis() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
        );
    },

    get arrow() {
        return this.get(
            { viewBox: '0 0 24 24', fill: 'none' },
            '<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
        );
    },

    get calendar() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path>'
        );
    },

    get checkmark() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' },
            '<polyline points="20 6 9 17 4 12"/>'
        );
    },

    get checkmarkSmall() {
        return this.get(
            { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' },
            '<polyline points="20 6 9 17 4 12"/>'
        );
    },

    get chevronDown() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<polyline points="6 9 12 15 18 9"></polyline>'
        );
    },

    get chevronDownSmall() {
        return this.get(
            { width: '16', height: '16', viewBox: '0 0 16 16', fill: 'currentColor' },
            '<path d="M4 6l4 4 4-4"/>'
        );
    },

    get clock() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'
        );
    },

    get close() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
        );
    },

    get concepts() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="5" r="3"></circle><circle cx="5" cy="19" r="3"></circle><circle cx="19" cy="19" r="3"></circle><line x1="12" y1="8" x2="5" y2="16"></line><line x1="12" y1="8" x2="19" y2="16"></line>'
        );
    },

    get copy() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>'
        );
    },

    get download() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>'
        );
    },

    get edit() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>'
        );
    },

    get eye() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
        );
    },

    get fileText() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'
        );
    },

    get generate() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>'
        );
    },

    get home() {
        return this.get(
            { viewBox: '0 0 64 64', fill: 'none' },
            '<path d="M32 12 L12 32 H20 V52 H28 V40 H36 V52 H44 V32 H52 Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
        );
    },

    get idea() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>'
        );
    },

    get insert() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>'
        );
    },

    get items() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>'
        );
    },

    get messageCircle() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>'
        );
    },

    get messageSquare() {
        return this.get(
            { viewBox: '0 0 24 24', fill: 'none', strokeWidth: '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
        );
    },

    get trash() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>'
        );
    },

    get upload() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>'
        );
    },

    get menu() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>'
        );
    },

    get globe() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
        );
    },

    get database() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>'
        );
    },

    get palette() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="8" r="1.5" fill="currentColor"></circle><circle cx="8" cy="12" r="1.5" fill="currentColor"></circle><circle cx="16" cy="12" r="1.5" fill="currentColor"></circle><circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>'
        );
    },

    get user() {
        return this.get(
            { width: '28', height: '28', viewBox: '0 0 24 24', fill: 'none' },
            '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
        );
    },

    get female() {
        return this.get(
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="8" r="5"></circle><line x1="12" y1="13" x2="12" y2="22"></line><line x1="8" y1="18" x2="16" y2="18"></line>'
        );
    },

    get male() {
        return this.get(
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="10" cy="14" r="5"></circle><line x1="14" y1="10" x2="21" y2="3"></line><polyline points="16 3 21 3 21 8"></polyline>'
        );
    },

    get sun() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
        );
    },

    get moon() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
        );
    },

    get chat() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
        );
    },

    get stories() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>'
        );
    },

    get search() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>'
        );
    },

    get pencil() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>'
        );
    },

    get send() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>'
        );
    },

    get smile() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>'
        );
    },

    get plus() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'
        );
    },

    get mic() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'
        );
    },

    get doubleCheck() {
        return this.get(
            { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: '#53bdeb', strokeWidth: '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<polyline points="1 12 5 16 11 6"></polyline><polyline points="7 12 11 16 20 6"></polyline>'
        );
    },

    get users() {
        return this.get(
            { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
        );
    },

    get pin() {
        return this.get(
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>'
        );
    },

    get mute() {
        return this.get(
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>'
        );
    },

    get arrowLeft() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>'
        );
    },

    get filter() {
        return this.get(
            { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>'
        );
    },

    get eraser() {
        return this.get(
            { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            '<path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8L13.6 2.6c.8-.8 2-.8 2.8 0L21 7.2c.8.8.8 2 0 2.8L12 19"></path>'
        );
    },

};

