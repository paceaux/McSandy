module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlbuild: {
      dist: {
        src: 'src/pre-mcsandy.html',
        dest:'dist/post-mcsandy.html',
        options: {
          beautify: false,
          sections: {
            layout: {
              header: 'src/html/header.html',
              main: 'src/html/main.html',
              footer: 'src/html/footer.html',
              modal: 'src/html/modal.html'
            },
            assets:{
              styles: 'dist/mcsandy.min.css',
              script: 'src/mcsandy.js'
            }
          }
        }
      }
    },
    copy: {
      main: {
        src:'dist/post-mcsandy.html',
        dest: 'mcsandy.html',
        filter: 'isFile'
      }
    },
    concat: {
      js:{
        options: {
          banner: '/* MCSANDY: THE OFFLINE HTML5 SANDBOX */\n' + 'var store, mcsandyAppData, mcsandy, mcsandyPrefs, mcsandyUI;\n',
          footer: '\n' + 'mcsandyUI.init();\n' + 'mcsandy.init();\n' + 'mcsandyPrefs.init();\n',
          process: function (src, filepath) {
            return '// Source: ' + filepath + '\n' + src
          }
        },
        files: {
          'src/mcsandy.js' : ['src/js/store.js', 'src/js/filesaver.js','src/js/mcsandyAppData.js','src/js/mcsandyPrefs.js', 'src/js/mcsandy.js']
        }
      }
    },
    stylus: {
      standard:{
        options: {
          linenos: false,
          compress: false,
          import: ['nib']
        },
        files : {
          'dist/mcsandy.min.css' : ['src/css/layout.styl','src/css/mcsandy.styl'],
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'dist/mcsandy.min.js' : ['src/mcsandy.js']
        }
      }
    },
    cssmin:{
      minify: {
        expand: true,
        files: {
          'dist/mcsandy.min.css' :['dist/mcsandy.css']
        }
      }
    },
    watch: {
      stylus:{
        files: ['src/**/*.styl'],
        tasks: ['stylus:standard', 'htmlbuild', 'copy:main']
      },
      html: {
        files: ['src/html/*.html', 'src/*.html'],
        tasks: ['stylus:standard', 'htmlbuild', 'copy:main']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['concat:js','uglify', 'htmlbuild', 'copy:main']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  // Default task(s).
  grunt.registerTask('default', ['stylus:standard',  'htmlbuild', 'watch']);

};