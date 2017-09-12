'use strict';

var debug = require('debug')('changelog:getPreviousTag');
var child = require('child_process');

function cmdDone(resolve, reject, code, stdout, stderr) {
    var module = this;
    debug('returning from git tag');
    //I think this command it's actually not working and always return empty
    // Consider trying git describe --abbrev=0 --tags

    if (code) {
        reject();
    } else {
        resolve(stdout);
    }
}

function getCurrentTag() {
    var module = this;

    return new Promise(function (resolve, reject) {

        child.exec('git describe --abbrev=0', cmdDone.bind(null, resolve, reject));
    });
}

module.exports = getCurrentTag;
