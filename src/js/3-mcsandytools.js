var mcsandyTools;
mcsandyTools = {
    init: function () {
        console.info("mcsandyTools is running");
        var _this = mcsandyTools;
        for (f in _this.modules) {
            _this[f] = _this.modules[f];
        }
        _this.functions.getAppVersion();
    },
    data: {
        scripts: {
            githubJS: 'http://raw.github.com/michael/github/master/github.js',
            selfPackage: 'http://raw.github.com/paceaux/McSandy--the-HTML5-offline-Sandbox/master/package.json',
            mcsandyApp: 'preAssets/js/mcsandyApp.js'
        }
    },
    helpers: {
        addScript: function (js, type) {
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');
            script.type = 'text/javascript';
            if (type === 'text') {
                script.innerText = js;
            }
            head.appendChild(script);
        },
        gitLoad: function (username, password) {
            var github = new Github({
                username: username,
                password: password,
                auth: 'basic'
            });
        }
    },
    functions: {
        loadScript: function (src, async, callback) {
            var _this = mcsandyTools,
                head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = async;
            script.onload = callback;
            head.appendChild(script);
        },
        addScript: function (src, async) {
            var _this = mcsandyTools,
                head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerText = src;
            script.async = async;
            head.appendChild(script);
        },
        getAppVersion: function () {
            var _this = mcsandyTools,
                success, error,
                xmlHttp = new XMLHttpRequest(success, error);
            xmlHttp.open('get', _this.data.scripts.mcsandyApp, true);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        console.log(xmlHttp);
                        success = xmlHttp.responseText;
                        _this.functions.addScript(success, true);
                    }
                }
            };
        }
    }
};
