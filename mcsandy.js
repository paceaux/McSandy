

/*store is the local/session storage helper. */
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
/*McSandy UI is the editor and its editor. It's the content that goes in*/
mcsandyUI = {
    init: function () {
        var _this = mcsandyUI;
        _this.bindUiEvents();
    },
    data: {
        onlineState: 'online',
        onlineCtrl: document.getElementById('js-onlineStatus'),
        els: {
            projecSelect: document.getElementById('js-selectProjects')
        },
        keyMaps:{
            save: {
                83:false,
                17:false
            }
        }
    },
    helpers: {
        keyDown: function(e) {
            var _this = mcsandyUI,
                keyMaps = _this.data.keyMaps, 
                saveMap = keyMaps.save;

            /*SAVE*/
            if (e.keyCode in saveMap){
                saveMap[e.keyCode] = true;
                if(saveMap[17] && saveMap[83]) {
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
            els = _this.data.els;

        /*CHECK FOR INTERNET CONNECTION*/
        window.addEventListener('load', function (e) {
            _this.functions.handleConnection();
            _this.functions.handleHash();
        });
        window.addEventListener("offline", _this.functions.handleConnection );
        window.addEventListener("online", _this.functions.handleConnection );

        /*WINDOW HASH CHANGE */
        window.addEventListener("hashchange", _this.functions.handleHash)
        /*SELECT A PROJECT*/
        els.projecSelect.addEventListener('change', _this.functions.handleProjectSelect);

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
            } else {
                ctrl.className = ctrl.className.replace( /(?:^|\s)online(?!\S)/g," offline");
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
        handleProjectSelect: function (e) {
            var _this = mcsandyUI,
                project = e.target.value;
            _this.functions.setHash(project);
            _this.functions.loadProject(project);

        },
        loadProject: function (project) {
            var _this = mcsandyUI,
                projData = store.get(0,project);
            mcsandy.functions.updateContent(projData); // this is in the McSandy interface
            _this.functions.updateEditors(projData.rawParts.html, projData.rawParts.css, projData.rawParts.js);
            _this.functions.updateProjectName(projData.project);

        },
        updateEditors: function (html, css, js) {
            var _this = mcsandyUI, 
                ctrls = mcsandy.data.ctrls;
            ctrls.html.value = html;
            ctrls.css.value = css;
            ctrls.js.value = js;
        },
        updateProjectName: function (projectName) {
            var _this = mcsandyUI,
                projectField = mcsandy.data.ctrls.project;
            projectField.value = projectName;
            projectField.placeholder = projectName;
        }
    }
};
mcsandyUI.init();

/*mcsandy stores the data and retrieves the data. it also prepares the iframe*/
mcsandy = {
    init: function () {
        var _this = mcsandy;
        _this.bindUiEvents();
        _this.functions.getProjects();
    },
    data: {
        ctrls: {
            projectSave: document.getElementById('js-projectSave'),
            projectDel: document.getElementById('js-projectDel'),
            project: document.getElementById('js-projectName'),
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
        updateContent: function (val, target) {
            target.innerHTML = val;
            return;
        },
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
        wrapProjectParts: function (html, css, js) {
            var _this = mcsandy,
                helpers = _this.helpers,
                blobData = _this.blobData,
                ctrls = _this.data.ctrls,
                html = helpers.prepareHTML(ctrls.html.value),
                reset = helpers.prepareCSS(blobData.reset),
                jquery = helpers.prepareExternalJS(_this.blobData.jquery),
                css =  helpers.prepareCSS(ctrls.css.value),
                head = '<head>'+css+'</head>',
                js = helpers.prepareJS(ctrls.js.value),
                blobKit = [head,html,jquery,js];
            return blobKit;
        },
        createProject: function (projectName, rawParts, blobArray) {
            return {
                'project': projectName,
                blobArray: blobArray,
                rawParts: rawParts
            }; 
        },
        prepareResult: function (parts) {
            var _this = mcsandy,
                helpers = _this.helpers;
            if (window.URL) {
                var blob = new Blob(parts, {type : 'text/html'});
                return blob;                   
            }
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
            ctrls = _this.data.ctrls;
        ctrls.css.addEventListener('keyup',function (e) {
            functions.updateContent();
        });

        ctrls.html.addEventListener('keyup',function (e) {
            functions.updateContent();
        });
        ctrls.js.addEventListener('change',function (e) {
            functions.updateContent();
        });
        ctrls.projectSave.addEventListener('click', functions.saveContent);
        ctrls.projectDel.addEventListener('click', functions.delContent);
    },
    functions: {
        getProjects: function () {
            var _this = mcsandy,
                projects = _this.helpers.getStoredProjects(),
                select = document.getElementById('js-selectProjects');
            projects.forEach(function(el) {
                var option = _this.helpers.createSelectOption(el);
                select.appendChild(option);
            })
        },
        updateContent: function (loadedParts) {
             var _this = mcsandy,
                iframe = _this.data.targets.iframe,
                parts =  loadedParts !== undefined ? loadedParts.blobArray : _this.helpers.wrapProjectParts();
               var result = _this.helpers.prepareResult(parts);
            iframe.src = window.URL.createObjectURL(result);
        },
        delContent: function (e) {
            e.preventDefault();
            var _this = mcsandy,
                projectName = _this.data.ctrls.project.value;
            store.del(0,projectName);
            _this.functions.getProjects();
        },
        saveContent: function (e) {
            e.preventDefault();
            var _this = mcsandy,
                ctrls = _this.data.ctrls,
                rawParts = _this.helpers.createRawParts(ctrls.html.value, ctrls.css.value, ctrls.js.value),
                blobArray = _this.helpers.wrapProjectParts(),
                projectName = _this.data.ctrls.project.value,
                project = _this.helpers.createProject(projectName, rawParts, blobArray)
            store.set(0, projectName, project);
            _this.functions.getProjects();
        }
    }
};
mcsandy.init();
