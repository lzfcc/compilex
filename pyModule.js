var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false ;

exports.compilePython = function(envData, code, input, fn){
	var filename = cuid.slug();
	path = './temp/';
	console.log("pyModule: ".green, input);

	fs.writeFile(path + filename + '.py', code, (err) => {			
		if(exports.stats) {
			if(err) console.log('ERROR: '.red + err);
		    else console.log('INFO: '.green + filename +'.py created');	
		}
		if(!err) {
			if(input) {
				fs.writeFile(path + filename + 'input.txt' , input , (err) => {
					if(exports.stats) {
						if(err) console.log('ERROR: '.red + err);
					    else console.log('INFO: '.green + filename +'input.txt created');	
					}
					var command = 'python ' + path + filename +'.py < ' + path + filename +'input.txt ' ;
					execute(command, filename, fn);
				});
			}// end of if(input)
			else{
				var command = 'python ' + path + filename +'.py';
				execute(command, filename, fn);
			}
		}
	});
}


function execute(command, filename, fn){
	exec(command, (error, stdout, stderr) => {
		if(error) {
			//console.log(typeof(error)); //object  ???看起来是object，但直接输出时候还包含一个[]
			console.log("pyModule ".green, "Run Error".red, error.toString());
			if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
				var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
				fn(out);								
			}
			else {
				if(exports.stats) {
					console.log('INFO: '.green + filename + '.py contained an error while executing.');
				}
				var out = { error : stderr };
				fn(out);								
			}													
		}
		else {
			if(exports.stats) {
				console.log('INFO: '.green + filename + '.py successfully executed!');
			}
			var out = { output : stdout};
			fn(out);
		}
	});	
}