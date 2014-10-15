var express = require('express');
var app     = express();
var server  = app.listen(3000);
var io      = require('socket.io')(server);
var fs      = require('fs');
var PNGReader = require('png.js');

app.use(express.static(__dirname + '/public'));

function scanImage(socket) {
	console.log('scan image');
	fs.readFile('image.png', function(err, buffer) {
		var reader = new PNGReader(buffer);
		reader.parse(function(err, png) {
			if (err) throw err;

			var i = 0;
			var width = png.getWidth();
			var height = png.getHeight();
			for (var j = 0; j < width; j++) {
				for (var k = 0; k < height; k++) {
					(function(i, j, k) {
						setTimeout(function() {
							var pixel = png.getPixel(j, k);
							socket.emit('color', {
								r: pixel[0],
								g: pixel[1],
								b: pixel[2]
							});
						}, 300 * i);
					})(i, j, k);
					i++;
				}
			}
			console.log('loop done');
		});
	});
}

io.on('connection', function (socket) {
	scanImage(socket);
});