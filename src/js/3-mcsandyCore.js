/* MCSANDY: The preview, storage, and retrieval */

// eslint-disable-next-line no-unused-vars
const mcsandy = {
    init(data, Sandbox, SandBoxTemplates, appState) {
        // eslint-disable-next-line no-console
        console.info('McSandy is Running');
        this.data = data;

        Object.keys(this.helpers).forEach(helper => {
            this.helpers[helper] = this.helpers[helper].bind(this);
        });
        Object.keys(this.functions).forEach(funcName => {
            this.functions[funcName] = this.functions[funcName].bind(this);
        });

        this.SandboxTemplates = SandBoxTemplates;
        this.SandBox = Sandbox;
        this.preview = new Sandbox();
        this.appState = appState;
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
            const { appState } = this;
            const { css, externalCss, jsLibraries } = appState;

            const head = this.SandboxTemplates.Head(
                this.blobData.reset,
                externalCss,
                css,
                jsLibraries,
            );

            return head;
        },
        constructBodyOpen() {
            const { helpers } = this;
            const { html } = this.appState;
            const userHTML = helpers.prepareHTML(html);
            const bodyOpen = this.SandboxTemplates.BodyOpen(userHTML);

            return bodyOpen;
        },
        constructBodyClose() {
            const { appState } = this;
            const { js, externalJs } = appState;
            const bodyClose = this.SandboxTemplates.BodyClose(
                externalJs,
                js,
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
            this.appState.clear();
            this.functions.updateContent();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        saveContent(e) {
            e.preventDefault();
            mcsandyUI.functions.flashClass(e.currentTarget);
            const { appState } = this;
            const {
                html,
                css,
                js,
                projectName,
                externalJs,
            } = appState;
            const rawParts = this.helpers.createRawParts(
                html,
                css,
                js,
                externalJs,
            );
            const blobArray = this.helpers.getContentFromUI();
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

            const blob = new this.SandBox(parts, type, downloadObj.project);

            blob.save();
        },
    },
};
