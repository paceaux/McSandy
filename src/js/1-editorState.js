// eslint-disable-next-line no-unused-vars
class EditorState {
    constructor(fields = {}) {
        this.fields = fields;
    }

    get html() {
        if (!this.fields.html) throw new Error('html field not defined');

        return this.fields.html.value;
    }

    set html(newValue) {
        if (!this.fields.html) throw new Error('html field not defined');

        const currentVal = this.html;

        if (currentVal !== newValue) this.fields.html.value = newValue;
    }

    get css() {
        if (!this.fields.css) throw new Error('css field not defined');

        return this.fields.css.value;
    }

    set css(newValue) {
        if (!this.fields.css) throw new Error('css field not defined');

        const currentVal = this.css;

        if (currentVal !== newValue) this.fields.css.value = newValue;
    }

    get js() {
        if (!this.fields.js) throw new Error('js field not defined');

        return this.fields.js.value;
    }

    set js(newValue) {
        if (!this.fields.js) throw new Error('js field not defined');

        const currentVal = this.js;

        if (currentVal !== newValue) this.fields.js.value = newValue;
    }

    get projectName() {
        if (!this.fields.projectName) throw new Error('projectName field not defined');

        return this.fields.projectName.value;
    }

    set projectName(newValue) {
        if (!this.fields.projectName) throw new Error('projectName field not defined');

        const currentVal = this.projectName;

        if (currentVal !== newValue) this.fields.projectName.value = newValue;
    }

    get externalJs() {
        if (!this.fields.externalJs) throw new Error('externalJs field not defined');

        const nodeList = this.fields.externalJs;
        const externalJs = [];

        Object.values(nodeList).forEach(node => {
            externalJs.push(node.value);
        });

        return externalJs;
    }

    get externalCss() {
        if (!this.fields.externalCss) throw new Error('externalJs field not defined');

        const nodeList = this.fields.externalCss;
        const externalCss = [];

        Object.values(nodeList).forEach(node => {
            externalCss.push(node.value);
        });

        return externalCss;
    }
}
