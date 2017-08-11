
/*MCSANDYUI: the main user interactions with the app*/
mcsandyUI = {
    init: function () {
        var _this = mcsandyUI;
        console.info("McSandyUI is Running");
        _this.bindUiEvents();
    },
    data: mcsandyAppData.ui,
    helpers: {
        keyDown: function (e) {
            var _this = mcsandyUI;
            /*SAVE*/
            if (e.ctrlKey) {
                switch (e.keyCode) {
                case 83:
                    mcsandy.functions.saveContent(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectSave);
                    break;
                case 82:
                    mcsandy.functions.updateContent();
                    break;
                case 76:
                    _this.functions.handleProjectLoad(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectLoad);
                    break;
                case 70:
                    _this.functions.handleDownloadProject(e);
                    _this.functions.flashClass(mcsandy.data.ctrls.projectDownload);
                    break;
                default:
                    break;
                }
                if (e.shiftKey) {
                    switch (e.keyCode) {
                    case 69:
                        document.getElementById('js-editor-toggle').checked = document.getElementById('js-editor-toggle').checked === true ? false : true;
                        break;
                    case 80:
                        document.getElementById('js-footer-editor-toggle').checked = document.getElementById('js-footer-editor-toggle').checked === true ? false : true;
                        break;
                    case 187:
                        mcsandy.functions.clearContent(e);
                        break;
                    case 107:
                        mcsandy.functions.clearContent(e);
                        break;
                    case 8:
                        mcsandy.functions.delContent(e);
                        break;
                    case 72:
                        _this.helpers.toggleClass(document.querySelector('body'), 'mcsandy--horizontal');
                        mcsandyAppData.userPrefs.ui.hLayout = mcsandyAppData.userPrefs.ui.hLayout === true ? false : true;
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
        keyUp: function () {
            var _this = mcsandyUI;
        },
        convertHash: function (hash) {
            return hash.replace(' ', '_');
        },
        unconvertHash: function (hash) {
            hash = hash.replace('#', '');
            hash = hash.replace('_', ' ');
            return hash;
        },
        createInput: function (t, id, c, v, d) {
            var input = document.createElement('input');
            input.type = t;
            input.id = id;
            input.className = c;
            input.value = v;
            input.setAttribute('data-mcsandy', d);
            return input;
        },
        createLabel: function (id, c, t) {
            var label = document.createElement('label');
            label.className = c;
            label.setAttribute('for', id);
            label.innerHTML = t;
            return label;
        },
        createExternalInput: function (type, classes, placeholder) {
            var input = document.createElement('input');
            input.type = type;
            input.class = classes;
            input.placeholder = placeholder;
            return input;
        },
        removeParent: function (el) {
            var parent = el.parentNode;
            parent.remove();
        },
        cloneParent: function (el) {
            var clone = el.parentNode.cloneNode(true),
                grandparent = el.parentNode.parentNode;
            clone.querySelector('input').value = '';
            return clone;
        },
        toggleEditorField: function (e) {
            var label = e.target,
                parent = label.parentElement;
            if (!label.className.match('js-shrunk')) {
                label.className = label.className + ' ' + 'js-shrunk';
                parent.className = parent.className + ' ' + 'js-shrunk';
            } else {
                label.className = label.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, "");
                parent.className = parent.className.replace(/(?:^|\s)js-shrunk(?!\S)/g, "");
            }
        },
        toggleClass: function (el, className) {
            if (el.className.match(className)) {
                el.className = el.className.replace(className, '');
            } else {
                el.className = el.className + ' ' + className;
            }
        },
        addEvents: function (els, evt, func) {
            [].forEach.call(els, function (el) {
                el.addEventListener(evt, func, false);
            });
        },
        getExternalJsLibs: function () {
            var _this = mcsandy,
                libEls = document.querySelectorAll(_this.data.ctrls.jsLibs),
                jsLibs = [];
            [].forEach.call(libEls, function (lib) {
                if (lib.checked) {
                    jsLibs.push(_this.data.externalJS[lib.value]);
                }
            });
            return jsLibs;
        },
        getAssetsByType: function (type) {
            var _this = mcsandyUI,
                fieldset = document.querySelector('.fieldset--' + type),
                inputs = fieldset.querySelectorAll(_this.data.fields.assets),
                assets = [];
            [].forEach.call(inputs, function (input) {
                if (input.value.length > 0) {
                    assets.push(input.value);
                }
            });
            return assets;
        },
        createExternalFileWrapper: function () {
            var wrapper = document.createElement('div');
            wrapper.className = 'fieldset__inputWrapper';
            return wrapper;
        },
        createExternalFileButton: function (buttonClass) {
            var button = document.createElement('button');
            button.className = 'fieldset__button ' + buttonClass;
            button.innerHTML = "&mdash;";
            return button;
        },
        createExternalFileSet: function (file, inputType, inputClass, buttonClass, buttonText) {
            var _this = mcsandyUI,
                wrapper = _this.helpers.createExternalFileWrapper(),
                input = _this.helpers.createInput(inputType, 'js-' + Math.ceil(Math.random() * 10), inputClass, file, file),
                button = _this.helpers.createExternalFileButton(buttonClass, buttonText);
            wrapper.appendChild(input);
            wrapper.appendChild(button);
            return wrapper;
        },
        runTest: function () {
            var exCss = mcsandyProject.externals.assets.css,
                dataUI = mcsandyAppData.ui;
        }
    },
    bindUiEvents: function () {
        var _this = mcsandyUI,
            helpers = _this.helpers,
            data = _this.data,
            ctrls = data.ctrls,
            editors = document.querySelectorAll('.field--textarea'),
            editorFieldsets = data.fields.fieldsets,
            fileUploads = data.fields.upload,
            addExternalFile = document.querySelectorAll(data.fields.add),
            removeExternalFile = document.querySelectorAll(data.fields.rem);

        /*CHECK FOR INTERNET CONNECTION*/
        window.addEventListener('load', function () {
            _this.functions.handleConnection();
            if (window.location.hash) {
                _this.functions.handleHash();
            }
        });
        window.addEventListener("offline", _this.functions.handleConnection);
        window.addEventListener("online", _this.functions.handleConnection);

        /*WINDOW HASH CHANGE */
        window.addEventListener("hashchange", _this.functions.handleHash);


        /*SELECT A PROJECT*/
        ctrls.projectLoad.addEventListener('click', _this.functions.handleProjectLoad);

        /* DOWNLOAD A PROJECT */
        ctrls.projectDownload.addEventListener('click', _this.functions.handleDownloadProject);

        /*Info button */
        ctrls.appInfo.addEventListener('click', _this.functions.toggleModal);

        /*THE EDITOR FIELDS */
        document.addEventListener('keydown', helpers.keyDown);
        document.addEventListener('keyup', helpers.keyUp);

        [].forEach.call(editors, function (editor) {
            editor.addEventListener('keydown', function (e) {
                if (e.ctrlKey && e.keyCode === 192) {
                    _this.helpers.toggleClass(e.target, 'js-shrink');
                }
            });
            editor.addEventListener('dragover', _this.functions.handleDragOver);
            editor.addEventListener('drop', _this.functions.handleFileUpload);
        });

        /*GLOBAL BUTTON STUFF*/
        helpers.addEvents(document.querySelectorAll('button'), 'click', _this.functions.flashClass);

        /*DRAG AND DROP FILES INTO EDITORS */
        helpers.addEvents(fileUploads, 'change', _this.helpers.handleFileUpload);

        helpers.addEvents(editorFieldsets, 'dragstart', _this.functions.handleDragStart);
        helpers.addEvents(editorFieldsets, 'dragend', _this.functions.handleDragEnd);
        helpers.addEvents(editorFieldsets, 'drop', _this.functions.handleFileDrop);
        /*ADD EXTERNAL LINK*/
        helpers.addEvents(addExternalFile, 'click', _this.functions.handleAddExternalFile);
        helpers.addEvents(removeExternalFile, 'click', _this.functions.handleRemoveExternalFile);
        /*LABEL/INPUT SHENANIGANS*/
        _this.functions.bindFieldsetCollapse();
        helpers.addEvents(document.querySelectorAll('.editor__label, .js-panelToggleLabel'),'click', _this.functions.handleCollapsePanel);
        _this.data.modal.overlay.addEventListener('click', _this.functions.toggleModal);
    },
    functions: {
        handleConnection: function (override) {
            var _this = mcsandyUI,
                ctrl = document.getElementById('js-onlineStatus');
            mcsandyAppData.ui.onlineState = navigator.onLine ? "online" : "offline";
            if (override !== undefined && typeof override === 'string') {
                mcsandyAppData.ui.onlineState = override; // Added this for debugging when I'm on an airplane.
            }
            if (mcsandyAppData.ui.onlineState === "online") {
                ctrl.className = ctrl.className.replace(/(?:^|\s)offline(?!\S)/g, " online");
                document.title = "McSandy | Online";
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--offline(?!\S)/g, " mcsandy--online");
                mcsandy.functions.createLibSelect();
            } else {
                ctrl.className = ctrl.className.replace(/(?:^|\s)online(?!\S)/g, " offline");
                document.title = "McSandy | Offline";
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--online(?!\S)/g, " mcsandy--offline");
            }
        },
        handleCollapsePanel: function (e) {
            var _this = mcsandyUI,
                target = e.target,
            parent = target.parentElement;
            _this.helpers.toggleClass(parent,'js-collapsed');
        },
        handleHash: function () {
            var _this = mcsandyUI;
            if (window.location.hash.length > 0) {
                var hash = _this.helpers.unconvertHash(window.location.hash);
                _this.functions.loadProject(hash);
            }
        },
        setHash: function (hash) {
            var _this = mcsandyUI;
            window.location.hash = _this.helpers.convertHash(hash);
        },
        handleProjectLoad: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                project = _this.data.ctrls.projectSelect.value;
            _this.functions.setHash(project);
            _this.functions.loadProject(project);
            _this.functions.flashClass(e.currentTarget);
        },
        flashClass: function (el) {
            el.className = el.className + ' anim-flash';
            setTimeout(function () {
                el.className = el.className.replace('anim-flash', '');
            }, 3000);
        },
        loadProject: function (project) {
            var _this = mcsandyUI,
                projData = store.get(0, 'mp-' + project);
            window.mcsandyProject = projData;
            console.info("McSandy Loaded a Project");
            console.info(projData);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            _this.functions.updateEditors(projData.rawParts.html, projData.rawParts.css, projData.rawParts.js);
            _this.functions.updateCtrls(projData);
        },
        handleRemoveExternalFile: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                helpers = _this.helpers;
            helpers.removeParent(e.target);
            mcsandy.functions.updateContent();
        },
        handleFileDrop: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = mcsandyUI,
                files = e.dataTransfer.files,
                i = 0;
            for ( var f; f == files[i]; i++) {
                var input = _this.helpers.createExternalFileSet(f);
                e.target.appendChild(input);
            }

        },
        addError: function (el, msgType) {
            var _this = mcsandyUI,
                helpers = _this.helpers,
                errorMsgs = mcsandyAppData.ui.fieldErrorMessages,
                msg = errorMsgs[msgType],
                errTimeout = function () {
                    el.placeholder = el.dataset.originalPlaceholder;
                };
            el.dataset.originalPlaceholder = el.placeholder;
            el.placeholder = msg;
            window.setTimeout(errTimeout, 5000);
        },
        handleAddExternalFile: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                helpers = _this.helpers,
                functions = _this.functions,
                fieldPatterns = mcsandyAppData.ui.fieldRegexPatterns,
                el = e.target,
                clonedParent,
                exFileField = e.target.parentNode.querySelector('.fieldset__field');
            if (exFileField.value) {
                if (exFileField.value.match(fieldPatterns.url) !== null) {
                    clonedParent = helpers.cloneParent(el);
                    e.target.removeEventListener('click',_this.functions.handleAddExternalFile);
                    el.className = el.className.replace('fieldset__button--add', 'fieldset__button--rem');
                    el.innerHTML = "&mdash;";
                    el.parentNode.parentNode.appendChild(clonedParent);
                    mcsandy.functions.updateContent();
                    _this.bindUiEvents();
                    clonedParent.dataset.saved = false;
                }  else {
                    functions.addError(exFileField, 'notURL');
                }

            } else {
                functions.addError(exFileField, 'empty');
            }

        },
        handleLibToggle: function (e) {
            var _this = mcsandy,
                value = e.target.value,
                exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                mcsandy.blobData.externalJS.splice(_this.blobData.externalJS.indexOf(exJs, 1));
            } else {
                mcsandy.blobData.externalJS.push(exJs);
            }
        },
        handleDownloadProject: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                project = store.get(0, 'mp-' + _this.data.ctrls.projectSelect.value); // don't get the value of the button, but the one from the select box.
            _this.functions.flashClass(document.getElementById('js-projectDownload'));
            mcsandy.functions.downloadContent(project);
        },
        handleFileUpload: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files,
                newImage,
                toElement = e.toElement || e.target;
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
              if (f.type.match('image.*') && !f.type.match('svg')) {
                reader.onload = function (evt) {
                    if (toElement.parentNode.dataset.fileext === "html") {
                        newImage = '<img src="' + evt.target.result + '"/>';
                    } else {
                        newImage = "url('" + evt.target.result + "')";
                    }
                    toElement.value = toElement.value + newImage ;
                };
                reader.readAsDataURL(f);
              } else {
                reader.onload = function (evt) {
                    toElement.value = toElement.value + evt.target.result;
                };
                    reader.readAsText(f);
                }
            }
        },
        handleDragOver: function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },
        handleDragStart: function (e) {
            e.dataTransfer.dropEffect = 'all';
            e.dataTransfer.effectAllowed = 'all';
            var _this = mcsandyUI,
                source = e.target.querySelector('textarea').value,
                projectName = mcsandy.data.ctrls.projectName.value.length > 0 ? mcsandy.data.ctrls.projectName.value : 'McSandy',
                type = e.target.dataset.fileext,
                blob = new Blob([source], {type: type}),
                sourceURL = URL.createObjectURL(blob),
                fileDetails = e.target.dataset.mimeoutput + ":" + projectName +"." + type +":" + sourceURL;
//            console.log(e.target.dataset.mimeoutput,projectName, type, sourceURL); ONly FF will log anything
            e.dataTransfer.setData("DownloadURL", fileDetails);
        },
        handleDragEnd: function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'all';
            var _this = mcsandyUI;
            e.dataTransfer.getData('DownloadURL',0);
        },
        updateEditors: function (html, css, js) {
            var _this = mcsandyUI,
                ctrls = mcsandy.data.ctrls;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        updateCtrls: function (projData) {
            var _this = mcsandyUI,
                projectField = mcsandy.data.ctrls.projectName,
                ctrls = _this.data.ctrls;
            projectField.value = projData.project;
            projectField.placeholder = projData.project;
            ctrls.projectDownload.value = projData.project;

            if (projData.externals.libraries) {
                projData.externals.libraries.js.forEach(function (el) {
                    var exJsInput = document.querySelector('.fieldset--externalLibs').querySelector('[data-mcsandy="' + el + '"]');
                        exJsInput.checked = true;
                });
            }
            if (projData.externals) {
               _this.functions.updateExternalAssetFields(projData, 'css');
               _this.functions.updateExternalAssetFields(projData, 'js');
                _this.bindUiEvents();
            }
        },
        updateExternalAssetFields: function (projData, type) {
            var _this = mcsandyUI,
                assetFields = document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper'),
                xAssets = projData.externals.assets[type],
                assetFieldsArr = Array.prototype.slice.call(assetFields),
                lastField,
                neededFields = xAssets.length - assetFields.length,
                i;
            for (i = 0; i < neededFields+1; i++) {
                lastField = document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper').item(i);
                var clone = lastField.cloneNode(true);
                lastField.parentNode.appendChild(clone);
            }
            Array.prototype.slice.call(document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper')).forEach(function (el, i) {
                var field = el.querySelector('.fieldset__field');
                field.value =xAssets[i] !== undefined ? xAssets[i] : '';
            });
            if ( neededFields < -1) {
                    var availFields = document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper').length;
                for (i = availFields-1; i >= xAssets.length+1; i--) {
                    lastField = document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper').item(i);
                    lastField.parentNode.removeChild(lastField);
                }
            }
        },
        bindFieldsetCollapse: function () {
            var _this = mcsandyUI,
                labels = document.querySelectorAll('.fieldset__label');
            for (i=0; i<labels.length; i++) {
                var l = labels[i];
                l.addEventListener('click', _this.helpers.toggleEditorField);
            }
        },
        addModalContent: function (title, content){
            var _this = mcsandyUI,
                modal = _this.data.modal;
            modal.title.innerText = title;
            modal.content.innerHTML = content;
        },
        toggleModal: function (content) {
            var _this = mcsandyUI,
                modal = _this.data.modal;
            _this.helpers.toggleClass(modal.container, 'visible');
            _this.helpers.toggleClass(modal.overlay, 'visible');
            if (typeof content === "string") {
                modal.content.innerHTML = content;
            }
        }
    }
};

