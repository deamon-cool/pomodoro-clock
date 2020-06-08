var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(request, response) {
    console.log(request.url);

    var filePath = '.' + request.url;
    if(filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.mjs': 'text/javascript',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.wav': 'audio/wav'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content){
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(404, { 'content-type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + '..\n');
            }
        } else {
            response.writeHead(200, {'content-type': contentType});
            response.end(content, 'utf-8');
        }
    });
}).listen(8000);
console.log('Server is running at the http://127.0.0.1:8000/');