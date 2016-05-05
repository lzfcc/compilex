/**
 * Created by lzf on 2016-04-27.
 */
var exec = require('child_process').exec;
var fs = require('fs');
//var Promise = require('bluebird');
//var fs =  Promise.promisifyAll(require('fs'));
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false;

exports.compileC = function(envData, code, input, fn) {
	var filename = cuid.slug();
	path = './temp/';

	/*return fs.writeFileAsync(path + filename + '.c', code)
			.then(function(){
				commmand = 'gcc ' + path + filename + '.c -o ' + path + filename + '.out';
				return exec(commmand);
			})
			.then(function(){
				if (input) {
					var inputfile = filename + 'input.txt';

								fs.writeFile(path + inputfile, input, function(err) {
									if (exports.stats) {
										if (err) console.log('ERROR: '.red + err);
										else console.log('INFO: '.green + inputfile + ' (inputfile) created');

									}

								});

					exec(path + filename + '.out' + ' < ' + path + inputfile);
				}
				else{
					exec(path + filename + '.out');
				}
			}).catch(function(e){
				console.log(e);
			});

	*/


	//create temp0 
	fs.writeFile(path + filename + '.c', code, (err) => {
		if (exports.stats) {
			if (err) console.log('ERROR: '.red + err);
		
			console.log('INFO: '.green + filename + '.c created');
			if (envData.cmd == 'gcc') {
				//compile c code 
				commmand = 'gcc ' + path + filename + '.c -o ' + path + filename + '.out';
				exec(commmand, (error, stdout, stderr) => {
					if (error) {
						if (exports.stats) {
							console.log('INFO: '.red + filename + '.c contained an error while compiling');
						}
						var out = {
							error: stderr
						};
						fn(out);
						return;
					} 
					
					var runCommand = path + filename + '.out';
					if (input) {
						console.log('INFO: '.green + filename + '.c compiled.');
						
						var inputfile = filename + 'input.txt';

						fs.writeFile(path + inputfile, input, (err) => {
							if (exports.stats) {
								if (err) {
									console.log('ERROR: '.red + err);
									return;
									
								}
								console.log('INFO: '.green + inputfile + ' (inputfile) created.');
							}
							execute(runCommmand + ' < ' + path + inputfile, filename, fn);
						});
					} 
					else { 	//no input file
						execute(runCommand, filename, fn);
					}

				});

			} else {
				console.log('ERROR: '.red + 'choose either g++ or gcc!');
			}
			//end of else err	    	
		}
		//end of exports.stats
	});
	//end of write file 						
}
//end of compileC

function execute(command, filename, fn){
	exec(command, (error, stdout, stderr) => {
		if (error) {
			if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
				var out = {
					error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'
				};
				fn(out);
	
			} else {
				if (exports.stats) {
					console.log('INFO: '.green + filename + '.c contained an error while executing');
				}
				var out = {
					output: stderr
				};
				fn(out);
	
			}
			return;
		}
		if (exports.stats) {
			console.log('INFO: '.green + filename + '.c successfully compiled and executed!');
		}
		var out = {
			output: stdout
		};
		fn(out);
			
	});
}
