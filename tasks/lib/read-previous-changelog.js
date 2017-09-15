'use strict';

var debug = require('debug')('changelog:readPreviousChangelog');
var q = require('q'),
    fs = require('fs');

function readPreviousChangelog() {
    debug('Read previous file');
    var self = this;
    var dfd = q.defer();
    console.log('File loc', self.options.file);
    fs.exists(self.options.file, function (exists) {
        if (!exists) {
            fs.openSync(self.options.file, 'w');
            return dfd.resolve('');

        } else {
            fs.readFile(self.options.file, 'utf8', function (err, data) {
                if (err) {
                    console.log('error', 'No changelog found', err);
                    dfd.reject(err);
                } else {
                    console.log('info', 'Found changelog rc');
                    dfd.resolve(data);
                }
            });
        }

    });

    return dfd.promise;
}

module.exports = readPreviousChangelog;
