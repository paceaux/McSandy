
/* MCSANDYUI: the main user interactions with the app */
mcsandyUI = {
    init() {
        const _this = mcsandyUI;
        console.info('McSandyUI is Running');
        _this.bindUiEvents();
        _this.bindBroadcastEvents();
        _this.functions.handleSearch();
    },
    data: mcsandyAppData.ui,
    helpers: {
        keyDown(e) {
            const _this = mcsandyUI;
            /* SAVE */
            if (e.ctrlKey) {
                switch (e.keyCode) {
                // s
                case 83:
                    mcsandy.functions.saveContent(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectSave);
                    break;
                // r
                case 82:
                    mcsandy.functions.updateContent();
                    break;
                // l
                case 76:
                    _this.functions.handleProjectLoad(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectLoad);
                    break;
                // f
                case 70:
                    _this.functions.handleDownloadProject(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectDownload);
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
                        mcsandy.functions.clearContent(e);
                        break;
                    // +
                    case 107:
                        mcsandy.functions.clearContent(e);
                        break;
                    // backspace
                    case 8:
                        mcsandy.functions.delContent(e);
                        break;
                    // h
                    case 72:
                        _this.helpers.toggleClass(document.querySelector('body'), 'mcsandy--horizontal');
                        mcsandyAppData.userPrefs.ui.hLayout = mcsandyAppData.userPrefs.ui.hLayout !== true;
                        mcsandyPrefs.functions.savePreferences();
                        break;
                    case 73:
                        _this.functions.toggleModal();
                        break;
                    case 84:
                        _this.helpers.runTest(e);
                        break;
                    default:
                        break;
                    }
                }
            }
        },
        keyUp() {
            const _this = mcsandyUI;
        },
        convertHash(hash) {
            return hash.replace(' ', '_');
        },
        unconvertHash(hash) {
            hash = hash.replace('#', '');
            hash = hash.replace('_', ' ');
            return hash;
        },
        createInput(t, id, c, v, d) {
            const input = document.createElement('input');
            input.type = t;
            input.id = id;
            input.className = c;
            input.value = v;
            input.setAttribute('data-mcsandy', d);
            return input;
        },
        createLabel(id, c, t) {
            const label = document.createElement('label');
            label.className = c;
            label.setAttribute('for', id);
            label.innerHTML = t;
            return label;
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
            const grandparent = el.parentNode.parentNode;
            clone.querySelector('input').value = '';
            return clone;
        },
        toggleEditorField(e) {
            const label = e.target;
            const parent = label.parentElement;
            if (!label.className.match('js-shrunk')) {
                label.className = `${label.className} ` + 'js-shrunk';
                parent.className = `${parent.className} ` + 'js-shrunk';
            } else {
                label.className = label.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, '');
                parent.className = parent.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, '');
            }
        },
        toggleClass(el, className) {
            if (el.className.match(className)) {
                el.className = el.className.replace(className, '');
            } else {
                el.className = `${el.className} ${className}`;
            }
        },
        addEvents(els, evt, func) {
            [].forEach.call(els, (el) => {
                el.addEventListener(evt, func, false);
            });
        },
        getExternalJsLibs() {
            const _this = mcsandy;
            const libEls = document.querySelectorAll(_this.data.ctrls.jsLibs);
            const jsLibs = [];
            [].forEach.call(libEls, (lib) => {
                if (lib.checked) {
                    jsLibs.push(_this.data.externalJS[lib.value]);
                }
            });
            return jsLibs;
        },
        getAssetsByType(type) {
            const _this = mcsandyUI;
            const fieldset = document.querySelector(`.editor__${type}`);
            const inputs = fieldset.querySelectorAll(_this.data.fields.assets);
            const assets = [];
            [].forEach.call(inputs, (input) => {
                if (input.value.length > 0) {
                    assets.push(input.value);
                }
            });
            return assets;
        },
        createExternalFileWrapper() {
            const wrapper = document.createElement('div');
            wrapper.className = 'fieldset__inputWrapper';
            return wrapper;
        },
        createExternalFileButton(buttonClass) {
            const button = document.createElement('button');
            button.className = `fieldset__button ${buttonClass}`;
            button.innerHTML = '&mdash;';
            return button;
        },
        createExternalFileSet(file, inputType, inputClass, buttonClass, buttonText) {
            const _this = mcsandyUI;
            const wrapper = _this.helpers.createExternalFileWrapper();
            const input = _this.helpers.createInput(inputType, `js-${Math.ceil(Math.random() * 10)}`, inputClass, file, file);
            const button = _this.helpers.createExternalFileButton(buttonClass, buttonText);
            wrapper.appendChild(input);
            wrapper.appendChild(button);
            return wrapper;
        },
        runTest() {
            const exCss = mcsandyProject.externals.assets.css;
            const dataUI = mcsandyAppData.ui;
        },
        getUrlParams() {
            const urlParams = {};
            let match;
            const pl = /\+/g; // Regex for replacing addition symbol with a space
            const search = /([^&=]+)=?([^&]*)/g;
            const decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
            const query = window.location.search.substring(1);

            while (match = search.exec(query)) {
                urlParams[decode(match[1])] = decode(match[2]);
            }
            return urlParams;
        },
    },
    bindUiEvents() {
        const _this = mcsandyUI;
        const { helpers } = _this;
        const { data } = _this;
        const { ctrls } = data;
        const editors = document.querySelectorAll('.field--textarea');
        const editorFieldsets = data.fields.fieldsets;
        const fileUploads = data.fields.upload;
        const addExternalFile = document.querySelectorAll(data.fields.add);
        const removeExternalFile = document.querySelectorAll(data.fields.rem);

        /* CHECK FOR INTERNET CONNECTION */
        window.addEventListener('load', () => {
            _this.functions.handleConnection();
            if (window.location.hash) {
                _this.functions.handleHash();
            }
        });
        window.addEventListener('offline', _this.functions.handleConnection);
        window.addEventListener('online', _this.functions.handleConnection);

        /* WINDOW HASH CHANGE */
        window.addEventListener('hashchange', _this.functions.handleHash);


        /* SELECT A PROJECT */
        ctrls.projectLoad.addEventListener('click', _this.functions.handleProjectLoad);

        /* DOWNLOAD A PROJECT */
        ctrls.projectDownload.addEventListener('click', _this.functions.handleDownloadProject);

        /* Info button */
        ctrls.appInfo.addEventListener('click', _this.functions.toggleModal);

        /* THE EDITOR FIELDS */
        window.addEventListener('keydown', helpers.keyDown);

        [].forEach.call(editors, (editor) => {
            editor.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.keyCode === 192) {
                    _this.helpers.toggleClass(e.target, 'js-shrink');
                }
            });
            editor.addEventListener('dragover', _this.functions.handleDragOver);
            editor.addEventListener('drop', _this.functions.handleFileUpload);
        });

        window.addEventListener('keydown', _this.functions.ctrlShiftKeydown);
        /* GLOBAL BUTTON STUFF */
        helpers.addEvents(document.querySelectorAll('button'), 'click', _this.functions.flashClass);

        /* DRAG AND DROP FILES INTO EDITORS */
        helpers.addEvents(fileUploads, 'change', _this.helpers.handleFileUpload);

        helpers.addEvents(editorFieldsets, 'dragstart', _this.functions.handleDragStart);
        helpers.addEvents(editorFieldsets, 'dragend', _this.functions.handleDragEnd);
        helpers.addEvents(editorFieldsets, 'drop', _this.functions.handleFileDrop);
        /* ADD EXTERNAL LINK */
        helpers.addEvents(addExternalFile, 'click', _this.functions.handleAddExternalFile);
        helpers.addEvents(removeExternalFile, 'click', _this.functions.handleRemoveExternalFile);
        /* LABEL/INPUT SHENANIGANS */
        _this.functions.bindFieldsetCollapse();
        helpers.addEvents(document.querySelectorAll('.editor__label, .js-panelToggleLabel'), 'click', _this.functions.handleCollapsePanel);
        _this.data.modal.overlay.addEventListener('click', _this.functions.toggleModal);
    },
    bindBroadcastEvents() {
        const _this = mcsandyUI;
        const { helpers } = _this;
        const { data } = _this;
        const editors = document.querySelectorAll('.field--textarea');
        const editorFieldsets = data.fields.fieldsets;
        const fileUploads = data.fields.upload;

        if ('BroadcastChannel' in window) {
            const fieldChannel = new BroadcastChannel('field_broadcasts');

            [...data.ctrls.broadcasters].forEach((broadcaster) => {
                broadcaster.addEventListener(broadcaster.dataset.broadcast, (evt) => {
                    fieldChannel.postMessage({
                        id: evt.target.id, value: evt.target.value, eventType: evt.type, projectName: mcsandyProject.project,
                    });
                });
            });

            fieldChannel.onmessage = (evt) => {
                const { data } = evt;
                const targetEl = document.getElementById(data.id);

                if (data.projectName == mcsandyProject.project) {
                    targetEl.value = data.value;
                    mcsandy.functions.updateContent();
                }
            };
        }
    },
    functions: {
        handleConnection(override) {
            const _this = mcsandyUI;
            const ctrl = document.getElementById('js-onlineStatus');
            mcsandyAppData.ui.onlineState = navigator.onLine ? 'online' : 'offline';
            if (override !== undefined && typeof override === 'string') {
                mcsandyAppData.ui.onlineState = override; // Added this for debugging when I'm on an airplane.
            }
            if (mcsandyAppData.ui.onlineState === 'online') {
                ctrl.className = ctrl.className.replace(/(?:^|\s)offline(?!\S)/g, ' online');
                document.title = 'McSandy | Online';
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--offline(?!\S)/g, ' mcsandy--online');
                mcsandy.functions.createLibSelect();
            } else {
                ctrl.className = ctrl.className.replace(/(?:^|\s)online(?!\S)/g, ' offline');
                document.title = 'McSandy | Offline';
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--online(?!\S)/g, ' mcsandy--offline');
            }
        },
        handleCollapsePanel(e) {
            const _this = mcsandyUI;
            const { target } = e;
            const parent = target.parentElement;
            _this.helpers.toggleClass(parent, 'js-collapsed');
        },
        handleHash() {
            const _this = mcsandyUI;
            if (window.location.hash.length > 0) {
                const hash = _this.helpers.unconvertHash(window.location.hash);
                _this.functions.loadProject(hash);
            }
        },
        setHash(hash) {
            const _this = mcsandyUI;
            window.location.hash = _this.helpers.convertHash(hash);
        },
        handleSearch() {
            const _this = mcsandyUI;
            const urlParams = _this.helpers.getUrlParams();

            if ('fullwindow' in urlParams) {
                _this.functions.setFullWindow(urlParams.fullwindow);
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
            const _this = mcsandyUI;
            const ctrlShiftEls = document.querySelectorAll('[data-ctrlshiftkey]');
            const modifierKey = evt.keyCode;
            const isCtrlShift = !!evt.target.dataset.ctrlshiftkey;
            const isParentCtrlShift = !!evt.target.parentElement.dataset.ctrlshiftkey;
            const ctrlShiftModifier = isCtrlShift ? evt.target.dataset.ctrlshiftkey : evt.target.parentElement.dataset.ctrlshiftkey;
            const id = isCtrlShift ? evt.target.id : evt.target.parentElement.id;

            if (evt.ctrlKey && evt.shiftKey && (isCtrlShift || isParentCtrlShift) && modifierKey === ctrlShiftModifier.toUpperCase().charCodeAt()) {
                _this.functions.openIdInFullWindow(id);
            }
        },
        handleProjectLoad(e) {
            e.preventDefault();
            const _this = mcsandyUI;
            const project = _this.data.ctrls.projectSelect.value;
            if (project) {
                _this.functions.setHash(project);
                _this.functions.loadProject(project);
                _this.functions.flashClass(e.currentTarget);
            } else {
                alert('You have no projects to load');
            }
        },
        flashClass(el) {
            el.className += ' anim-flash';
            setTimeout(() => {
                el.className = el.className.replace('anim-flash', '');
            }, 3000);
        },
        loadProject(project) {
            const _this = mcsandyUI;
            const projData = store.get(0, `mp-${project}`);
            window.mcsandyProject = projData;
            console.info('McSandy Loaded a Project');
            console.info(projData);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            _this.functions.updateEditors(projData.rawParts.html, projData.rawParts.css, projData.rawParts.js);
            _this.functions.updateCtrls(projData);
        },
        handleRemoveExternalFile(e) {
            e.preventDefault();
            const _this = mcsandyUI;
            const { helpers } = _this;
            helpers.removeParent(e.target);
            mcsandy.functions.updateContent();
        },
        handleFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            const _this = mcsandyUI;
            const { files } = e.dataTransfer;
            let i = 0;
            for (var f; f == files[i]; i++) {
                const input = _this.helpers.createExternalFileSet(f);
                e.target.appendChild(input);
            }
        },
        addError(el, msgType) {
            const _this = mcsandyUI;
            const { helpers } = _this;
            const errorMsgs = mcsandyAppData.ui.fieldErrorMessages;
            const msg = errorMsgs[msgType];
            const errTimeout = function () {
                el.placeholder = el.dataset.originalPlaceholder;
            };
            el.dataset.originalPlaceholder = el.placeholder;
            el.placeholder = msg;
            window.setTimeout(errTimeout, 5000);
        },
        handleAddExternalFile(e) {
            e.preventDefault();
            const _this = mcsandyUI;
            const { helpers } = _this;
            const { functions } = _this;
            const fieldPatterns = mcsandyAppData.ui.fieldRegexPatterns;
            const el = e.target;
            let clonedParent;
            const exFileField = e.target.parentNode.querySelector('.fieldset__field');
            if (exFileField.value) {
                if (exFileField.value.match(fieldPatterns.url) !== null) {
                    clonedParent = helpers.cloneParent(el);
                    e.target.removeEventListener('click', _this.functions.handleAddExternalFile);
                    el.className = el.className.replace('fieldset__button--add', 'fieldset__button--rem');
                    el.innerHTML = '&mdash;';
                    el.parentNode.parentNode.appendChild(clonedParent);
                    mcsandy.functions.updateContent();
                    _this.bindUiEvents();
                    clonedParent.dataset.saved = false;
                } else {
                    functions.addError(exFileField, 'notURL');
                }
            } else {
                functions.addError(exFileField, 'empty');
            }
        },
        handleLibToggle(e) {
            const _this = mcsandy;
            const { value } = e.target;
            const exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                mcsandy.blobData.externalJS.splice(_this.blobData.externalJS.indexOf(exJs, 1));
            } else {
                mcsandy.blobData.externalJS.push(exJs);
            }
        },
        handleDownloadProject(e) {
            e.preventDefault();
            const _this = mcsandyUI;
            const project = store.get(0, `mp-${_this.data.ctrls.projectSelect.value}`); // don't get the value of the button, but the one from the select box.
            _this.functions.flashClass(document.getElementById('js-projectDownload'));
            mcsandy.functions.downloadContent(project);
        },
        handleFileUpload(e) {
            e.stopPropagation();
            e.preventDefault();
            const { files } = e.dataTransfer;
            let newImage;
            const toElement = e.toElement || e.target;
            for (var i = 0, f; f = files[i]; i++) {
                const reader = new FileReader();
                if (f.type.match('image.*') && !f.type.match('svg')) {
                    reader.onload = function (evt) {
                        if (toElement.parentNode.dataset.fileext === 'html') {
                            newImage = `<img src="${evt.target.result}"/>`;
                        } else {
                            newImage = `url('${evt.target.result}')`;
                        }
                        toElement.value += newImage;
                    };
                    reader.readAsDataURL(f);
                } else {
                    reader.onload = function (evt) {
                        toElement.value += evt.target.result;
                    };
                    reader.readAsText(f);
                }
            }
        },
        handleDragOver(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },
        handleDragStart(e) {
            e.dataTransfer.dropEffect = 'all';
            e.dataTransfer.effectAllowed = 'all';
            console.log(e);
            const _this = mcsandyUI;
            const source = e.target.parentNode.querySelector('textarea').value;
            const projectName = mcsandy.data.ctrls.projectName.value.length > 0 ? mcsandy.data.ctrls.projectName.value : 'McSandy';
            const type = e.target.dataset.fileext;
            const blob = new Blob([source], { type });
            const sourceURL = URL.createObjectURL(blob);
            const fileDetails = `${e.target.dataset.mimeoutput}:${projectName}.${type}:${sourceURL}`;
            //            console.log(e.target.dataset.mimeoutput,projectName, type, sourceURL); ONly FF will log anything
            e.dataTransfer.setData('DownloadURL', fileDetails);
        },
        handleDragEnd(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'all';
            const _this = mcsandyUI;
            e.dataTransfer.getData('DownloadURL', 0);
        },
        updateEditors(html, css, js) {
            const _this = mcsandyUI;
            const { ctrls } = mcsandy.data;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        updateCtrls(projData) {
            const _this = mcsandyUI;
            const projectField = mcsandy.data.ctrls.projectName;
            const { ctrls } = _this.data;
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
                _this.functions.updateExternalAssetFields(projData, 'css');
                _this.functions.updateExternalAssetFields(projData, 'js');
                _this.bindUiEvents();
            }
        },
        updateExternalAssetFields(projData, type) {
            const _this = mcsandyUI;
            const assetFields = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper');
            const xAssets = projData.externals.assets[type];
            const assetFieldsArr = Array.prototype.slice.call(assetFields);
            let lastField;
            const neededFields = xAssets.length - assetFields.length;
            let i;
            for (i = 0; i < neededFields + 1; i++) {
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
                for (i = availFields - 1; i >= xAssets.length + 1; i--) {
                    lastField = document.getElementById(`js-fieldset--${type}`).querySelectorAll('.fieldset__inputWrapper').item(i);
                    lastField.parentNode.removeChild(lastField);
                }
            }
        },
        bindFieldsetCollapse() {
            const _this = mcsandyUI;
            const labels = document.querySelectorAll('.fieldset__label');
            for (i = 0; i < labels.length; i++) {
                const l = labels[i];
                l.addEventListener('click', _this.helpers.toggleEditorField);
            }
        },
        addModalContent(title, content) {
            const _this = mcsandyUI;
            const { modal } = _this.data;
            modal.title.innerText = title;
            modal.content.innerHTML = content;
        },
        toggleModal(content) {
            const _this = mcsandyUI;
            const { modal } = _this.data;
            _this.helpers.toggleClass(modal.container, 'visible');
            _this.helpers.toggleClass(modal.overlay, 'visible');
            if (typeof content === 'string') {
                modal.content.innerHTML = content;
            }
        },
    },
};

