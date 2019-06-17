/* MCSANDYUI: the main user interactions with the app */

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
// eslint-disable-next-line no-unused-vars
const mcsandyUI = {
    init(data,UiTemplates, appState) {
        // eslint-disable-next-line no-console
        console.info('McSandyUI is Running');
        this.data = data;
        this.appState = appState;
        this.UiTemplates = UiTemplates;
        Object.keys(this.helpers).forEach(helper => {
            this.helpers[helper] = this.helpers[helper].bind(this);
        });
        Object.keys(this.functions).forEach(funcName => {
            this.functions[funcName] = this.functions[funcName].bind(this);
        });
        this.bindUiEvents();
        this.bindBroadcastEvents();
        this.functions.handleSearch();
        this.functions.createProjectSelect();
        if (navigator.onLine) {
            this.functions.createLibSelect();
        }
    },
    helpers: {
        keyDown(e) {
            /* SAVE */
            const {
                userPrefs,
            } = mcsandyAppData;
            if (e.ctrlKey) {
                switch (e.keyCode) {
                // s
                case 83:
                    mcsandy.functions.handleSaveContent(e);
                    this.functions.flashClass(mcsandy.data.ctrls.projectSave);
                    break;
                    // r
                case 82:
                    mcsandy.functions.updateContent();
                    break;
                    // l
                case 76:
                    this.functions.handleProjectLoad(e);
                    this.functions.flashClass(mcsandy.data.ctrls.projectLoad);
                    break;
                    // f
                case 70:
                    this.functions.handleDownloadProject(e);
                    this.functions.flashClass(mcsandy.data.ctrls.projectDownload);
                    break;
                default:
                    break;
                }
                if (e.shiftKey) {
                    switch (e.keyCode) {
                    // e
                    case 69:
                        document.querySelector('[for="js-editor-toggle"]').click();
                        break;
                        // p
                    case 80:
                        document.querySelector('[for="js-footer-editor-toggle"]').click();
                        break;
                        // =
                    case 187:
                        mcsandy.functions.handleClearContent(e);
                        break;
                        // +
                    case 107:
                        mcsandy.functions.handleClearContent(e);
                        break;
                        // backspace
                    case 8:
                        mcsandy.functions.handleDelContent(e);
                        break;
                        // h
                    case 72:
                        this.helpers.toggleClass(document.querySelector('body'), 'mcsandy--horizontal');
                        mcsandyAppData.userPrefs.ui.hLayout = userPrefs.ui.hLayout !== true;
                        mcsandyPrefs.functions.savePreferences();
                        break;
                    case 73:
                        this.functions.toggleModal();
                        break;
                    case 84:
                        this.helpers.runTest(e);
                        break;
                    default:
                        break;
                    }
                }
            }
        },
        keyUp() {},
        convertHash(hash) {
            return hash.replace(' ', '_');
        },
        unconvertHash(hash) {
            const unconvertedHash = hash
                .replace('#', '')
                .replace('_', ' ');
            return unconvertedHash;
        },

        createExternalInput(type, classes, placeholder) {
            const input = document.createElement('input');
            input.type = type;
            input.class = classes;
            input.placeholder = placeholder;
            return input;
        },
        removeParent(el) {
            const parent = el.parentNode;
            parent.remove();
        },
        cloneParent(el) {
            const clone = el.parentNode.cloneNode(true);
            clone.querySelector('input').value = '';
            return clone;
        },
        toggleEditorField(e) {
            const label = e.target;
            const parent = label.parentElement;
            if (!label.className.match('js-shrunk')) {
                label.className = `${label.className} js-shrunk`;
                parent.className = `${parent.className} js-shrunk`;
            } else {
                label.className = label.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, '');
                parent.className = parent.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, '');
            }
        },
        toggleClass(el, className) {
            if (el.className.match(className)) {
                // eslint-disable-next-line no-param-reassign
                el.className = el.className.replace(className, '');
            } else {
                // eslint-disable-next-line no-param-reassign
                el.className = `${el.className} ${className}`;
            }
        },
        addEvents(els, evt, func) {
            [].forEach.call(els, (el) => {
                el.addEventListener(evt, func, false);
            });
        },
        getExternalJsLibs() {
            const libEls = document.querySelectorAll(mcsandy.data.ctrls.jsLibs);
            const jsLibs = [];
            [].forEach.call(libEls, (lib) => {
                if (lib.checked) {
                    jsLibs.push(mcsandy.data.externalJS[lib.value]);
                }
            });
            return jsLibs;
        },
        getAssetsByType(type) {
            const fieldset = document.querySelector(`.editor__${type}`);
            const inputs = fieldset.querySelectorAll(this.data.fields.assets);
            const assets = [];
            [].forEach.call(inputs, (input) => {
                if (input.value.length > 0) {
                    assets.push(input.value);
                }
            });
            return assets;
        },


        runTest() {},
        getUrlParams() {
            const urlParams = {};
            let match;
            const pl = /\+/g; // Regex for replacing addition symbol with a space
            const search = /([^&=]+)=?([^&]*)/g;
            const decode = (s) => decodeURIComponent(s.replace(pl, ' '));
            const query = window.location.search.substring(1);

            // TODO: FIND OUT WHERE THIS CAME FROM. FIND A BETTER WAY TO GET URL PARAMS
            // eslint-disable-next-line no-cond-assign
            while (match = search.exec(query)) {
                urlParams[decode(match[1])] = decode(match[2]);
            }
            return urlParams;
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
    },
    bindUiEvents() {
        const {
            helpers,
            data,
        } = this;
        const {
            ctrls,
            fields,
        } = data;
        const editors = document.querySelectorAll('.field--textarea');
        const editorFieldsets = data.fields.fieldsets;
        const fileUploads = data.fields.upload;
        const addExternalFile = document.querySelectorAll(data.fields.add);
        const removeExternalFile = document.querySelectorAll(data.fields.rem);

        /* CHECK FOR INTERNET CONNECTION */
        window.addEventListener('load', () => {
            this.functions.handleConnection();
            if (window.location.hash) {
                this.functions.handleHash();
            }
        });
        window.addEventListener('offline', this.functions.handleConnection);
        window.addEventListener('online', this.functions.handleConnection);

        /* WINDOW HASH CHANGE */
        window.addEventListener('hashchange', this.functions.handleHash);


        /* SELECT A PROJECT */
        ctrls.projectLoad.addEventListener('click', this.functions.handleProjectLoad);

        /* DOWNLOAD A PROJECT */
        ctrls.projectDownload.addEventListener('click', this.functions.handleDownloadProject);

        /* Info button */
        ctrls.appInfo.addEventListener('click', this.functions.toggleModal);

        /* THE EDITOR FIELDS */
        window.addEventListener('keydown', helpers.keyDown);

        [].forEach.call(editors, (editor) => {
            editor.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.keyCode === 192) {
                    this.helpers.toggleClass(e.target, 'js-shrink');
                }
            });
            editor.addEventListener('dragover', this.functions.handleDragOver);
            editor.addEventListener('drop', this.functions.handleFileUpload);
        });

        // SAVE, DELETE, CLEAR
        ctrls.projectSave.addEventListener('click', (evt) => mcsandy.functions.handleSaveContent.call(mcsandy, evt));
        ctrls.projectDel.addEventListener('click', (evt) => mcsandy.functions.handleDelContent.call(mcsandy, evt));
        ctrls.projectNew.addEventListener('click', (evt) => mcsandy.functions.handleClearContent.call(mcsandy, evt));

        // BIND EVENTS TO TEXTAREAS
        fields.css.addEventListener('keyup', throttle(() => mcsandy.functions.updateContent(), 750));
        fields.html.addEventListener('keyup', throttle(() => mcsandy.functions.updateContent(), 750));
        fields.js.addEventListener('change', () => {
            mcsandy.functions.updateContent();
        });
        window.addEventListener('keydown', this.functions.ctrlShiftKeydown);
        /* GLOBAL BUTTON STUFF */
        helpers.addEvents(document.querySelectorAll('button'), 'click', this.functions.flashClass);

        /* DRAG AND DROP FILES INTO EDITORS */
        helpers.addEvents(fileUploads, 'change', this.helpers.handleFileUpload);

        helpers.addEvents(editorFieldsets, 'dragstart', this.functions.handleDragStart);
        helpers.addEvents(editorFieldsets, 'dragend', this.functions.handleDragEnd);
        helpers.addEvents(editorFieldsets, 'drop', this.functions.handleFileDrop);
        /* ADD EXTERNAL LINK */
        helpers.addEvents(addExternalFile, 'click', this.functions.handleAddExternalFile);
        helpers.addEvents(removeExternalFile, 'click', this.functions.handleRemoveExternalFile);
        /* LABEL/INPUT SHENANIGANS */
        this.functions.bindFieldsetCollapse();
        helpers.addEvents(document.querySelectorAll('.editor__label, .js-panelToggleLabel'), 'click', this.functions.handleCollapsePanel);
        this.data.modal.overlay.addEventListener('click', this.functions.toggleModal);
    },
    bindBroadcastEvents() {
        const {
            data,
        } = this;

        if ('BroadcastChannel' in window) {
            const fieldChannel = new BroadcastChannel('field_broadcasts');

            [...data.ctrls.broadcasters].forEach((broadcaster) => {
                broadcaster.addEventListener(broadcaster.dataset.broadcast, (evt) => {
                    fieldChannel.postMessage({
                        id: evt.target.id,
                        value: evt.target.value,
                        eventType: evt.type,
                        projectName: mcsandyProject.project,
                    });
                });
            });

            fieldChannel.onmessage = (evt) => {
                const evtData = evt.data;
                const targetEl = document.getElementById(evtData.id);

                if (data.projectName === mcsandyProject.project) {
                    targetEl.value = evtData.value;
                    mcsandy.functions.updateContent();
                }
            };
        }
    },
    functions: {
        handleConnection(override) {
            const ctrl = document.getElementById('js-onlineStatus');
            mcsandyAppData.ui.onlineState = navigator.onLine ? 'online' : 'offline';
            if (override !== undefined && typeof override === 'string') {
                mcsandyAppData.ui.onlineState = override; // for debugging when I'm on an airplane.
            }
            if (mcsandyAppData.ui.onlineState === 'online') {
                ctrl.className = ctrl.className.replace(/(?:^|\s)offline(?!\S)/g, ' online');
                document.title = 'McSandy | Online';
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--offline(?!\S)/g, ' mcsandy--online');
                this.functions.createLibSelect();
            } else {
                ctrl.className = ctrl.className.replace(/(?:^|\s)online(?!\S)/g, ' offline');
                document.title = 'McSandy | Offline';
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--online(?!\S)/g, ' mcsandy--offline');
            }
        },
        handleCollapsePanel(e) {
            const {
                target,
            } = e;
            const parent = target.parentElement;
            this.helpers.toggleClass(parent, 'js-collapsed');
        },
        handleHash() {
            if (window.location.hash.length > 0) {
                const hash = this.helpers.unconvertHash(window.location.hash);
                this.functions.loadProject(hash);
            }
        },
        setHash(hash) {
            window.location.hash = this.helpers.convertHash(hash);
        },
        handleSearch() {
            const urlParams = this.helpers.getUrlParams();

            if ('fullwindow' in urlParams) {
                this.functions.setFullWindow(urlParams.fullwindow);
            }
        },
        setFullWindow(element) {
            if (typeof element === 'string') {
                document.getElementById(element).classList.add('fullwindow');
            } else {
                element.classList.add('fullwindow');
            }
        },
        unsetFullWindow(element) {
            if (typeof element === 'string') {
                document.getElementById(element).classList.remove('fullwindow');
            } else {
                element.classList.remove('fullwindow');
            }
        },
        openIdInFullWindow(id) {
            window.open(`${window.location.origin + window.location.pathname}?fullwindow=${id}${window.location.hash}`, '_blank', 'location=yes');
        },
        ctrlShiftKeydown(evt) {
            const modifierKey = evt.keyCode;
            const {
                ctrlshiftkey,
            } = evt.target.dataset;
            const isCtrlShift = !!evt.target.dataset.ctrlshiftkey;
            const isParentCtrlShift = !!evt.target.parentElement.dataset.ctrlshiftkey;
            const ctrlShiftModifier = isCtrlShift ? ctrlshiftkey : ctrlshiftkey;
            const id = isCtrlShift ? evt.target.id : evt.target.parentElement.id;

            if (evt.ctrlKey
                && evt.shiftKey
                && (isCtrlShift || isParentCtrlShift)
                && modifierKey === ctrlShiftModifier.toUpperCase().charCodeAt()) {
                this.functions.openIdInFullWindow(id);
            }
        },
        handleProjectLoad(e) {
            e.preventDefault();
            const project = this.data.ctrls.projectSelect.value;
            if (project) {
                this.functions.setHash(project);
                this.functions.loadProject(project);
                this.functions.flashClass(e.currentTarget);
            } else {
                // TODO: throw a modal instead
                // eslint-disable-next-line no-alert
                alert('You have no projects to load');
            }
        },
        flashClass(el) {
            // eslint-disable-next-line no-param-reassign
            el.className += ' anim-flash';
            setTimeout(() => {
                // eslint-disable-next-line no-param-reassign
                el.className = el.className.replace('anim-flash', '');
            }, 3000);
        },
        loadProject(project) {
            const projData = store.get(0, `mp-${project}`);
            window.mcsandyProject = projData;
            // eslint-disable-next-line no-console
            console.info('McSandy Loaded a Project', projData);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            this.functions.updateEditors(
                projData.rawParts.html,
                projData.rawParts.css,
                projData.rawParts.js,
            );
            this.functions.updateCtrls(projData);
        },
        handleRemoveExternalFile(e) {
            e.preventDefault();
            const {
                helpers,
            } = this;
            helpers.removeParent(e.target);
            mcsandy.functions.updateContent();
        },
        handleFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            const {
                files,
            } = e.dataTransfer;
            let i = 0;
            for (let f; f === files[i]; i += 1) {
                const input = this.UiTemplates.ExternalFileSetTemplate(f);
                e.target.appendChild(input);
            }
        },
        addError(el, msgType) {
            const errorMsgs = mcsandyAppData.ui.fieldErrorMessages;
            const msg = errorMsgs[msgType];
            const errTimeout = () => {
                // eslint-disable-next-line no-param-reassign
                el.placeholder = el.dataset.originalPlaceholder;
            };
            // eslint-disable-next-line no-param-reassign
            el.dataset.originalPlaceholder = el.placeholder;
            // eslint-disable-next-line no-param-reassign
            el.placeholder = msg;
            window.setTimeout(errTimeout, 5000);
        },
        handleAddExternalFile(e) {
            e.preventDefault();
            const {
                helpers,
            } = this;
            const {
                functions,
            } = this;
            const fieldPatterns = mcsandyAppData.ui.fieldRegexPatterns;
            const el = e.target;
            let clonedParent;
            const exFileField = e.target.parentNode.querySelector('.fieldset__field');
            if (exFileField.value) {
                if (exFileField.value.match(fieldPatterns.url) !== null) {
                    clonedParent = helpers.cloneParent(el);
                    e.target.removeEventListener('click', this.functions.handleAddExternalFile);
                    el.className = el.className.replace('fieldset__button--add', 'fieldset__button--rem');
                    el.innerHTML = '&mdash;';
                    el.parentNode.parentNode.appendChild(clonedParent);
                    mcsandy.functions.updateContent();
                    this.bindUiEvents();
                    clonedParent.dataset.saved = false;
                } else {
                    functions.addError(exFileField, 'notURL');
                }
            } else {
                functions.addError(exFileField, 'empty');
            }
        },
        handleDownloadProject(e) {
            e.preventDefault();
            const project = store.get(0, `mp-${this.data.ctrls.projectSelect.value}`); // don't get the value of the button, but the one from the select box.
            this.functions.flashClass(document.getElementById('js-projectDownload'));
            mcsandy.functions.downloadContent(project);
        },
        handleFileUpload(e) {
            e.stopPropagation();
            e.preventDefault();
            const {
                files,
            } = e.dataTransfer;
            const toElement = e.toElement || e.target;
            const editField = toElement.dataset.fileext;

            Object.values(files).forEach(file => {
                let newImage;
                const isImage = file.type.match('image.*');
                const isSVG = file.type.match('svg');
                const reader = new FileReader();

                if (isImage && !isSVG) {
                    reader.onload = (evt) => {
                        if (editField === 'html') {
                            newImage = `<img src="${evt.target.result}"/>`;
                        }

                        if (editField === 'css') {
                            newImage = `url('${evt.target.result}')`;
                        }

                        toElement.value = `${toElement.value} ${newImage}`;
                    };
                    reader.readAsDataURL(file);
                } else {
                    reader.onload = (evt) => {
                        toElement.value += evt.target.result;
                    };
                    reader.readAsText(file);
                }
            });
        },
        handleDragOver(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },
        handleDragStart(e) {
            e.dataTransfer.dropEffect = 'all';
            e.dataTransfer.effectAllowed = 'all';
            const source = e.target.parentNode.querySelector('textarea').value;
            const projectName = mcsandy.data.ctrls.projectName.value.length > 0 ? mcsandy.data.ctrls.projectName.value : 'McSandy';
            const type = e.target.dataset.fileext;
            const blob = new Blob([source], {
                type,
            });
            const sourceURL = URL.createObjectURL(blob);
            const fileDetails = `${e.target.dataset.mimeoutput}:${projectName}.${type}:${sourceURL}`;
            e.dataTransfer.setData('DownloadURL', fileDetails);
        },
        handleDragEnd(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'all';
            e.dataTransfer.getData('DownloadURL', 0);
        },
        updateEditors(html, css, js) {
            const {
                ctrls,
            } = mcsandy.data;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        updateCtrls(projData) {
            const projectField = mcsandy.data.ctrls.projectName;
            const {
                ctrls,
            } = this.data;
            projectField.value = projData.project;
            projectField.placeholder = projData.project;
            ctrls.projectDownload.value = projData.project;

            if (projData.externals.libraries) {
                projData.externals.libraries.js.forEach((el) => {
                    const exJsInput = document.querySelector('.fieldset--externalLibs').querySelector(`[data-mcsandy="${el}"]`);
                    exJsInput.checked = true;
                });
            }
            if (projData.externals) {
                this.functions.updateExternalAssetFields(projData, 'css');
                this.functions.updateExternalAssetFields(projData, 'js');
                this.bindUiEvents();
            }
        },
        updateExternalAssetFields(projData, type) {
            const assetFields = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper');
            const xAssets = projData.externals.assets[type];
            let lastField;
            const neededFields = xAssets.length - assetFields.length;
            for (let i = 0; i < neededFields + 1; i += 1) {
                lastField = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper').item(i);
                const clone = lastField.cloneNode(true);
                lastField.parentNode.appendChild(clone);
            }
            Array.prototype.slice.call(document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper')).forEach((el, i) => {
                const field = el.querySelector('.fieldset__field');
                field.value = xAssets[i] !== undefined ? xAssets[i] : '';
            });
            if (neededFields < -1) {
                const availFields = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper').length;
                for (let i = availFields - 1; i >= xAssets.length + 1; i -= 1) {
                    lastField = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper').item(i);
                    lastField.parentNode.removeChild(lastField);
                }
            }
        },
        bindFieldsetCollapse() {
            const labels = document.querySelectorAll('.fieldset__label');
            for (let i = 0; i < labels.length; i += 1) {
                const l = labels[i];
                l.addEventListener('click', this.helpers.toggleEditorField);
            }
        },
        addModalContent(title, content) {
            const {
                modal,
            } = this.data;

            modal.title.innerText = title;
            modal.content.innerHTML = content;
        },
        toggleModal(content) {
            const {
                modal,
            } = this.data;

            this.helpers.toggleClass(modal.container, 'visible');
            this.helpers.toggleClass(modal.overlay, 'visible');
            if (typeof content === 'string') {
                modal.content.innerHTML = content;
            }
        },
        createProjectSelect() {
            const projects = this.helpers.getStoredProjects();
            const select = document.getElementById('js-selectProjects');
            const pageHash = window.location.hash;
            select.innerHTML = '';// clear pre-exiting options
            projects.forEach((el) => {
                const option = this.UiTemplates.SelectOptionTemplate(el.project);
                const projectHash = this.helpers.unconvertHash(el.project);
                const pageUnconvertedHash = this.helpers.unconvertHash(pageHash);

                if (projectHash === pageUnconvertedHash) {
                    select.selected = true;
                }
                select.appendChild(option);
            });
            if (window.location.hash) {
                select.value = this.helpers.unconvertHash(window.location.hash);
            }
        },
        createLibSelect() {
            const libs = this.data.externalJS;
            const libWrap = document.querySelector('[data-populate="externalLibs"]');
            Object.keys(libs).forEach(lib => {
                const exJs = libs[lib];
                const input = this.UiTemplates.InputTemplate('checkbox', lib, 'projectManager__jsLib__check input', lib, exJs);
                const label = this.UiTemplates.LabelTemplate(lib, 'projectManager__jsLib__label', lib);
                input.addEventListener('change', this.functions.handleLibToggle);
                libWrap.appendChild(input);
                libWrap.appendChild(label);
            });
            this.functions.bindFieldsetCollapse();
        },
        handleLibToggle(e) {
            const exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                this.appState.delJsLibrary(exJs);
            } else {
                this.appState.addJsLibrary(exJs);
            }
            mcsandy.functions.updateContent();
        },
    },
};
