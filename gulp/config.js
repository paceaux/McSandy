const dest = 'public';
const src = 'src';
const partialPath = `${src}/html/`;
const cssPath = `${src}/css`;
const jsPath = `${src}/js`;

module.exports = {
    stylus: {
        src: `${cssPath}/*.styl`,
        dest: `${dest}/main.css`,
        opts: {
            'include css': true,
        },
    },
    js: {
        filename: 'main.js',
        src: `${jsPath}/*.js`,
        dest: `${dest}/main.js`,
        destmin: `${dest}/main.min.js`,
        uglify: {
            mangle: false,
        },
    },
    build: {
        scaffold: `${src}/shell.html`,
        partials: partialPath,
        rename: {
            basename: 'index',
        },
    },
    watch: {
        html: `${partialPath}**/*.html`,
        css: `${cssPath}/**/*.styl`,
        js: `${jsPath}/**/*.js`,
    },
};
