// eslint-disable-next-line no-unused-vars
const SandboxTemplates = {
    /**
     * CSSInternal generates <style>
     * @param {string} css raw CSS
     */
    CSSInternal(css) {
        return `<style type="text/css">${css}</style>`;
    },

    /**
     * JSExternal generates <script src="">
     * @param {string} javascript url for resource
     */
    JSExternal(javascript) {
        if (!javascript) return '';
        // make sure that the JS has a protocol that'll work
        let js = (javascript.slice(javascript.indexOf('//') + 2));
        // if McSandy isn't running as http(s), then it's probably file:// - which shouldn't use a relative protocol
        if (!window.location.protocol.match('http')) {
            js = `http://${js}`;
        } else {
            js = `${window.location.protocol}//${js}`;
        }
        // eslint-disable-next-line no-useless-escape
        return `<script type="text\/javascript" src="${js}"><\/script>`;
    },
    /**
     * CSSExternal generates a <link>
     * @param {string} css url to external stylesheet
     */
    CSSExternal(css) {
        return `<link rel="stylesheet" href="${css}"/>`;
    },

    /**
     * JSExternalAll generates all <script src>
     * @param {Array} libList list of libraries
     */
    JSExternalAll(libList = []) {
        // libList is an array
        let externalJSSet = '';
        if (mcsandyAppData.ui.onlineState === 'online' && libList.length > 0) {
            /* only add external libraries if we're online */
            libList.forEach((el) => {
                externalJSSet += this.JSExternal(el);
            });
        }
        return externalJSSet;
    },

    /**
     * CSSExternalAll generates all <link rel""">
     * @param {Array} cssList list of all external CSS resources
     */
    CSSExternalAll(cssList) {
        // cssList is an array
        let externalCSSSet = '';
        if (mcsandyAppData.ui.onlineState === 'online') {
            /* only add external libraries if we're online */
            cssList.forEach((el) => {
                externalCSSSet += this.CSSExternal(el);
            });
        }
        return externalCSSSet;
    },

    /**
     * JSInternal generates a <script> with js inside of block
     * @param {string} js raw javascript
     */
    JSInternal(js) {
        // eslint-disable-next-line no-useless-escape
        return `<script type="text\/javascript">${js}<\/script>`;
    },

    /**
     * Head constructs the head for html document
     * @param {string} defaultReset this.blobData.reset
     * @param {array} inputArrayOfFields  inputArrayOfFields
     * @param {string} cssFromControls  ctrls.css.value
     * @param {array} externalJs  libraries.js
     */
    Head(defaultReset, inputArrayOfFields, cssFromControls, externalJs) {
        const reset = this.CSSInternal(defaultReset);
        const externalCss = this.CSSExternalAll(inputArrayOfFields);
        const userCSS = this.CSSInternal(cssFromControls);
        const externalLibraries = this.JSExternalAll(externalJs);

        return `<head>
            ${reset}
            ${externalCss}
            ${userCSS}
            ${externalLibraries}
        </head>`;
    },
    /**
     * BodyOpen constructs the <body> with all user HTML
     * @param {string} userHTML markup user wrote
     */
    BodyOpen(userHTML) {
        return `<body>${userHTML}`;
    },

    /**
     * BodyClose creates the JS assests at the end before closing with </body>
     * @param {Array} externalJs externalJs
     * @param {string} jsFromControls this.data.ctrls.js.value
     */
    BodyClose(externalJs = [], jsFromControls) {
        const externalJSSet = this.JSExternalAll(externalJs);
        const userJS = this.JSInternal(jsFromControls);

        return `${externalJSSet}${userJS}</body>`;
    },
};

// eslint-disable-next-line no-unused-vars
class SandBox {
    constructor(parts = [], type = 'html', projectName = 'mcsandy') {
        // eslint-disable-next-line no-underscore-dangle
        this.__parts = parts;
        this.reset = 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}';
        this.type = type;
        this.projectName = projectName;
    }

    get parts() {
        // eslint-disable-next-line no-underscore-dangle
        return this.__parts;
    }

    set parts(newParts) {
        if (!newParts) return;
        let hasNewParts = false;

        for (let idx = 0; idx < newParts.length; idx += 1) {
            if (this.parts[idx] !== newParts[idx]) {
                hasNewParts = true;
                break;
            }
        }

        if (hasNewParts) {
            // eslint-disable-next-line no-underscore-dangle
            this.__parts = newParts;
        }
    }

    get mimeType() {
        const jsMimeType = 'application/javascript';
        const textMimeType = `text/${this.type}`;
        const isJS = this.type === 'javascript' || this.type === 'js';

        return isJS ? jsMimeType : textMimeType;
    }

    get blobType() {
        return `${this.mimeType};charset=utf-8`;
    }

    get blob() {
        return new Blob(this.parts, { type: this.blobType });
    }

    get url() {
        return window.URL.createObjectURL(this.blob);
    }

    get fileName() {
        return `${this.projectName}.${this.type}`;
    }

    save() {
        saveAs(this.blob, this.fileName);
    }
}
