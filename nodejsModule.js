var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false ;

exports.compileJs = function( envData , code , input , fn){
	var filename = cuid.slug();
	path = './temp/';

	fs.writeFile(path  +  filename +'.js' , code, (err) => {			
		if(exports.stats) {
			if(err) console.log('ERROR: '.red + err);
		    else console.log('INFO: '.green + filename +'.js created');	
		}
		if(!err) {
			fs.writeFile(path + filename + 'input.txt' , input , (err) => {
				if(exports.stats) {
					if(err) console.log('ERROR: '.red + err);
				    else console.log('INFO: '.green + filename +'input.txt created');	
				}
				if(!err) {
					var command = 'node ' + path + filename +'.js';
					if(input){
						var command = 'node ' + path + filename +'.js < ' + path + filename + 'input.txt' ;
						execute(command, filename, fn);
					}
					else{
						execute(command, filename, fn);
					}
										
				}
			});
		}
	});
}


function execute(command, filename, fn){
	exec(command, (error , stdout , stderr) => {
		if(error) {
			console.log("nodejsModule ".green, "Run Error".red, error.toString());
			if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
				var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
				fn(out);								
			}
			else {
				if(exports.stats) {
					console.log('INFO: '.green + filename + '.js contained an error while executing');
				}
				var out = { error : stderr };
				fn(out);								
			}													
		}
		else {
			if(exports.stats) {
				console.log('INFO: '.green + filename + '.js successfully executed!');
			}
			var out = { output : stdout};
			fn(out);
		}
	});
}