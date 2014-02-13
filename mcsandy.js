var mcsandyUI;
mcsandyUI = {
    init: function () {
        var _this = mcsandyUI;
        _this.bindUiEvents();
    },
    data: {
        onlineState: 'online',
        onlineCtrl: document.getElementById('js-onlineStatus')
    },
    helpers: {
    },
    bindUiEvents: function () {
        var _this = mcsandyUI;
        window.addEventListener('load', function (e) {
            _this.functions.handleConnection();
        });
        window.addEventListener("offline", _this.functions.handleConnection )
        window.addEventListener("online", _this.functions.handleConnection )
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
        }
    }
}
mcsandyUI.init();
var store;
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


    var mcsandy;
    mcsandy = {
        init: function () {
            var _this = mcsandy;
            _this.bindUiEvents();
            _this.functions.getProjects();
        },
        data: {
            ctrls: {
                projectSave: document.getElementById('js-projectSave'),
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
            jquery: '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"><\/script>'
        },
        helpers: {
            updateContent: function (val, target) {
                target.innerHTML = val;
                return
            },
            prepareCSS: function (css) {
                return '<style type="text/css">' + css + '</style>'
            },
            prepareHTML: function (html) {
                return html
            },
            prepareJS: function (js) {
                return '<script type="text\/javascript">' + js + '<\/script>'
            },
            prepareBlobParts: function () {
                var _this = mcsandy,
                    helpers = _this.helpers,
                    blobData = _this.blobData,
                    ctrls = _this.data.ctrls,
                    html = helpers.prepareHTML(ctrls.html.value),
                    reset = helpers.prepareCSS(blobData.reset),
                    jquery = blobData.jquery,
                    css = helpers.prepareCSS(ctrls.css.value),
                    head = '<head>'+css+'</head>',
                    js = helpers.prepareJS(ctrls.js.value),
                    blobKit = [head,html,js,jquery];
                return blobKit;
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
            ctrls.css.addEventListener('change',functions.updateContent);
            ctrls.html.addEventListener('change',functions.updateContent);
            ctrls.js.addEventListener('change',functions.updateContent);
            ctrls.projectSave.addEventListener('click', functions.saveContent)
        },
        functions: {
            getProjects: function () {
                var _this = mcsandy,
                    projects = _this.helpers.getStoredProjects(),
                    select = document.getElementById('js-selectProjects');
                console.log(projects);
                projects.forEach(function(el) {
                    var option = _this.helpers.createSelectOption(el);
                    select.appendChild(option);
                })
            },

            updateContent: function (e) {
                var _this = mcsandy,
                    iframe = _this.data.targets.iframe,
                    parts = _this.helpers.prepareBlobParts(),
                    result = _this.helpers.prepareResult(parts);
                iframe.src = window.URL.createObjectURL(result);
            },
            saveContent: function (e) {
                e.preventDefault();
                var _this = mcsandy,
                    parts = _this.helpers.prepareBlobParts(),
                    projectName = _this.data.ctrls.project.value,
                    project = {
                        'project': projectName,
                        parts: parts
                    };
                store.set(0, projectName, project);
            }
        }
    }
    mcsandy.init();
