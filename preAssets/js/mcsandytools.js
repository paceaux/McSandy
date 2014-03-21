mcsandyTools = {
    init: function () {
        console.info("mcsandyTools is running");
        var _this = mcsandyTools;
        for (f in _this.modules) {
            _this[f] = _this.modules[f];
        }
        _this.functions.getAppVersion();
    },
    data :{
        scripts: {
            githubJS: 'https://raw.github.com/michael/github/master/github.js',
            selfPackage: 'https://raw.github.com/paceaux/McSandy--the-HTML5-offline-Sandbox/master/package.json'
        }
    },
    helpers: {
        scriptLoad: function (e) {
            console.log(e);
            console.log(this);
            console.log('I loaded');
        },
        gitLoad: function (username, password) {
            console.log('git loaded');
            var github = new Github({
                username: username,
                password: password,
                auth: 'basic'
            });
            var repo = github.getRepo('paceaux', 'McSandy--the-HTML5-offline-Sandbox')
            console.log(repo);
        }
    },
    bindUievents: function () {},
    functions: {
        loadScript: function (src, async, callback) {
            var _this = mcsandyTools,
            head= document.getElementsByTagName('head')[0],
            script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= src;
            script.async = async;
            script.onload = callback;
            head.appendChild(script);
        },
        getAppVersion: function () {
            var _this = mcsandyTools;
            console.info(mcsandy.functions.appVersion);
        }

    }, 
    modules: {
        github: function (username, password, callback) { 
            var _this = mcsandyTools;
            _this.functions.loadScript(_this.data.scripts.githubJS,false, _this.helpers.gitLoad);

        }
    }
};
