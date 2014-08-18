/*MCSANDY APPDATA */
mcsandyAppData = {
    self: {
        version: '0.2.1',
        repo: 'https://github.com/paceaux/McSandy--the-HTML5-offline-Sandbox',
        authors: {
            author: 'Frank M Taylor'
        }
    },
    ui: {
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
        modal: {
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
    blobArray: [],
    externals: {
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