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
        src: ['src/globals.js', 'src/reporter.js', 'src/builtin-wrapper.js', 
          'src/xhr-override.js', 'src/ws-override.js', 'src/event-listeners.js', 'src/session-id-generator.js',
          'src/element-attribute-watcher.js', 'src/element-creation-watcher.js', 
          'src/validation-payload-builder.js', 'src/content-scraper.js', 'src/post-dom-callback.js'],
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