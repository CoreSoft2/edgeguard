module.exports = function(grunt) {  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: "\n",
        banner: "(function(){\n",
        footer: '})()'
      },
      dist: {
        src: ['globals.js', 'reporter.js', 
          'xhr-override.js', 'event-listeners.js', 'session-id-generator.js',
          'element-attribute-watcher.js', 'content-scraper.js',
          'element-creation-watcher.js', 'validation-payload-builder.js', 'post-dom-callback.js'],
        dest: 'build/edgeguard.js'
      }
    },
    uglify: {
      build: {
        src: 'build/edgeguard.js',
        dest: 'build/edgeguard.min.js'
      }
    }   
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);

}