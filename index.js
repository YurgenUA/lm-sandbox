var S3Service = require('./core/S3Service'); 

var s3Service = new S3Service();


// Entry Point
exports.handler = function( event, context ) {
  "use strict";

  var path = require('path'),
      fs = require('fs'),
      http = require('http'),
      phantomDownloadPath = "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64-symbols.tar.bz2",
      childProcess = require('child_process');

  // Get the path to the phantomjs application
  function getPhantomFileName(callback) {
    var nodeModulesPath = path.join(__dirname, 'node_modules');
    fs.exists(nodeModulesPath, function(exists) {
/*      if (exists) {
        callback(path.join(__dirname, 'node_modules','phantomjs', 'bin', 'phantomjs'));
      }
      else {
        callback(path.join(__dirname, 'phantomjs'));
      }
*/
      callback(path.join(__dirname, 'wkhtmltopdf'));
    });
  }

  // Call the phantomjs script
  function callPhantom(callback) {
    getPhantomFileName(function(phantomJsPath) {
      
      var childArgs = [
        //path.join(__dirname, 'phantomjs-script.js')
        '-O',
        'Landscape',
        path.join(__dirname, './template/index.html'), //'http://djinni.co/hire/', 
        '/tmp/bash.for.loop.pdf'
      ];
  
      // This option causes the shared library loader to output
      // useful information if phantomjs can't start.
      process.env['LD_WARN'] = 'true';

      // Tell the loader to look in this script's directory for
      // the shared libraries that Phantom.js 2.0.0 needs directly.
      // This shouldn't be necessary once
      // https://github.com/ariya/phantomjs/issues/12948
      // is fixed.
      process.env['LD_LIBRARY_PATH'] = __dirname;

      process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

      console.log('Calling phantom: ', phantomJsPath, childArgs);
      var ls = childProcess.execFile(phantomJsPath, childArgs,  function(error, stdout, stderr){
//      var ls = childProcess.execFile(phantomJsPath, null,  function(error, stdout, stderr){
        console.log('in child process callback');
        console.log('in child process callback err %j', error);
        
      });
  
      ls.stdout.on('data', function (data) {    // register one or more handlers
        console.log(data);
      });
  
      ls.stderr.on('data', function (data) {
        console.log('phantom error  ---:> ' + data);
      });
  
      ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        console.log('upload PDF to S3');
        fs.readFile('/tmp/bash.for.loop.pdf', function(err, data){
            if (err)
								console.log('error detected ', err);
						else{
              console.log('fs.readFile with no errors');
              //console.log(' and data is %j', data);
              s3Service.PutFile('cimpress.jobsheet', 'output.pdf', data, 'pdf', callback);
              console.log('after s3Service.PutFile');
            }          
          
        });
      });

      console.log('leaving my lambda...');
      
    });
  }

  // Execute the phantom call and exit
  callPhantom(function() {
    context.done();
  });
}

  // Execute the phantom call and exit
//exports.handler(null, null);

