module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlbuild: {
      dist: {
        src: 'preAssets/pre-mcsandy.html',
        dest:'postAssets/post-mcsandy.html',
        options: {
          beautify: false,
          sections: {
            layout: {
              header: 'preAssets/html/header.html',
              main: 'preAssets/html/main.html',
              footer: 'preAssets/html/footer.html'
            },
            assets:{
              styles: 'postAssets/mcsandy.min.css',
              script: 'preAssets/mcsandy.js'
            }
          }
        }
      }
    },
    copy: {
      main: {
        src:'postAssets/post-mcsandy.html',
        dest: 'mcsandy.html',
        filter: 'isFile'
      }
    },
    stylus: {
      standard:{
        options: {
          linenos: false,
          compress: true
        },
        files : {
          'postAssets/mcsandy.min.css' : ['preAssets/mcsandy.styl'],
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'postAssets/mcsandy.min.js' : ['preAssets/mcsandy.js']
        }
      }
    },
    cssmin:{
      minify: {
        expand: true,
        files: {
          'postAssets/mcsandy.min.css' :['postAssets/mcsandy.css']
        }
      }
    },
    watch: {
      stylus:{
        files: ['preAssets/*.styl'],
        tasks: ['stylus:standard', 'htmlbuild']
      },
      html: {
        files: ['preAssets/html/*.html', 'preAssets/*.html'],
        tasks: ['stylus:standard', 'htmlbuild']
      },
      js: {
        files: ['preAssets/mcsandy.js'],
        tasks: ['uglify', 'htmlbuild', 'copy:main']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  // Default task(s).
  grunt.registerTask('default', ['watch', 'htmlbuild']);

};