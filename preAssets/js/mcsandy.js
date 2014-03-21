/*MCSANDYUI: the main user interactions with the app*/
mcsandyUI = {
    init: function () {
        var _this = mcsandyUI;
        console.info("McSandyUI is Running");
        _this.bindUiEvents();
    },
    data: {
        onlineState: 'online',
        onlineCtrl: document.getElementById('js-onlineStatus'),
        ctrls: {
            projectDownload: document.getElementById('js-projectDownload'),
            projectSelect: document.getElementById('js-selectProjects'),
            projectLoad: document.getElementById('js-projectLoad')
        },
        modal:{
            container: document.getElementById('js-modal'),
            overlay: document.getElementById('js-modal__overlay'),
            content: document.getElementById('js-modal__content'),
            title: document.getElementById('js-modal__title')
        }
    },
    helpers: {
        keyDown: function (e) {
            var _this = mcsandyUI;
            /*SAVE*/
            if (e.ctrlKey) {
                switch (e.keyCode) {
                case 83:
                    mcsandy.functions.saveContent(e);
                    _this.functions.flashClass(document.getElementById('js-projectSave'));
                    break;
                case 82:
                    mcsandy.functions.updateContent();
                    break;
                case 68:
                    _this.functions.handleDownloadProject(e);
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
                        default: 
                            break;
                    }
                }
            }
        },
        keyUp: function (e) {
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
            label.innerText = t;
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
            grandparent.appendChild(clone);
        },
        toggleLabelClick: function (e) {
            var label = e.target,
                input = document.getElementById(e.target.getAttribute('for'));
            if (!label.className.match('js-checked')) {
                label.className = label.className + ' ' + 'js-checked';
                input.className = input.className + ' ' + 'js-checked';
            } else {
                label.className = label.className.replace(/(?:^|\s)js-checked(?!\S)/g, "");
                input.className = input.className.replace(/(?:^|\s)js-checked(?!\S)/g, "");
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
                el.addEventListener(evt, func);
            });
        }
    },
    bindUiEvents: function () {
        var _this = mcsandyUI,
            helpers = _this.helpers,
            ctrls = _this.data.ctrls,
            editors = document.querySelectorAll('.fieldset__field'),
            editorFieldsets = document.querySelectorAll('.editor__fieldset'),
            fileUploads = document.querySelectorAll('.fieldset__field--upload'),
            addExternalFile = document.querySelectorAll('.fieldset__button--add'),
            removeExternalFile = document.querySelectorAll('.fieldset__button--rem');

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

        /*DRAG AND DROP FILES INTO EDITORS */
        helpers.addEvents(fileUploads, 'change', _this.helpers.handleFileUpload);

        helpers.addEvents(editorFieldsets, 'dragend', _this.functions.handleFileDragout)
        /*ADD EXTERNAL LINK*/
        helpers.addEvents(addExternalFile, 'click', _this.functions.handleAddExternalFile);
        helpers.addEvents(removeExternalFile, 'click', _this.functions.handleRemoveExternalFile);
        /*LABEL/INPUT SHENANIGANS*/
        _this.functions.bindJsCheck();
        _this.data.modal.overlay.addEventListener('click', _this.functions.toggleModal);
    },
    functions: {
        handleConnection: function () {
            var _this = mcsandyUI,
                ctrl = document.getElementById('js-onlineStatus');
            _this.data.onlineState = navigator.onLine ? "online" : "offline";
            if (_this.data.onlineState === "online") {
                ctrl.className = ctrl.className.replace(/(?:^|\s)offline(?!\S)/g, " online");
                document.title = "McSandy | Online";
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--offline(?!\S)/g, " mcsandy--online");
                mcsandy.functions.createLibSelect();
                _this.functions.handleHash();
            } else {
                ctrl.className = ctrl.className.replace(/(?:^|\s)online(?!\S)/g, " offline");
                document.title = "McSandy | Offline";
                document.querySelector('body').className = document.querySelector('body').className.replace(/(?:^|\s)mcsandy--online(?!\S)/g, " mcsandy--offline");
            }
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
                projData = store.get(0, project);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            _this.functions.updateEditors(projData.rawParts.html, projData.rawParts.css, projData.rawParts.js);
            _this.functions.updateCtrls(projData);
        },
        handleRemoveExternalFile: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                helpers = _this.helpers;
            helpers.removeParent(e.target);
        },
        handleAddExternalFile: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                helpers = _this.helpers,
                el = e.target;
            helpers.cloneParent(el);
            el.className = el.className.replace('fieldset__button--add', 'fieldset__button--rem');
            el.innerHTML = "&mdash;";
            _this.bindUiEvents();
        },
        handleDownloadProject: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                project = store.get(0, _this.data.ctrls.projectSelect.value); // don't get the value of the button, but the one from the select box. 
            _this.functions.flashClass(document.getElementById('js-projectDownload'));
            mcsandy.functions.downloadContent(project);
        },
        handleFileUpload: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files,
                file = files[0],
                reader = new FileReader();
            reader.onload = function (evt) {
                e.toElement.value = evt.target.result;
            }
            reader.readAsText(file);
        }, 
        handleDragOver: function (e){
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        },
        handleDragStart: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        handleFileDragout: function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log(e);
            var _this = mcsandyUI,
                source = e.target.querySelector('textarea').value,
                classes = e.target.classList,
                projectName = mcsandy.data.ctrls.projectName.value.length > 0 ? mcsandy.data.ctrls.projectName.value : 'McSandy',
                downloadObj = {
                    project: projectName,
                    blobArray: [source]
                };
                typeString= classes[2].replace('fieldset--','');
                type = typeString !== 'js' ? typeString : 'javascript';        

            mcsandy.functions.downloadContent(downloadObj, type);
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
            if(projData.rawParts.external){
                projData.rawParts.external.js.forEach(function (el) {
                    var exJsInput = document.querySelector('[data-mcsandy="' + el + '"]');
                        exJsInput.checked = true;
                });
            }
        },
        bindJsCheck: function () {
            var _this = mcsandyUI,
                labels = document.querySelectorAll('label');
            for (i=0; i<labels.length; i++) {
                var l = labels[i];
                l.addEventListener('click', _this.helpers.toggleLabelClick);
            }
        },
        addModalContent: function (title, content){
            var _this = mcsandyUI,
                modal = _this.data.modal;
            modal.title.innerText = title;
            modal.content.innerHTML = content;
        },
        toggleModal: function () {
            var _this = mcsandyUI,
                modal = _this.data.modal;
            _this.helpers.toggleClass(modal.container, 'visible');
            _this.helpers.toggleClass(modal.overlay, 'visible');
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
    appVersion: '2.1',
    data: {
        ctrls: {
            projectLoad: document.getElementById('js-projectLoad'),
            projectSave: document.getElementById('js-projectSave'),
            projectDel: document.getElementById('js-projectDel'),
            projectNew: document.getElementById('js-projectNew'),
            projectName: document.getElementById('js-projectName'),
            html: document.getElementById('js-html'),
            css: document.getElementById('js-css'),
            js: document.getElementById('js-js')
        },
        targets: {
            iframe: document.getElementById('js-result')
        },
        externalJS: {
            AngularJS: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js',
            Dojo: '//ajax.googleapis.com/ajax/libs/dojo/1.9.2/dojo/dojo.js',
            jQuery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
            jQueryMobile: '//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.0/jquery.mobile.min.js',
            jQueryUi: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
            mooTools: '//ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js',
            prototype: '//ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js',
            scriptaculous: '//ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js'
        }
    },
    blobData: {
        reset: 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
        externalJS: []
    },
    helpers: {
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
        createExternalLibs: function () {
            var _this = mcsandy,
                externalLibs = _this.blobData.externalJS,
                externalJSSet = '';
            if (navigator.onLine) {
                /*only add external libraries if we're online*/
                externalLibs.forEach(function (el) {
                    externalJSSet+= _this.helpers.prepareExternalJS(el);
                });
            }
            return externalJSSet;
        },
        prepareInternalJS: function (js) {
            return '<script type="text\/javascript">' + js + '<\/script>';
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
        wrapBlobParts: function () {
            var _this = mcsandy,
                helpers = _this.helpers,
                blobData = _this.blobData,
                ctrls = _this.data.ctrls,
                html = helpers.prepareHTML(ctrls.html.value),
                reset = helpers.prepareCSS(blobData.reset),
                externalLibraries = helpers.createExternalLibs(),
                css =  helpers.prepareCSS(ctrls.css.value),
                head = '<head>' + css + externalLibraries +'</head>',
                js = helpers.prepareInternalJS(ctrls.js.value),
                blobKit = [head,html,js];
            return blobKit;
        },
        createProjectObj: function (projectName, rawParts, blobArray) {
            return {
                'project': projectName,
                blobArray: blobArray,
                rawParts: rawParts
            }; 
        },
        buildBlob: function (parts, type) {
            var _this = mcsandy,
                helpers = _this.helpers;
                blobType = type !== undefined ? type + ';charset=utf-8' : 'text/html;charset=utf-8';
                var blob = new Blob(parts, {type : blobType});
                return blob;                   
        },
        getStoredProjects: function () {
            var _this = mcsandy,
                len = localStorage.length,
                projects = [];
            for (i = 0; i < len; i ++) {
                var projectKey = store.get(0,i);
                projects.push(projectKey);
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
            ctrls = _this.data.ctrls,
            keyUpCounter = 0;


        //BIND EVENTS TO TEXTAREAS
        ctrls.css.addEventListener('keyup',function (e) {
            keyUpCounter++;
            if (keyUpCounter == 5){
                functions.updateContent();
                keyUpCounter = 0;
            }
        });
        ctrls.html.addEventListener('keyup',function (e) {
            keyUpCounter++;
            if (keyUpCounter == 4){
                functions.updateContent();
                keyUpCounter = 0;
            }
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
            projects.forEach(function(el) {
                var option = _this.helpers.createSelectOption(el);
                if (mcsandyUI.helpers.unconvertHash(el) === mcsandyUI.helpers.unconvertHash(pageHash)){
                    select.selected = true;
                }
                select.appendChild(option);
            })
            if(window.location.hash){
                select.value = mcsandyUI.helpers.unconvertHash(window.location.hash);
            }
        },
        createLibSelect: function () {
            var _this = mcsandy,
                libs = _this.data.externalJS,
                libFieldset = document.querySelector('.fieldset--externalLibs'),
                libWrap = libFieldset.querySelector('.fieldset__wrapper');
            for (lib in libs) {
                var exJs = libs[lib],
                    input = mcsandyUI.helpers.createInput('checkbox', lib, 'fieldset__field fieldset__field--jsLib', lib, exJs);
                    label = mcsandyUI.helpers.createLabel(lib,'fieldset__label fieldset__label--jsLib', lib);
                input.addEventListener('change', _this.functions.handleLibToggle);
                libWrap.appendChild(input);
                libWrap.appendChild(label);
            }
            
            mcsandyUI.functions.bindJsCheck();
        },
        handleLibToggle: function (e) {
            var _this = mcsandy,
                value = e.target.value,
                exJs = e.target.getAttribute('data-mcsandy');
            if (!e.target.checked) {
                _this.blobData.externalJS.splice(_this.blobData.externalJS.indexOf(exJs, 1));
            } else {
                _this.blobData.externalJS.push(exJs);
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
            _this.data.ctrls.project.value = '';
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
                project = _this.helpers.createProjectObj(projectName, rawParts, blobArray)
            store.set(0, projectName, project);
            mcsandyUI.functions.setHash(projectName)
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