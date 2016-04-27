/**
 * Created by lzf on 2016-04-27.
 */
var exec = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false;

exports.compileC = function(envData, code, input, fn) {
	var filename = cuid.slug();
	path = './temp/';

	//create temp0 
	fs.writeFile(path + filename + '.c', code, function(err) {
		if (exports.stats) {
			if (err) console.log('ERROR: '.red + err);
			else {
				console.log('INFO: '.green + filename + '.c created');
				if (envData.cmd == 'gcc') {
					//compile c code 
					commmand = 'gcc ' + path + filename + '.c -o ' + path + filename + '.out';
					exec(commmand, function(error, stdout, stderr) {
						if (error) {
							if (exports.stats) {
								console.log('INFO: '.green + filename + '.c contained an error while compiling');

							}
							var out = {
								error: stderr
							};
							fn(out);

						} else {
							if (input) {
								var inputfile = filename + 'input.txt';

								fs.writeFile(path + inputfile, input, function(err) {
									if (exports.stats) {
										if (err) console.log('ERROR: '.red + err);
										else console.log('INFO: '.green + inputfile + ' (inputfile) created');

									}

								});

								exec(path + filename + '.out' + ' < ' + path + inputfile, function(error, stdout, stderr) {
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

									} else {
										if (exports.stats) {
											console.log('INFO: '.green + filename + '.c successfully compiled and executed !');

										}
										var out = {
											output: stdout
										};
										fn(out);

									}

								});


							} else { 	//no input file
									exec(path + filename + '.out', function(error, stdout, stderr) {
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

									} else {
										if (exports.stats) {
											console.log('INFO: '.green + filename + '.c successfully compiled and executed !');

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

			}
			//end of else err	    	

		}
		//end of exports.stats

	});
	//end of write file 							

}
//end of compileC