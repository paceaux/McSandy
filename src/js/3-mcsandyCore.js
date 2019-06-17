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
    },
    helpers: {
        /** cleans and sanitizes html
         * @param  {string} html
         * @returns {string} cleaned html
         */
        prepareHTML(html) {
            return html;
        },
        /** Creates a model for all external assets
         * @param  {Set} jsLibs A set or array of external Js Libraries
         * @returns {object} anonymous object with libraries and assets
         */
        createExternalAssetsObj(jsLibs) {
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
        /** Creates a model necessary for constructing a preview
         * @param  {string} html
         * @param  {string} css
         * @param  {string} js
         * @param  {Set} externalJS
         */
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
        /** Creates the view for the head element
         * @returns {string} <head> with css, external libraries
         */
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
        /** Creates the view for the opening of the body
         *  @returns {string} <body> and subsequent HTML
         */
        constructBodyOpen() {
            const { helpers } = this;
            const { html } = this.editorState;
            const userHTML = helpers.prepareHTML(html);
            const bodyOpen = this.SandboxTemplates.BodyOpen(userHTML);

            return bodyOpen;
        },
        /** Creates the view for the closing of the body
         * @returns {string} <script /> and </body>
         */
        constructBodyClose() {
            const { editorState } = this;
            const { js, externalJs } = editorState;
            const bodyClose = this.SandboxTemplates.BodyClose(
                externalJs,
                js,
            );

            return bodyClose;
        },
        /** Generates all of the sandbox views in a blobifiable format
         * @returns {Array} [head, bodyOpen, bodyClose] 
         */
        getContentFromUI() {
            const head = this.helpers.constructHead();
            const bodyOpen = this.helpers.constructBodyOpen();
            const bodyClose = this.helpers.constructBodyClose();
            const contentParts = [head, bodyOpen, bodyClose];

            return contentParts;
        },
        /** Creates a model of the project
         * @param  {string} projectName name of the project
         * @param  {Array} rawParts raw data
         * @param  {Array} blobArray data wrapped in views, that's previewable
         * @param  {object} assets, external assets
         * @returns {object}
         */
        createProjectObj(projectName, rawParts, blobArray, assets) {
            return {
                project: projectName,
                blobArray,
                rawParts,
                externals: assets,
            };
        },
    },
    functions: {
        /** Updates the iframe with a new blob
         * @param  {Array} loadedParts views with editorData
         * @returns {void}
         */
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
        /** Deletes a project from state, storage, and UI
         * Expected to be Event callback
         * @param  {Event} evt
         */
        handleDelContent(evt) {
            evt.preventDefault();
            const projectName = this.data.ctrls.projectName.value;

            store.del(0, `mp-${projectName}`);
            this.editorState.clear();
            this.functions.updateContent();
            this.functions.createProjectSelect();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        /** clears content from state, and UI
         * Expected to be Event callback
         * @param  {Event} evt
         */
        handleClearContent(evt) {
            evt.preventDefault();
            this.editorState.clear();
            this.functions.updateContent();
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        /** Saves state content to storage
         * @param  {Event} evt
         */
        handleSaveContent(evt) {
            evt.preventDefault();
            mcsandyUI.functions.flashClass(evt.currentTarget);
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
            const jsLibs = mcsandyUI.helpers.getExternalJsLibs();
            const externalAssets = this.helpers.createExternalAssetsObj(jsLibs);
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
        /** Generates a blob that can be downloaded
         * @param  {Object} downloadObj
         * @param  {string} type='html' mimetype
         */
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
