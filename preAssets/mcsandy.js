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

/*STORE: Local and Session Storage tool wrapper*/

var store, mcsandyUI,mcsandy;
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
/*MCSANDYUI: the main user interactions with the app*/
mcsandyUI = {
    init: function () {
        console.info("McSandyUI is Running")
        var _this = mcsandyUI;
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
        keyMaps:{
            save: {
                83:false,
                17:false
            },
            run: {
                83:false,
                16:false
            }
        }
    },
    helpers: {
        keyDown: function(e) {
            var _this = mcsandyUI,
                keyMaps = _this.data.keyMaps, 
                saveMap = keyMaps.save,
                runMap = keyMaps.run

            /*SAVE*/
            if (e.keyCode in saveMap){
                saveMap[e.keyCode] = true;
                if(saveMap[83] && saveMap[17]) {
                    mcsandy.functions.saveContent(e);
                }
            }
            if (e.keyCode in runMap){
                runMap[e.keyCode] = true;
                if(runMap[83] && runMap[16]) {
                    mcsandy.functions.saveContent(e);
                }
            }
        },
        keyUp: function (e) {
            var _this = mcsandyUI,
                keyMaps = _this.data.keyMaps,
                saveMap = keyMaps.save;
            if (e.keyCode in keyMaps.save) {
                keyMaps.save[e.keyCode] = false;
            }
            if (e.keyCode in keyMaps.run){
                keyMaps.run[e.keyCode] = false;
            }
        },
        convertHash: function (hash) {
            return hash.replace(' ', '_');
        },
        unconvertHash: function (hash) {
            hash = hash.replace('#','');
            hash = hash.replace('_',' ');
            return hash;
        }
    },
    bindUiEvents: function () {
        var _this = mcsandyUI,
            helpers = _this.helpers,
            ctrls = _this.data.ctrls;

        /*CHECK FOR INTERNET CONNECTION*/
        window.addEventListener('load', function (e) {
            _this.functions.handleConnection();
            if(window.location.hash) {
                _this.functions.handleHash();
            }
        });
        window.addEventListener("offline", _this.functions.handleConnection );
        window.addEventListener("online", _this.functions.handleConnection );

        /*WINDOW HASH CHANGE */
        window.addEventListener("hashchange", _this.functions.handleHash)
        
        /*SELECT A PROJECT*/
        ctrls.projectLoad.addEventListener('click', _this.functions.handleProjectLoad);

        /* DOWNLOAD A PROJECT */
        ctrls.projectDownload.addEventListener('click', _this.functions.handleDownloadProject);

        /*KEYBOARD SHORTCUTS*/
        document.addEventListener('keydown', helpers.keyDown)
        document.addEventListener('keyup', helpers.keyUp)
    },
    functions: {
        handleConnection: function (e) {
            var _this = mcsandyUI,
                ctrl = document.getElementById('js-onlineStatus');
            _this.data.onlineState = navigator.onLine ? "online" : "offline";
            if (_this.data.onlineState == "online"){
                ctrl.className = ctrl.className.replace( /(?:^|\s)offline(?!\S)/g, " online");
                document.title = "McSandy | Online";
            } else {
                ctrl.className = ctrl.className.replace( /(?:^|\s)online(?!\S)/g," offline");
                document.title = "McSandy | Offline"
            }
        },
        handleHash: function (e) {
            var _this = mcsandyUI,
                hash = _this.helpers.unconvertHash(window.location.hash);
            _this.functions.loadProject(hash);

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

        },
        loadProject: function (project) {
            var _this = mcsandyUI,
                projData = store.get(0,project);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            _this.functions.updateEditors(projData.rawParts.html, projData.rawParts.css, projData.rawParts.js);
            _this.functions.updateCtrls(projData.project);

        },
        handleDownloadProject: function (e) {
            e.preventDefault();
            var _this = mcsandyUI,
                project = store.get(0,_this.data.ctrls.projectSelect.value); // don't get the value of the button, but the one from the select box. 
            mcsandy.functions.downloadContent(project);
        },
        updateEditors: function (html, css, js) {
            var _this = mcsandyUI, 
                ctrls = mcsandy.data.ctrls;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        updateCtrls: function (projectName) {
            var _this = mcsandyUI,
                projectField = mcsandy.data.ctrls.projectName,
                ctrls = _this.data.ctrls;
            projectField.value = projectName;
            projectField.placeholder = projectName;
            ctrls.projectDownload.value = projectName;

        }
    }
};

/*MCSANDY: The preview, storage, and retrieval*/
mcsandy = {
    init: function () {
        console.info("McSandy is Running")
        var _this = mcsandy;
        _this.bindUiEvents();
        _this.functions.getProjects();
    },
    data: {
        ctrls: {
            projectLoad: document.getElementById('js-projectLoad'),
            projectSave: document.getElementById('js-projectSave'),
            projectDel: document.getElementById('js-projectDel'),
            projectName: document.getElementById('js-projectName'),
            html: document.getElementById('js-html'),
            css: document.getElementById('js-css'),
            js: document.getElementById('js-js')
        },
        targets: {
            iframe: document.getElementById('js-result')
        }
    },
    blobData: {
        reset: 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'
    },
    helpers: {
        prepareCSS: function (css) {
            return '<style type="text/css">' + css + '</style>';
        },
        prepareHTML: function (html) {
            return html;
        },
        prepareExternalJS: function(js) {
            js = js.replace('https://', '//');
            js = js.replace('http://', '//');
            return '<script type="text\/javascript" src="' + js + '"><\/script>';
        },
        prepareJS: function (js) {
            return '<script type="text\/javascript">' + js + '<\/script>';
        },
        createRawParts:function (html, css, js) {
            var rawParts = {
                html: html,
                css: css,
                js: js
            }
            return rawParts;
        },
        wrapBlobParts: function (html, css, js) {
            var _this = mcsandy,
                helpers = _this.helpers,
                blobData = _this.blobData,
                ctrls = _this.data.ctrls,
                html = helpers.prepareHTML(ctrls.html.value),
                reset = helpers.prepareCSS(blobData.reset),
                jquery = helpers.prepareExternalJS(_this.blobData.jquery),
                css =  helpers.prepareCSS(ctrls.css.value),
                head = '<head>'+css+ jquery +'</head>',
                js = helpers.prepareJS(ctrls.js.value),
                blobKit = [head,html,js];
            return blobKit;
        },
        createProject: function (projectName, rawParts, blobArray) {
            return {
                'project': projectName,
                blobArray: blobArray,
                rawParts: rawParts
            }; 
        },
        buildBlob: function (parts, type) {
            var _this = mcsandy,
                helpers = _this.helpers;
                blobType = type !== undefined ? 'text/' + type + ';charset=utf-8' : 'text/html;charset=utf-8';
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
            }        });
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
    },
    functions: {
        getProjects: function () {
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
        updateContent: function (loadedParts) {
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
            _this.functions.getProjects();
            _this.data.ctrls.project.value = '';
        },
        saveContent: function (e) {
            e.preventDefault();
            var _this = mcsandy,
                ctrls = _this.data.ctrls,
                rawParts = _this.helpers.createRawParts(ctrls.html.value, ctrls.css.value, ctrls.js.value),
                blobArray = _this.helpers.wrapBlobParts(),
                projectName = _this.data.ctrls.projectName.value,
                project = _this.helpers.createProject(projectName, rawParts, blobArray)
            store.set(0, projectName, project);
            mcsandyUI.functions.setHash(projectName)
            _this.functions.getProjects();
        },
        downloadContent: function (downloadObj, type) {
            //downloadObj should be an object. 
            //It should have in it an array called blobArray. 
            //there must be a minimum of one item in the array, which contains the stuff we want to download
            //type is presumed to be either html, css, or js
            var _this = mcsandy,
                downloadType = type !== undefined ? type : 'html', // if there's no type, then it must be a dl for the entire project
                parts =  downloadObj !== undefined ? downloadObj.blobArray : _this.helpers.wrapBlobParts(),
                blob = _this.helpers.buildBlob(parts,downloadType),
                fileName = downloadObj.project + '.' + downloadType;
            saveAs(blob, fileName);

        }
    }
};

mcsandyUI.init();
mcsandy.init();