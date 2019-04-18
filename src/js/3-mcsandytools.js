let mcsandyTools;
mcsandyTools = {
    init() {
        console.info('mcsandyTools is running');
        const _this = mcsandyTools;
        for (f in _this.modules) {
            _this[f] = _this.modules[f];
        }
        _this.functions.getAppVersion();
    },
    data: {
        scripts: {
            githubJS: 'http://raw.github.com/michael/github/master/github.js',
            selfPackage: 'http://raw.github.com/paceaux/McSandy--the-HTML5-offline-Sandbox/master/package.json',
            mcsandyApp: 'preAssets/js/mcsandyApp.js',
        },
    },
    helpers: {
        addScript(js, type) {
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            if (type === 'text') {
                script.innerText = js;
            }
            head.appendChild(script);
        },
        gitLoad(username, password) {
            const github = new Github({
                username,
                password,
                auth: 'basic',
            });
        },
    },
    functions: {
        loadScript(src, async, callback) {
            const _this = mcsandyTools;
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = async;
            script.onload = callback;
            head.appendChild(script);
        },
        addScript(src, async) {
            const _this = mcsandyTools;
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerText = src;
            script.async = async;
            head.appendChild(script);
        },
        getAppVersion() {
            const _this = mcsandyTools;
            let success; let error;
            const xmlHttp = new XMLHttpRequest(success, error);
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
        },
    },
};
