// eslint-disable-next-line no-unused-vars
const mcsandyTools = {
    init() {
        // eslint-disable-next-line no-console
        console.info('mcsandyTools is running');
        Object.keys(this.functions).forEach((funcName) => {
            this.functions[funcName] = this.functions[funcName].bind(this);
        });
        this.functions.getAppVersion();
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
    },
    functions: {
        loadScript(src, async, callback) {
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = async;
            script.onload = callback;
            head.appendChild(script);
        },
        addScript(src, async) {
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerText = src;
            script.async = async;
            head.appendChild(script);
        },
        getAppVersion() {
            let success; let error;
            // eslint-disable-next-line no-undef
            const xmlHttp = new XMLHttpRequest(success, error);
            xmlHttp.open('get', this.data.scripts.mcsandyApp, true);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = function readyStateChange() {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        success = xmlHttp.responseText;
                        this.functions.addScript(success, true);
                    }
                }
            };
        },
    },
};
