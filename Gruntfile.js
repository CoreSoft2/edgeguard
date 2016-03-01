module.exports = function(grunt) {  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: "\n",
        banner: "(function(){\n",
        footer: '})()',
        process: function(src, path) {
          return "// " + path + "\n" + src;
        }
      },
      dist: {
        src: ['src/globals.js',
          'src/secret-generator.js', 
          'src/lib/**/*.js',
          'src/overrides/*.js',
          'src/reporter/methods/*.js',
          'src/reporter/*.js',
          'src/detectives/**/*.js',
          'src/entry-point.js',
          'src/event-listeners.js',
          'src/session-id-generator.js',          
          'src/element-attribute-watcher.js',
          'src/element-creation-watcher.js',          
          'src/validation-payload-builder.js',
          'src/content-scraper.js',
          'src/script-scraper.js',          
          'src/post-dom-callback.js'
        ],
        dest: 'build/edgeguard.js',
        options: {
          banner: "var boot = this;\n(function(){\n"
        }
      },
      bootstrap: {
        src: ['src/bootstrap/*.js'],
        dest: 'build/snippet.js'
      }
    },
    uglify: {
      dist: {
        src: 'build/edgeguard.js',
        dest: 'build/edgeguard.min.js'
      }
    },
    closureCompile: {
      options: {
        compilationLevel: 'ADVANCED_OPTIMIZATIONS'
      },
      dist: {
        src: 'build/edgeguard.js',
        dest: 'build/edgeguard.compiled.js'
      },
      bootstrap: {
        src: 'build/snippet.js',
        dest: 'build/snippet.compiled.js'
      }
    }   
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadTasks('tasks')

  grunt.registerTask('build', ['concat:dist', 'uglify:dist', 'closureCompile:dist']);
  grunt.registerTask('bootstrap', ['concat:bootstrap', 'closureCompile:bootstrap'])
  grunt.registerTask('default', ['concat:dist'])

}