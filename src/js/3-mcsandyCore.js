/* MCSANDY: The preview, storage, and retrieval */

const PreviewTemplates = {
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
    JSExternalAll(libList) {
        // libList is an array
        let externalJSSet = '';
        if (mcsandyAppData.ui.onlineState === 'online') {
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
     * @param {string} cssAssets  assets.css
     * @param {array} inputArrayOfFields  inputArrayOfFields
     * @param {string} cssFromControls  ctrls.css.value
     * @param {array} externalJs  libraries.js
     */
    Head(defaultReset, cssAssets, inputArrayOfFields, cssFromControls, externalJs) {
        const reset = this.CSSInternal(defaultReset);
        const externalSavedCSS = this.CSSExternalAll(cssAssets);
        const externalUnsavedCSS = this.CSSExternalAll(inputArrayOfFields);
        const userCSS = this.CSSInternal(cssFromControls);
        const externalLibraries = this.JSExternalAll(externalJs);

        return `<head>
            ${reset}
            ${externalSavedCSS}
            ${externalUnsavedCSS}
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
     * @param {Array} externalSaved  mcsandyProject.externals.assets.js
     * @param {Array} inputArrayOfFields inputArrayOfFields
     * @param {string} jsFromControls this.data.ctrls.js.value
     */
    BodyClose(externalSaved,inputArrayOfFields, jsFromControls) {
        const externalSavedJS = this.JSExternalAll(externalSaved);
        const externalUnsavedJS = this.JSExternalAll(inputArrayOfFields);
        const userJS = this.JSInternal(jsFromControls);

        return `${externalSavedJS}${externalUnsavedJS}${userJS}</body>`;
    },
};

class Preview {
    constructor(parts = [], type = 'text/html') {
        // eslint-disable-next-line no-underscore-dangle
        this.__parts = parts;
        this.reset = 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}';
        this.type = type;
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

    get blobType() {
        return `${this.type};charset=utf-8`;
    }

    get blob() {
        return new Blob(this.parts, { type: this.blobType });
    }

    get url() {
        return window.URL.createObjectURL(this.blob);
    }

}
// eslint-disable-next-line no-unused-vars
const mcsandy = {
    init(data) {
        // eslint-disable-next-line no-console
        console.info('McSandy is Running');
        this.data = data;
        Object.keys(this.helpers).forEach(helper => {
            this.helpers[helper] = this.helpers[helper].bind(this);
        });
        Object.keys(this.functions).forEach(funcName => {
            this.functions[funcName] = this.functions[funcName].bind(this);
        });

        this.preview = new Preview();
        this.bindUiEvents();
        this.functions.createProjectSelect();
        if (navigator.onLine) {
            this.functions.createLibSelect();
        }
    },
    blobData: {
        reset: 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
        externalJS: [],
    },
    helpers: {
        inputArray(wrapper, inputs) {
            const inputArray = wrapper.querySelectorAll(inputs);
            const valueArray = [];
            [].forEach.call(inputArray, (el) => {
                if (el.value) {
                    valueArray.push(el.value);
                }
            });
            return valueArray;
        },

        prepareHTML(html) {
            return html;
        },
        getExternalAssets(type) {
            return mcsandyUI.helpers.getAssetsByType(type);
        },
        createExternalAssetsObj() {
            const jsLibs = mcsandyUI.helpers.getExternalJsLibs();
            return {
                libraries: {
                    js: jsLibs,
                },
                assets: {
                    css: mcsandyUI.helpers.getAssetsByType('css'),
                    js: mcsandyUI.helpers.getAssetsByType('js'),
                },
            };
        },
        createRawParts(html, css, js, externalJS) {
            const rawParts = {
                html,
                css,
                js,
                external: {
                    js: externalJS,
                },
            };
            return rawParts;
        },
        constructHead() {
            const appData = mcsandyAppData;
            const { ui } = appData;
            const { fields, fieldsets } = ui;
            const { helpers } = this;
            const { ctrls } = this.data;
            const { externals } = mcsandyProject;
            const { libraries, assets } = externals;
            const inputArrayOfFields = helpers.inputArray(fieldsets.css, fields.unsaved);

            const head = PreviewTemplates.Head(
                this.blobData.reset,
                assets.css,
                inputArrayOfFields,
                ctrls.css.value,
                libraries.js,
            );

            return head;
        },
        constructBodyOpen() {
            const { helpers } = this;
            const { ctrls } = this.data;
            const userHTML = helpers.prepareHTML(ctrls.html.value);
            const bodyOpen = PreviewTemplates.BodyOpen(userHTML);

            return bodyOpen;
        },
        constructBodyClose() {
            const appData = mcsandyAppData;
            const { helpers } = this;
            const { ui } = appData;
            const inputArrayOfFields = helpers.inputArray(ui.fieldsets.js, ui.fields.unsaved);
            const bodyClose = PreviewTemplates.BodyClose(
                mcsandyProject.externals.assets.js,
                inputArrayOfFields,
                this.data.ctrls.js.value,
            );

            return bodyClose;
        },
        getContentFromUI() {
            const head = this.helpers.constructHead();
            const bodyOpen = this.helpers.constructBodyOpen();
            const bodyClose = this.helpers.constructBodyClose();
            const contentParts = [head, bodyOpen, bodyClose];

            return contentParts;
        },
        createProjectObj(projectName, rawParts, blobArray, assets) {
            return {
                project: projectName,
                blobArray,
                rawParts,
                externals: assets,
            };
        },
        buildBlob(parts, type = 'text/html') {
            const blobType = `${type};charset=utf-8`;
            const blob = new Blob(parts, { type: blobType });
            return blob;
        },
        getStoredProjects() {
            const len = localStorage.length;
            const projects = [];
            for (let i = 0; i < len; i += 1) {
                if (localStorage.key(i).indexOf('mp-') !== -1) {
                    projects.push(store.get(0, i));
                }
            }
            return projects;
        },
        createSelectOption(el) {
            const option = document.createElement('option');
            option.value = el;
            option.text = el;
            return option;
        },
    },
    bindUiEvents() {
        const { functions } = this;
        const { ctrls } = this.data;

        function throttle(fn, limit) {
            let waiting = false;
            return (...args) => {
                if (!waiting) {
                    fn.apply(this, args);
                    waiting = true;
                    setTimeout(() => {
                        waiting = false;
                    }, limit);
                }
            };
        }
        // BIND EVENTS TO TEXTAREAS
        ctrls.css.addEventListener('keyup', throttle(() => functions.updateContent(), 750));
        ctrls.html.addEventListener('keyup', throttle(() => functions.updateContent(), 750));
        ctrls.js.addEventListener('change', () => {
            functions.updateContent();
        });

        // BIND EVENTS TO BUTTONS
        ctrls.projectSave.addEventListener('click', functions.saveContent);
        ctrls.projectDel.addEventListener('click', functions.delContent);
        ctrls.projectNew.addEventListener('click', functions.clearContent);
    },
    functions: {
        createProjectSelect() {
            const projects = this.helpers.getStoredProjects();
            const select = document.getElementById('js-selectProjects');
            const pageHash = window.location.hash;
            select.innerHTML = '';// clear pre-exiting options
            projects.forEach((el) => {
                const option = this.helpers.createSelectOption(el.project);
                const projectHash = mcsandyUI.helpers.unconvertHash(el.project);
                const pageUnconvertedHash = mcsandyUI.helpers.unconvertHash(pageHash);

                if (projectHash === pageUnconvertedHash) {
                    select.selected = true;
                }
                select.appendChild(option);
            });
            if (window.location.hash) {
                select.value = mcsandyUI.helpers.unconvertHash(window.location.hash);
            }
        },
        createLibSelect() {
            const libs = this.data.externalJS;
            const libWrap = document.querySelector('[data-populate="externalLibs"]');
            Object.keys(libs).forEach(lib => {
                const exJs = libs[lib];
                const input = mcsandyUI.helpers.createInput('checkbox', lib, 'projectManager__jsLib__check input', lib, exJs);
                const label = mcsandyUI.helpers.createLabel(lib, 'projectManager__jsLib__label', lib);
                input.addEventListener('change', this.functions.handleLibToggle);
                libWrap.appendChild(input);
                libWrap.appendChild(label);
            });
            mcsandyUI.functions.bindFieldsetCollapse();
        },
        handleLibToggle(e) {
            const exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                this.blobData.externalJS.splice(this.blobData.externalJS.indexOf(exJs, 1));
                mcsandyProject
                    .externals
                    .libraries
                    .js
                    .splice(mcsandyProject.externals.libraries.js.indexOf(exJs, 1));
            } else {
                this.blobData.externalJS.push(exJs);
                mcsandyProject.externals.libraries.js.push(exJs);
            }
        },
        updateContent(loadedParts) {
            /* load content and bindUIevents call this function */
            /* only mcsandyUI.functions.loadContent sends loadedParts */
            const { iframe } = this.data.targets;
            const parts = loadedParts !== undefined
                ? loadedParts.blobArray
                : this.helpers.getContentFromUI();
            this.preview.parts = parts;

            iframe.src = this.preview.url;
        },
        delContent(e) {
            e.preventDefault();
            const projectName = this.data.ctrls.projectName.value;
            store.del(0, `mp-${projectName}`);
            window.history.pushState({}, 'Create New Project', window.location.pathname);
            this.functions.createProjectSelect();
            this.data.ctrls.projectName.value = '';
        },
        clearContent(e) {
            e.preventDefault();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        saveContent(e) {
            e.preventDefault();
            mcsandyUI.functions.flashClass(e.currentTarget);
            const { ctrls } = this.data;
            const rawParts = this.helpers.createRawParts(
                ctrls.html.value,
                ctrls.css.value,
                ctrls.js.value,
                this.blobData.externalJS,
            );
            const blobArray = this.helpers.getContentFromUI();
            const projectName = this.data.ctrls.projectName.value;
            const externalAssets = this.helpers.createExternalAssetsObj();
            const project = this.helpers.createProjectObj(
                projectName,
                rawParts,
                blobArray,
                externalAssets,
            );
            store.set(0, `mp-${projectName}`, project);
            mcsandyUI.functions.setHash(projectName);
            this.functions.createProjectSelect();
        },
        downloadContent(downloadObj, type = 'html') {
            // downloadObj should be an object.
            // It should have in it an array called blobArray.
            // there must be a min of 1 item in the array,
            // array  contains the stuff we want to download
            // type is presumed to be either html, css, or js
            const parts = downloadObj !== undefined
                ? downloadObj.blobArray
                : this.helpers.getContentFromUI();
            const mimeType = type !== 'javascript'
                ? `text/${type}`
                : 'application/javascript';
            const blob = this.helpers.buildBlob(parts, mimeType);
            const fileName = `${downloadObj.project}.${type}`;
            saveAs(blob, fileName);
        },
    },
};
