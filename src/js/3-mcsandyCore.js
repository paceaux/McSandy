/* MCSANDY: The preview, storage, and retrieval */

// eslint-disable-next-line no-unused-vars
const mcsandy = {
    init(data, Sandbox, SandBoxTemplates, editorState) {
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
        this.editorState = editorState;
        this.bindUiEvents();
    },
    helpers: {
        prepareHTML(html) {
            return html;
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
            const { editorState, data } = this;
            const { css, externalCss, jsLibraries } = editorState;

            const head = this.SandboxTemplates.Head(
                data.sandboxDefaults.reset,
                externalCss,
                css,
                jsLibraries,
            );

            return head;
        },
        constructBodyOpen() {
            const { helpers } = this;
            const { html } = this.editorState;
            const userHTML = helpers.prepareHTML(html);
            const bodyOpen = this.SandboxTemplates.BodyOpen(userHTML);

            return bodyOpen;
        },
        constructBodyClose() {
            const { editorState } = this;
            const { js, externalJs } = editorState;
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

    },
    bindUiEvents() {


    },
    functions: {


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
            this.editorState.clear();
            this.functions.updateContent();
            this.functions.createProjectSelect();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        clearContent(e) {
            e.preventDefault();
            this.editorState.clear();
            this.functions.updateContent();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        saveContent(e) {
            e.preventDefault();
            mcsandyUI.functions.flashClass(e.currentTarget);
            const { editorState } = this;
            const {
                html,
                css,
                js,
                projectName,
                externalJs,
            } = editorState;
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
