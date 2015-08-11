var fs = require('fs')
var childProcess = require('child_process')
var http = require('http')
var unzip = require('unzip')
var fstream = require('fstream')
var progress = require('progress-stream');
var singleLine = require('single-line-log').stdout;
var Q = require('q')

module.exports = function(grunt) {

  var processFile = function(sources, dest, options) {
    var deferred = Q.defer()    
    var command = 'java -jar build/compiler/compiler.jar'
    sources.forEach(function(src) {
      command += ' --js ' + src      
    })
    command += ' --js_output_file ' + dest
    if (options.compilationLevel) {
      command += ' --compilation_level ' + options.compilationLevel
    }
    console.log("Executing " + command)
    var compileProcess = childProcess.exec(command)
    process.on('exit', function(code, signal) {
      if (code == 0) {
        deferred.resolve();
      }
    })  
    return deferred.promise
  }

  var downloadCompiler = function() {
    console.log("Compiler not found")    
    var writeStream = fstream.Writer('build/compiler')
    var streamProgress = progress({time: 100, speed: 20})
    var deferred = Q.defer()
    var httpOptions = {
      method: 'GET',
      host: 'dl.google.com', 
      path: '/closure-compiler/compiler-latest.zip'
    }
    http.request(httpOptions, function(response) {
      streamProgress.on('progress', function(prog) {
        if (prog.length == 0) { streamProgress.setLength(5664376); }
        singleLine("Downloading compiler... " + Math.min(Math.round(prog.percentage), 100) + "%")        
      })
      response.pipe(streamProgress).pipe(unzip.Parse()).pipe(writeStream)
      writeStream.on('close', function() {
        singleLine.clear()
        console.log("\nDone")
        deferred.resolve();
      })
    }).on('error', function(err) {
      console.log("Error downloading compiler from http://" + httpOptions.host + httpOptions.path)
      console.log(err)
      deferred.reject()
    }).end()
    return deferred.promise    
  }

  grunt.registerMultiTask('closureCompile', function() {
    var done = this.async()
    console.log(this.options())
    var process = childProcess.exec('java -version')

    var _this = this;    

    var processFiles = function() {
      var deferred = Q.defer()      
      if (!_this.files) {
        console.log('No source files specified!')
        deferred.reject();        
      } else {
        var promises = []
        _this.files.forEach(function(file){
          promises.push(processFile(file.src, file.dest, _this.options()));
        });
        Q.all(promises).then(deferred.resolve)
      }
      return deferred.promise
    }

    process.on('exit', function(code, signal) {
      if (code !== 0) {
        console.log('Could not detect Java runtime using "java -version", aborting...')
        done();
        return
      }

      fs.readdir('build/compiler', function(err, files) {
        if (err && err.code === 'ENOENT' || !files) {
          fs.mkdirSync('build/compiler')
          downloadCompiler().then(processFiles).then(done)
        } else if (files.indexOf('compiler.jar') < 0) {
          downloadCompiler().then(processFiles).then(done)
        } else {
          processFiles().then(done)
        }

      })      
      
    })
  });
}