/* MCSANDY: The preview, storage, and retrieval */
mcsandy = {
    init() {
        const _this = mcsandy;
        console.info('McSandy is Running');
        _this.bindUiEvents();
        _this.functions.createProjectSelect();
        if (navigator.onLine) {
            _this.functions.createLibSelect();
        }
    },
    data: mcsandyAppData.core,
    blobData: {
        reset: 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
        externalJS: [],
    },
    helpers: {
        inputArray(wrapper, inputs) {
            const inputArray = wrapper.querySelectorAll(inputs);
            const valueArray = [];
            [].forEach.call(inputArray, (el, i) => {
                if (el.value) {
                    valueArray.push(el.value);
                }
            });
            return valueArray;
        },
        prepareCSS(css) {
            return `<style type="text/css">${css}</style>`;
        },
        prepareHTML(html) {
            return html;
        },
        prepareExternalJS(javascript) {
            // make sure that the JS has a protocol that'll work
            let js = (javascript.slice(javascript.indexOf('//') + 2));
            // if McSandy isn't running as http(s), then it's probably file:// - which shouldn't use a relative protocol
            if (!window.location.protocol.match('http')) {
                js = `http://${js}`;
            } else {
                js = `${window.location.protocol}//${js}`;
            }
            return `<script type="text\/javascript" src="${js}"><\/script>`;
        },
        prepareExternalCSS(css) {
            return `<link rel="stylesheet" href="${css}"/>`;
        },
        createExternalJS(libList) {
            // libList is an array
            const _this = mcsandy;
            let externalJSSet = '';
            if (mcsandyAppData.ui.onlineState === 'online') {
                /* only add external libraries if we're online */
                libList.forEach((el) => {
                    externalJSSet += _this.helpers.prepareExternalJS(el);
                });
            }
            return externalJSSet;
        },
        createExternalCSS(cssList) {
            // cssList is an array
            const _this = mcsandy;
            let externalCSSSet = '';
            if (mcsandyAppData.ui.onlineState === 'online') {
                /* only add external libraries if we're online */
                cssList.forEach((el) => {
                    externalCSSSet += _this.helpers.prepareExternalCSS(el);
                });
            }
            return externalCSSSet;
        },
        prepareInternalJS(js) {
            return `<script type="text\/javascript">${js}<\/script>`;
        },
        getExternalAssets(type) {
            const _this = mcsandy;
            return mcsandyUI.helpers.getAssetsByType(type);
        },
        createExternalAssetsObj() {
            const _this = mcsandy;
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
            const _this = mcsandy;
            const appData = mcsandyAppData;
            const { helpers } = _this;
            const reset = helpers.prepareCSS(_this.blobData.reset);
            const { ctrls } = _this.data;
            const userCSS = helpers.prepareCSS(ctrls.css.value);
            const externalLibraries = helpers.createExternalJS(mcsandyProject.externals.libraries.js);
            const externalSavedCSS = helpers.createExternalCSS(mcsandyProject.externals.assets.css);
            const externalUnsavedCSS = helpers.createExternalCSS(helpers.inputArray(appData.ui.fieldsets.css, appData.ui.fields.unsaved));
            return `<head>${reset}${externalSavedCSS}${externalUnsavedCSS}${userCSS}${externalLibraries}</head>`;
        },
        constructBodyOpen() {
            const _this = mcsandy;
            const appData = mcsandyAppData;
            const { helpers } = _this;
            const { ctrls } = _this.data;
            const userHTML = helpers.prepareHTML(ctrls.html.value);
            return `<body>${userHTML}`;
        },
        constructBodyClose() {
            const _this = mcsandy;
            const appData = mcsandyAppData;
            const { helpers } = _this;
            const userJS = helpers.prepareInternalJS(_this.data.ctrls.js.value);
            const externalSavedJS = helpers.createExternalJS(mcsandyProject.externals.assets.js);
            const externalUnsavedJS = helpers.createExternalJS(helpers.inputArray(appData.ui.fieldsets.js, appData.ui.fields.unsaved));

            return `${externalSavedJS}\n${externalUnsavedJS}\n${userJS}</body>`;
        },
        wrapBlobParts() {
            const _this = mcsandy;
            const { blobData } = _this;
            const { ctrls } = _this.data;
            const bodyOpen = _this.helpers.constructBodyOpen();
            const head = _this.helpers.constructHead();
            const bodyClose = _this.helpers.constructBodyClose();
            const blobKit = [head, bodyOpen, bodyClose];
            return blobKit;
        },
        createProjectObj(projectName, rawParts, blobArray, assets) {
            return {
                project: projectName,
                blobArray,
                rawParts,
                externals: assets,
            };
        },
        buildBlob(parts, type) {
            const _this = mcsandy;
            const { helpers } = _this;
            blobType = type !== undefined ? `${type};charset=utf-8` : 'text/html;charset=utf-8',
            blob = new Blob(parts, { type: blobType });
            window.mcsandyblob = blob;
            return blob;
        },
        getStoredProjects() {
            const _this = mcsandy;
            const len = localStorage.length;
            const projects = [];
            for (i = 0; i < len; i++) {
                if (localStorage.key(i).indexOf('mp-') !== -1) {
                    projects.push(store.get(0, i));
                }
            }
            return projects;
        },
        createSelectOption(el) {
            const _this = mcsandy;
            const option = document.createElement('option');
            option.value = el;
            option.text = el;
            return option;
        },
    },
    bindUiEvents() {
        const _this = mcsandy;
        const { functions } = _this;
        const { ctrls } = _this.data;

        // BIND EVENTS TO TEXTAREAS
        ctrls.css.addEventListener('keyup', (e) => {
            clearTimeout(timer);
            var timer = setTimeout(functions.updateContent(), 750);
        });
        ctrls.html.addEventListener('keyup', (e) => {
            clearTimeout(timer);
            var timer = setTimeout(functions.updateContent(), 750);
        });
        ctrls.js.addEventListener('change', (e) => {
            functions.updateContent();
        });

        // BIND EVENTS TO BUTTONS
        ctrls.projectSave.addEventListener('click', functions.saveContent);
        ctrls.projectDel.addEventListener('click', functions.delContent);
        ctrls.projectNew.addEventListener('click', functions.clearContent);
    },
    functions: {
        createProjectSelect() {
            const _this = mcsandy;
            const projects = _this.helpers.getStoredProjects();
            const select = document.getElementById('js-selectProjects');
            const pageHash = window.location.hash;
            select.innerHTML = '';// clear pre-exiting options
            projects.forEach((el) => {
                const option = _this.helpers.createSelectOption(el.project);
                if (mcsandyUI.helpers.unconvertHash(el.project) === mcsandyUI.helpers.unconvertHash(pageHash)) {
                    select.selected = true;
                }
                select.appendChild(option);
            });
            if (window.location.hash) {
                select.value = mcsandyUI.helpers.unconvertHash(window.location.hash);
            }
        },
        createLibSelect() {
            const _this = mcsandy;
            const libs = _this.data.externalJS;
            const libWrap = document.querySelector('[data-populate="externalLibs"]');
            for (const lib in libs) {
                const exJs = libs[lib];
                const input = mcsandyUI.helpers.createInput('checkbox', lib, 'projectManager__jsLib__check input', lib, exJs);
                label = mcsandyUI.helpers.createLabel(lib, 'projectManager__jsLib__label', lib);
                input.addEventListener('change', _this.functions.handleLibToggle);
                libWrap.appendChild(input);
                libWrap.appendChild(label);
            }
            mcsandyUI.functions.bindFieldsetCollapse();
        },
        handleLibToggle(e) {
            const _this = mcsandy;
            const { value } = e.target;
            const exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                _this.blobData.externalJS.splice(_this.blobData.externalJS.indexOf(exJs, 1));
                mcsandyProject.externals.libraries.js.splice(mcsandyProject.externals.libraries.js.indexOf(exJs, 1));
            } else {
                _this.blobData.externalJS.push(exJs);
                mcsandyProject.externals.libraries.js.push(exJs);
            }
        },
        updateContent(loadedParts) {
            /* load content and bindUIevents call this function */
            /* only mcsandyUI.functions.loadContent sends loadedParts */
            const _this = mcsandy;
            const { iframe } = _this.data.targets;
            const parts = loadedParts !== undefined ? loadedParts.blobArray : _this.helpers.wrapBlobParts();
            const result = _this.helpers.buildBlob(parts);
            iframe.src = window.URL.createObjectURL(result);
        },
        delContent(e) {
            e.preventDefault();
            const _this = mcsandy;
            const projectName = _this.data.ctrls.projectName.value;
            store.del(0, `mp-${projectName}`);
            window.history.pushState({}, 'Create New Project', window.location.pathname);
            _this.functions.createProjectSelect();
            _this.data.ctrls.projectName.value = '';
        },
        clearContent(e) {
            e.preventDefault();
            const _this = mcsandy;
            window.history.pushState({}, 'Create New Project', window.location.pathname);
        },
        saveContent(e) {
            e.preventDefault();
            mcsandyUI.functions.flashClass(e.currentTarget);
            const _this = mcsandy;
            const { ctrls } = _this.data;
            const rawParts = _this.helpers.createRawParts(ctrls.html.value, ctrls.css.value, ctrls.js.value, _this.blobData.externalJS);
            const blobArray = _this.helpers.wrapBlobParts();
            const projectName = _this.data.ctrls.projectName.value;
            const externalAssets = _this.helpers.createExternalAssetsObj();
            const project = _this.helpers.createProjectObj(projectName, rawParts, blobArray, externalAssets);
            store.set(0, `mp-${projectName}`, project);
            mcsandyUI.functions.setHash(projectName);
            _this.functions.createProjectSelect();
        },
        downloadContent(downloadObj, type) {
            // downloadObj should be an object.
            // It should have in it an array called blobArray.
            // there must be a minimum of one item in the array, which contains the stuff we want to download
            // type is presumed to be either html, css, or js
            const _this = mcsandy;
            const downloadType = type !== undefined ? type : 'html'; // if there's no type, then it must be a dl for the entire project
            const parts = downloadObj !== undefined ? downloadObj.blobArray : _this.helpers.wrapBlobParts();
            const mimeType = type !== 'javascript' ? `text/${type}` : 'application/javascript';
            const blob = _this.helpers.buildBlob(parts, mimeType);
            const fileName = `${downloadObj.project}.${downloadType}`;
            saveAs(blob, fileName);
        },
    },
};