/*MCSANDY: The preview, storage, and retrieval*/
mcsandy = {
    init: function () {
        var _this = mcsandy;
        console.info("McSandy is Running");
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
        externalJS: []
    },
    helpers: {
        inputArray: function (wrapper, inputs) {
            var inputArray = wrapper.querySelectorAll(inputs),
                valueArray = [];
            [].forEach.call(inputArray, function (el, i) {
                if (el.value) {
                    valueArray.push(el.value);
                }
            });
            return valueArray;
        },
        prepareCSS: function (css) {
            return '<style type="text/css">' + css + '</style>';
        },
        prepareHTML: function (html) {
            return html;
        },
        prepareExternalJS: function (javascript) {
            //make sure that the JS has a protocol that'll work
            var js = (javascript.slice(javascript.indexOf('//') + 2));
            //if McSandy isn't running as http(s), then it's probably file:// - which shouldn't use a relative protocol
            if (!window.location.protocol.match('http')) {
                js = 'http://' + js;
            } else {
                js = window.location.protocol + '//' + js;
            }
            return '<script type="text\/javascript" src="' + js + '"><\/script>';
        },
        prepareExternalCSS: function (css) {
            return '<link rel="stylesheet" href="' + css + '"/>';
        },
        createExternalJS: function (libList) {
            //libList is an array
            var _this = mcsandy,
                externalJSSet = '';
            if (mcsandyAppData.ui.onlineState === 'online') {
                /*only add external libraries if we're online*/
                libList.forEach(function (el) {
                    externalJSSet+= _this.helpers.prepareExternalJS(el);
                });
            }
            return externalJSSet;
        },
        createExternalCSS: function (cssList) {
            //cssList is an array
            var _this = mcsandy,
                externalCSSSet = '';
            if (mcsandyAppData.ui.onlineState === 'online') {
                /*only add external libraries if we're online*/
                cssList.forEach(function (el) {
                    externalCSSSet+= _this.helpers.prepareExternalCSS(el);
                });
            }
            return externalCSSSet;
        },
        prepareInternalJS: function (js) {
            return '<script type="text\/javascript">' + js + '<\/script>';
        },
        getExternalAssets: function (type) {
            var _this = mcsandy;
            return mcsandyUI.helpers.getAssetsByType(type);
        },
        createExternalAssetsObj: function () {
            var _this = mcsandy,
                jsLibs = mcsandyUI.helpers.getExternalJsLibs();
            return {
                libraries: {
                    js: jsLibs
                },
                assets: {
                    css: mcsandyUI.helpers.getAssetsByType('css'),
                    js: mcsandyUI.helpers.getAssetsByType('js')
                }
            };
        },
        createRawParts: function (html, css, js, externalJS) {
            var rawParts = {
                html: html,
                css: css,
                js: js,
                external: {
                    js: externalJS
                }
            };
            return rawParts;
        },
        constructHead: function () {
            var _this = mcsandy,
                appData = mcsandyAppData,
                helpers = _this.helpers,
                reset = helpers.prepareCSS(_this.blobData.reset),
                ctrls = _this.data.ctrls,
                userCSS = helpers.prepareCSS(ctrls.css.value),
                externalLibraries = helpers.createExternalJS(mcsandyProject.externals.libraries.js),
                externalSavedCSS = helpers.createExternalCSS(mcsandyProject.externals.assets.css),
                externalUnsavedCSS = helpers.createExternalCSS(helpers.inputArray(appData.ui.fieldsets.css, appData.ui.fields.unsaved));
            return '<head>' + reset + externalSavedCSS + externalUnsavedCSS + userCSS + externalLibraries  + '</head>';
        },
        constructBodyOpen: function () {
            var _this = mcsandy,
                appData = mcsandyAppData,
                helpers = _this.helpers,
                ctrls = _this.data.ctrls,
                userHTML = helpers.prepareHTML(ctrls.html.value);
            return '<body>' + userHTML;
        },
        constructBodyClose: function () {
            var _this = mcsandy,
                appData = mcsandyAppData,
                helpers = _this.helpers,
                userJS = helpers.prepareInternalJS(_this.data.ctrls.js.value),
                externalSavedJS = helpers.createExternalJS(mcsandyProject.externals.assets.js),
                externalUnsavedJS = helpers.createExternalJS(helpers.inputArray(appData.ui.fieldsets.js, appData.ui.fields.unsaved));

            return externalSavedJS + '\n' + externalUnsavedJS + '\n' + userJS + '</body>';
        },
        wrapBlobParts: function () {
            var _this = mcsandy,
                blobData = _this.blobData,
                ctrls = _this.data.ctrls,
                bodyOpen = _this.helpers.constructBodyOpen(),
                head = _this.helpers.constructHead(),
                bodyClose = _this.helpers.constructBodyClose(),
                blobKit = [head,bodyOpen,bodyClose];
            return blobKit;
        },
        createProjectObj: function (projectName, rawParts, blobArray, assets) {
            return {
                'project': projectName,
                blobArray: blobArray,
                rawParts: rawParts,
                externals: assets
            };
        },
        buildBlob: function (parts, type) {
            var _this = mcsandy,
                helpers = _this.helpers;
                blobType = type !== undefined ? type + ';charset=utf-8' : 'text/html;charset=utf-8',
                blob = new Blob(parts, {type : blobType});
            window.mcsandyblob = blob;
            return blob;
        },
        getStoredProjects: function () {
            var _this = mcsandy,
                len = localStorage.length,
                projects = [];
            for (i = 0; i < len; i++) {
                if (localStorage.key(i).indexOf('mp-') !== -1) {
                    projects.push(store.get(0,i));
                }
            }
            return projects;
        },
        createSelectOption: function (el) {
            var _this = mcsandy,
                option = document.createElement('option');
            option.value = el;
            option.text = el;
            return option;
        }
    },
    bindUiEvents: function () {
        var _this = mcsandy,
            functions = _this.functions,
            ctrls = _this.data.ctrls;

        //BIND EVENTS TO TEXTAREAS
        ctrls.css.addEventListener('keyup',function (e) {
            clearTimeout(timer);
            var timer = setTimeout(functions.updateContent(), 750);

        });
        ctrls.html.addEventListener('keyup',function (e) {
            clearTimeout(timer);
            var timer = setTimeout(functions.updateContent(), 750);
        });
        ctrls.js.addEventListener('change',function (e) {
            functions.updateContent();
        });

        //BIND EVENTS TO BUTTONS
        ctrls.projectSave.addEventListener('click', functions.saveContent);
        ctrls.projectDel.addEventListener('click', functions.delContent);
        ctrls.projectNew.addEventListener('click', functions.clearContent);
    },
    functions: {
        createProjectSelect: function () {
            var _this = mcsandy,
                projects = _this.helpers.getStoredProjects(),
                select = document.getElementById('js-selectProjects'),
                pageHash = window.location.hash;
            select.innerHTML = '';//clear pre-exiting options
            projects.forEach(function (el) {
                var option = _this.helpers.createSelectOption(el.project);
                if (mcsandyUI.helpers.unconvertHash(el.project) === mcsandyUI.helpers.unconvertHash(pageHash)) {
                    select.selected = true;
                }
                select.appendChild(option);
            });
            if (window.location.hash) {
                select.value = mcsandyUI.helpers.unconvertHash(window.location.hash);
            }
        },
        createLibSelect: function () {
            var _this = mcsandy,
                libs = _this.data.externalJS,
                libWrap = document.querySelector('[data-populate="externalLibs"]');
            for (var lib in libs) {
                var exJs = libs[lib],
                    input = mcsandyUI.helpers.createInput('checkbox', lib, 'projectManager__jsLib__check input', lib, exJs);
                    label = mcsandyUI.helpers.createLabel(lib,'projectManager__jsLib__label', lib);
                input.addEventListener('change', _this.functions.handleLibToggle);
                libWrap.appendChild(input);
                libWrap.appendChild(label);
            }
            mcsandyUI.functions.bindFieldsetCollapse();
        },
        handleLibToggle: function (e) {
            var _this = mcsandy,
                value = e.target.value,
                exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                _this.blobData.externalJS.splice(_this.blobData.externalJS.indexOf(exJs, 1));
                mcsandyProject.externals.libraries.js.splice(mcsandyProject.externals.libraries.js.indexOf(exJs, 1));
            } else {
                _this.blobData.externalJS.push(exJs);
                mcsandyProject.externals.libraries.js.push(exJs);
            }
        },
        updateContent: function (loadedParts) {
            /*load content and bindUIevents call this function*/
            /* only mcsandyUI.functions.loadContent sends loadedParts*/
             var _this = mcsandy,
                iframe = _this.data.targets.iframe,
                parts =  loadedParts !== undefined ? loadedParts.blobArray : _this.helpers.wrapBlobParts();
            var result = _this.helpers.buildBlob(parts);
            iframe.src = window.URL.createObjectURL(result);
        },
        delContent: function (e) {
            e.preventDefault();
            var _this = mcsandy,
                projectName = _this.data.ctrls.projectName.value;
            store.del(0,projectName);
            window.location.hash = '';
            _this.functions.createProjectSelect();
            _this.data.ctrls.project.value =  '';
        },
        clearContent: function (e) {
            e.preventDefault();
            var _this = mcsandy;
            window.location.href = window.location.origin + window.location.pathname;
        },
        saveContent: function (e) {
            e.preventDefault();
            mcsandyUI.functions.flashClass(e.currentTarget);
            var _this = mcsandy,
                ctrls = _this.data.ctrls,
                rawParts = _this.helpers.createRawParts(ctrls.html.value, ctrls.css.value, ctrls.js.value, _this.blobData.externalJS),
                blobArray = _this.helpers.wrapBlobParts(),
                projectName = _this.data.ctrls.projectName.value,
                externalAssets = _this.helpers.createExternalAssetsObj(),
                project = _this.helpers.createProjectObj(projectName, rawParts, blobArray, externalAssets);
            store.set(0, 'mp-' + projectName, project);
            mcsandyUI.functions.setHash(projectName);
            _this.functions.createProjectSelect();
        },
        downloadContent: function (downloadObj, type) {
            //downloadObj should be an object.
            //It should have in it an array called blobArray.
            //there must be a minimum of one item in the array, which contains the stuff we want to download
            //type is presumed to be either html, css, or js
            var _this = mcsandy,
                downloadType = type !== undefined ? type : 'html', // if there's no type, then it must be a dl for the entire project
                parts =  downloadObj !== undefined ? downloadObj.blobArray : _this.helpers.wrapBlobParts(),
                mimeType = type !== 'javascript' ? 'text/'+ type : 'application/javascript',
                blob = _this.helpers.buildBlob(parts,mimeType),
                fileName = downloadObj.project + '.' + downloadType;
            saveAs(blob, fileName);
        }
    }
};