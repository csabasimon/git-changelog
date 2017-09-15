'use strict';

var debug = require('debug')('changelog:writeChangelog');
var format = require('util').format;
var _ = require('lodash');
var fse = require('fs-extra');

function sendToStream(stream, sections) {

    var module = this;

    this.printHeader(stream, this.options, this.currentDate());

    sections.forEach(function (section) {
        module.printSection(stream, section);
    });

    this.printSalute(stream);
    stream.end();
}

function writeChangelog(commits) {
    var module = this;

    debug('writing change log');
    var sections = this.organizeCommits(commits, this.options.sections);
    var stream;

    var data = {
        logo: module.options.logo,
        sections: sections,
        intro: module.options.intro,
        title: module.options.app_name,
        version: {
            number: module.options.tag,
            name: module.options.version_name,
            date: new Date()//Todo get the date of the tag
        }
    };

    return new Promise(function (resolve, reject) {

        module.loadTemplate(data)
            .then(function (template) {
                var previousFileContent = '';

                module.readPreviousChangelog().then(function (lastVersion) {
                    previousFileContent = lastVersion;
                    stream = fse.createOutputStream(module.options.file);
                    if (template) {
                        debug('Proceding with template');

                        stream.on('open', function () {
                            var lines = template.split('\n');
                            stream.write(previousFileContent);
                            lines.forEach(function (line) {
                                stream.write(line);
                                stream.write('\n');
                            });

                            stream.end();
                            stream.on('finish', resolve);
                        });
                    } else {
                        debug('Proceding with legacy output');

                        stream.on('open', sendToStream.bind(module, stream, sections));
                        stream.on('finish', resolve);
                    }

                });

            })
            .catch(reject);
    });
}


module.exports = writeChangelog;
