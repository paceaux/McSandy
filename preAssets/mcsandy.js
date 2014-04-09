/* MCSANDY: THE OFFLINE HTML5 SANDBOX */
var store, mcsandy, mcsandyUI;
// Source: preAssets/js/store.js
store = {
    types: [localStorage,sessionStorage],
    convertValue: function (v) {
        return typeof v !== "object" ? v : JSON.stringify(v);
    },
    unconvertValue: function (v) {
        if ( v.indexOf("{") === 0 || v.indexOf("[") === 0 ){
            var v = JSON.parse(v);
        }
        return v;
    },
    set: function (type, k, v) {
        var v = this.convertValue(v);
        store.types[type].setItem(k,v); 
    },
    get: function (type, k) {
        var v = typeof k !== "number" ? store.types[type].getItem(k) : store.types[type].key(k);
        return  this.unconvertValue(v);
    },
    del: function (type, k){
        store.types[type].removeItem(k);       
    },
    clr: function (type){
        store.types[type].clear();
    }
};
// Source: preAssets/js/filesaver.js
/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs
  || (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  || (function(view) {
    "use strict";
    if (/MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
          doc = view.document
        , get_URL = function() {
            return view.URL || view.webkitURL || view;
        }
        , URL = view.URL || view.webkitURL || view
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = !view.externalHost && "download" in save_link
        , click = function(node) {
            var event = doc.createEvent("MouseEvents");
            event.initMouseEvent(
                "click", true, false, view, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
            );
            node.dispatchEvent(event);
        }
        , webkit_req_fs = view.webkitRequestFileSystem
        , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
        , throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        , fs_min_size = 0
        , deletion_queue = []
        , process_deletion_queue = function() {
            var i = deletion_queue.length;
            while (i--) {
                var file = deletion_queue[i];
                if (typeof file === "string") { // file is an object URL
                    URL.revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            }
            deletion_queue.length = 0; // clear queue
        }
        , dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , FileSaver = function(blob, name) {
            var
                  filesaver = this
                , type = blob.type
                , blob_changed = false
                , object_url
                , target_view
                , get_object_url = function() {
                    var object_url = get_URL().createObjectURL(blob);
                    deletion_queue.push(object_url);
                    return object_url;
                }
                , dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                , fs_error = function() {
                    if (blob_changed || !object_url) {
                        object_url = get_object_url(blob);
                    }
                    if (target_view) {
                        target_view.location.href = object_url;
                    } else {
                        window.open(object_url, "_blank");
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                }
                , abortable = function(func) {
                    return function() {
                        if (filesaver.readyState !== filesaver.DONE) {
                            return func.apply(this, arguments);
                        }
                    };
                }
                , create_if_not_found = {create: true, exclusive: false}
                , slice
            ;
            filesaver.readyState = filesaver.INIT;
            if (!name) {
                name = "download";
            }
            if (can_use_save_link) {
                object_url = get_object_url(blob);
                doc = view.document;
                save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
                save_link.href = object_url;
                save_link.download = name;
                var event = doc.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click", true, false, view, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                );
                save_link.dispatchEvent(event);
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
                return;
            }
            if (view.chrome && type && type !== force_saveable_type) {
                slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
                blob_changed = true;
            }

            if (webkit_req_fs && name !== "download") {
                name += ".download";
            }
            if (type === force_saveable_type || webkit_req_fs) {
                target_view = view;
            }
            if (!req_fs) {
                fs_error();
                return;
            }
            fs_min_size += blob.size;
            req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
                fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                    var save = function() {
                        dir.getFile(name, create_if_not_found, abortable(function(file) {
                            file.createWriter(abortable(function(writer) {
                                writer.onwriteend = function(event) {
                                    target_view.location.href = file.toURL();
                                    deletion_queue.push(file);
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch(filesaver, "writeend", event);
                                };
                                writer.onerror = function() {
                                    var error = writer.error;
                                    if (error.code !== error.ABORT_ERR) {
                                        fs_error();
                                    }
                                };
                                "writestart progress write abort".split(" ").forEach(function(event) {
                                    writer["on" + event] = filesaver["on" + event];
                                });
                                writer.write(blob);
                                filesaver.abort = function() {
                                    writer.abort();
                                    filesaver.readyState = filesaver.DONE;
                                };
                                filesaver.readyState = filesaver.WRITING;
                            }), fs_error);
                        }), fs_error);
                    };
                    dir.getFile(name, {create: false}, abortable(function(file) {
                        file.remove();
                        save();
                    }), abortable(function(ex) {
                        if (ex.code === ex.NOT_FOUND_ERR) {
                            save();
                        } else {
                            fs_error();
                        }
                    }));
                }), fs_error);
            }), fs_error);
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function(blob, name) {
            return new FileSaver(blob, name);
        }
    ;
    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;
    FS_proto.error =
    FS_proto.onwritestart =
    FS_proto.onprogress =
    FS_proto.onwrite =
    FS_proto.onabort =
    FS_proto.onerror =
    FS_proto.onwriteend =
        null;

    view.addEventListener("unload", process_deletion_queue, false);
    return saveAs;
}(
       typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this.content
));
if (typeof module !== "undefined") module.exports = saveAs;
// Source: preAssets/js/mcsandy.js
/*MCSANDY APPDATA */
mcsandyAppData = {
    version: '0.2.1',
    ui : {
        onlineState: 'online',
        onlineCtrl: document.getElementById('js-onlineStatus'),
        ctrls: {
            projectDownload: document.getElementById('js-projectDownload'),
            projectSelect: document.getElementById('js-selectProjects'),
            projectLoad: document.getElementById('js-projectLoad')
        },
        fields: {
            fieldsets: document.querySelectorAll('.fieldsetGroup__fieldset'),
            upload: document.querySelectorAll('.fieldset__field--upload'),
            add: '.fieldset__button--add',
            rem: '.fieldset__button--rem',
            assets: '.fieldset__field--url'
        },
        modal:{
            container: document.getElementById('js-modal'),
            overlay: document.getElementById('js-modal__overlay'),
            content: document.getElementById('js-modal__content'),
            title: document.getElementById('js-modal__title')
        }
    }, 
    core: {
        ctrls: {
            projectLoad: document.getElementById('js-projectLoad'),
            projectSave: document.getElementById('js-projectSave'),
            projectDel: document.getElementById('js-projectDel'),
            projectNew: document.getElementById('js-projectNew'),
            projectName: document.getElementById('js-projectName'),
            html: document.getElementById('js-html'),
            css: document.getElementById('js-css'),
            js: document.getElementById('js-js'),
            jsLibs: '.fieldset__field--jsLib',
            cssExtras: '.fieldset--css .fieldset__field--url',
            jsExtras: '.fieldset--js .fieldset__field--url'
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
    modalContent: {
        shortcuts: '<dl><dt><kbd>ctrl</kbd>+<kbd>s</kbd></dt><dd>save</dd><dt><kbd>ctrl</kbd>+<kbd>r</kbd></dt><dd>run</dd><dt><kbd>ctrl</kbd>+<kbd>f</kbd></dt><dd>download</dd><dt><kbd>ctrl</kbd>+<kbd>l</kbd></dt><dd>load</dd></dl><dl><dt><kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>e</kbd></dt><dd>Toggle Editor Panel</dd><dt><kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>p</kbd></dt><dd>Toggle Project Panel</dd><dt><kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>del</kbd></dt><dd>Delete Project</dd><dt><kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>+</kbd></dt><dd>New Project</dd></dl>'
    }
};
mcsandyProject = {
    blobArray : [],
    externals : {
        assets: {
            css: [],
            js: []
        },
        libraries: {
            css: [],
            js: []
        }
    }
};

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
        fields: {
            fieldsets: document.querySelectorAll('.fieldsetGroup__fieldset'),
            upload: document.querySelectorAll('.fieldset__field--upload'),
            add: '.fieldset__button--add',
            rem: '.fieldset__button--rem',
            assets: '.fieldset__field--url'
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
                    _this.functions.flashClass(mcsandy.data.ctrls.projectSave);
                    break;
                case 82:
                    mcsandy.functions.updateContent(e);
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
            clone.querySelector('input').value = '';
            grandparent.appendChild(clone);
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
                el.addEventListener(evt, func);
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
            [].forEach.call(inputs, function(input) {
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
        createExternalFileButton: function (buttonClass, buttonText) {
            var button = document.createElement('button');
            button.className = 'fieldset__button ' + buttonClass;
            button.innerHTML = "&mdash;";
            return button;
        },
        // createInput: function (inputType, inputClass) {
        //     var input = document.createElement('input');
        //     input.className = 'fieldset__field ' + inputClass;
        //     input.type = inputType;
        //     return input;
        // },
        createExternalFileSet: function (file, inputType, inputClass, buttonClass, buttonText) {
            var _this = mcsandyUI,
                wrapper = _this.helpers.createExternalFileWrapper(),
                input = _this.helpers.createInput(inputType,'js-'+ Math.ceil(Math.random() * 10), inputClass, file, file),
                button = _this.helpers.createExternalFileButton(buttonClass, buttonText);
            wrapper.appendChild(input);
            wrapper.appendChild(button);
            return wrapper;
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
        helpers.addEvents(document.querySelectorAll('button'), 'click', _this.functions.flashClass)

        /*DRAG AND DROP FILES INTO EDITORS */
        helpers.addEvents(fileUploads, 'change', _this.helpers.handleFileUpload);

        helpers.addEvents(editorFieldsets, 'dragend', _this.functions.handleFileDragout);
        helpers.addEvents(editorFieldsets, 'drop', _this.functions.handleFileDrop);
        /*ADD EXTERNAL LINK*/
        helpers.addEvents(addExternalFile, 'click', _this.functions.handleAddExternalFile);
        helpers.addEvents(removeExternalFile, 'click', _this.functions.handleRemoveExternalFile);
        /*LABEL/INPUT SHENANIGANS*/
        _this.functions.bindFieldsetCollapse();
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
            mcsandyProject.externals

        },
        handleFileDrop: function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(e);
            var _this = mcsandyUI,
                files = e.dataTransfer.files;
            for (var i = 0, f; f = files[i]; i++) {
                console.log(f);
                var input = _this.helpers.createExternalFileSet(f);
                e.target.appendChild(input);
            }

        },
        handleAddExternalFile: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                helpers = _this.helpers,
                el = e.target;
            e.target.removeEventListener('click',_this.functions.handleAddExternalFile);
            helpers.cloneParent(el);
            el.className = el.className.replace('fieldset__button--add', 'fieldset__button--rem');
            el.innerHTML = "&mdash;";
            _this.bindUiEvents();
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
            console.log('drag start');
            e.stopPropagation();
            e.preventDefault();
            // e.dataTransfer.dropEffect = 'none';
            // e.dataTransfer.effectAllowed = 'all'; 
            // e.dataTransfer.setData(e.target.dataset.mimeoutput,e.target.querySelector('textarea').value);
            //             console.log(e);

            // e.dataTransfer.effectAllowed = 'copy';
            // var source = e.target.querySelector('textarea').value,
            // type = e.target.dataset.type !== "js" ? 'text/' + e.target.dataset.type : 'application/javascript';
            // e.dataTransfer.setData(type, source);
            // console.log(e);
        },
        handleFileDragout: function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
            e.dataTransfer.effectAllowed = 'all';
            var _this = mcsandyUI,
                source = e.target.querySelector('textarea').value,
                projectName = mcsandy.data.ctrls.projectName.value.length > 0 ? mcsandy.data.ctrls.projectName.value : 'McSandy',
                downloadObj = {
                    project: projectName,
                    blobArray: [source]
                },
                type = e.target.dataset.fileext;       
            var data = e.dataTransfer.getData(e.target.dataset.mimeoutput);
            mcsandy.functions.downloadContent(downloadObj, type);
        },
        updateEditors: function (html, css, js) {
            var _this = mcsandyUI, 
                ctrls = mcsandy.data.ctrls;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        populateExternalAssetFields: function (typeOfFieldset, val) {
            var _this = mcsandyUI,
                fieldset = document.querySelector('.fieldset--' + typeOfFieldset),
            inputSet = _this.helpers.createExternalFileSet(val, 'url', 'fieldset__field--url', 'fieldset__button--add', '+');
            inputSet.querySelector('input').value = val;
            inputSet.querySelector('input').setAttribute('data-externaltype', typeOfFieldset)
            fieldset.appendChild(inputSet);
            _this.bindUiEvents();
        },
        updateCtrls: function (projData) {
            var _this = mcsandyUI,
                projectField = mcsandy.data.ctrls.projectName,
                ctrls = _this.data.ctrls
            projectField.value = projData.project;
            projectField.placeholder = projData.project;
            ctrls.projectDownload.value = projData.project;
            if(projData.externals.libraries){
                projData.externals.libraries.js.forEach(function (el) {
                    var exJsInput = document.querySelector('.fieldset--externalLibs').querySelector('[data-mcsandy="' + el + '"]');
                        exJsInput.checked = true;
                });
            };
            if (projData.externals) {
               _this.functions.updateExternalAssetFields(projData, 'css');
               _this.functions.updateExternalAssetFields(projData, 'js');
                _this.bindUiEvents();
            }
        },
        updateExternalAssetFields: function (projData, type) {
            var _this = mcsandyUI,
                currentAssets = document.getElementById('js-fieldset--' + type).querySelectorAll('.fieldset__inputWrapper'),
                xAssets = projData.externals.assets;
            xAssets[type].forEach(function (val, i) {
                var input = currentAssets[i].querySelector('input'),
                    button = currentAssets[i].querySelector('button');
                _this.helpers.cloneParent(input);
                input.value = val;
                button.innerHTML = '&mdash;'
            });
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
            js: document.getElementById('js-js'),
            jsLibs: '.fieldset__field--jsLib',
            cssExtras: '.fieldset--css .fieldset__field--url',
            jsExtras: '.fieldset--js .fieldset__field--url'
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
        prepareExternalCSS: function (css) {
            return '<link rel="stylesheet" href="' + css + '"/>';
        },
        createExternalLibs: function (libList) {
            var _this = mcsandy,
                externalJSSet = '';
            if (navigator.onLine) {
                /*only add external libraries if we're online*/
                libList.forEach(function (el) {
                    externalJSSet+= _this.helpers.prepareExternalJS(el);
                });
            }
            return externalJSSet;
        },
        createExternalCSS: function () {
            var _this = mcsandy,
                externalCSSSet = '';
            if (navigator.onLine) {
                /*only add external libraries if we're online*/
                libList.forEach(function (el) {
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
                helpers = _this.helpers,
                reset = helpers.prepareCSS(_this.blobData.reset),
                ctrls = _this.data.ctrls,
                css = helpers.prepareCSS(ctrls.css.value),
                externalLibraries = helpers.createExternalLibs(mcsandyProject.externals.libraries.js);
            return '<head>' + reset + css + externalLibraries +'</head>';
        },
        constructFoot: function () {
            var _this = mcsandy, 
                userJs = _this.helpers.prepareInternalJS(_this.data.ctrls.js.value),
                extraJs = _this.helpers.createExternalLibs(mcsandyProject.externals.assets.js);
            return extraJs + '\n' + userJs;
        },
        wrapBlobParts: function () {
            var _this = mcsandy,
                blobData = _this.blobData,
                ctrls = _this.data.ctrls,
                html = _this.helpers.prepareHTML(ctrls.html.value),
                head = _this.helpers.constructHead(),
                footer = _this.helpers.constructFoot(),
                blobKit = [head,html,footer];
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

        //BIND EVENTS TO BUTTONSl
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
            store.set(0, projectName, project);
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
mcsandyUI.init();
mcsandy.init();
