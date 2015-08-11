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
        src: ['globals.js', 'reporter.js', 
          'xhr-override.js', 'event-listeners.js', 'session-id-generator.js',
          'element-attribute-watcher.js', 'element-creation-watcher.js', 
          'validation-payload-builder.js', 'content-scraper.js', 'post-dom-callback.js'],
        dest: 'build/edgeguard.js'
      }
    },
    uglify: {
      build: {
        src: 'build/edgeguard.js',
        dest: 'build/edgeguard.min.js'
      }
    },
    closureCompile: {
      options: {
        compilationLevel: 'ADVANCED_OPTIMIZATIONS'
      },
      build: {
        src: 'build/edgeguard.js',
        dest: 'build/edgeguard.compiled.js'
      }
    }   
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadTasks('tasks')

  grunt.registerTask('default', ['concat', 'uglify', 'closureCompile']);

}