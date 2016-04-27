var exec = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false;

exports.compileCPP = function(envData, code, input, fn) {
	var filename = cuid.slug();
	path = './temp/';

	//create temp0 
	fs.writeFile(path + filename + '.cpp', code, function(err) {
		if (exports.stats) {
			if (err) console.log('ERROR: '.red + err);
			else {
				console.log('INFO: '.green + filename + '.cpp created');
				if (envData.cmd === 'g++') {

					//compile c code 
					compileCommand = 'g++ ' + path + filename + '.cpp -o ' + path + filename + '.exe';
					exec(compileCommand, function(error, stdout, stderr) {
						if (error) {
							if (exports.stats) {
								console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							}
							var out = {
								error: stderr
							};
							fn(out);
						} else {
							var runCommand = path + filename + '.exe';
							
							if (input) {
								var inputfile = filename + 'input.txt';

								fs.writeFile(path + inputfile, input, function(err) {
									if (exports.stats) {
										if (err) console.log('ERROR: '.red + err);
										else console.log('INFO: '.green + inputfile + ' (inputfile) created');
									}
								});

								exec(runCommand + '<' + path + inputfile, function(error, stdout, stderr) {
									if (error) {
										if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
											var out = {
												error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'
											};
											fn(out);
										} else {
											if (exports.stats) {
												console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											}
											var out = {
												error: stderr
											};
											fn(out);
										}
									} else {
										if (exports.stats) {
											console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										}
										var out = {
											output: stdout
										};
										fn(out);
									}
								});

							} else { //input not provided 
								exec(runCommand, function(error, stdout, stderr) {
									if (error) {
										if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
											var out = {
												error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'
											};
											fn(out);
										} else {
											if (exports.stats) {
												console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											}
											var out = {
												error: stderr
											};
											fn(out);
										}
									} else {
										if (exports.stats) {
											console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										}
										var out = {
											output: stdout
										};
										fn(out);
									}
								});

							}

						}


					});

				} else {
					console.log('ERROR: '.red + 'choose either g++ or gcc ');
				}
			} //end of else err	    	
		} //end of exports.stats
	}); //end of write file 							
} //end of compileCPPWithInput