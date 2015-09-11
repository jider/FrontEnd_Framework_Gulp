'use strict';

var Stream = require('stream'),
    crypto = require('crypto'),
    Path   = require('path');


/// -------------------------------------------------------------------------------------------------------


function md5Rename(obj) {

    var stream = new Stream.Transform({objectMode: true});

    function parsePath(path) {
        var extname = Path.extname(path);
        return {
            dirname: Path.dirname(path),
            basename: Path.basename(path, extname),
            extname: extname
        };
    }

    function calcMd5(file){
        var md5 = crypto.createHash('md5');
        md5.update(file.contents, 'utf8');

        return md5.digest('hex');
    }

    stream._transform = function (file, unused, callback) {
        var path,
            parsedPath = parsePath(file.relative);

        var md5Hash = '?' + calcMd5(file);

        path = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname + md5Hash);
        file.path = Path.join(file.base, path);

        callback(null, file);
    };

    return stream;
}

module.exports = md5Rename;