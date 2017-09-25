'use strict';
var exec = require('child_process').exec;
var debug = require('debug')('changelog:generate');

function generateFromCommits(commits, sections) {
    this.message('parsed commits', commits.length);
    this.log('debug', 'Parsed', commits.length, 'commits');
    this.log('info', 'Generating changelog to', this.options.file || 'stdout', '(', this.options.version_name, ')');

    return this.writeChangelog(commits, sections);
}

function generateFromTag(tag) {

    var readGitLog;
    this.options.tag = tag;
    if (typeof(tag) !== 'undefined' && tag && tag !== false) {
        this.log('info', 'Reading git log since', tag);
        this.message('since tag', tag);
        readGitLog = this.readGitLog.bind(this, this.cmd.gitLog, tag);
    } else {
        this.log('info', 'Reading git log since the beggining');
        this.message('since beggining');
        readGitLog = this.readGitLog.bind(this, this.cmd.gitLogNoTag);
    }

    return readGitLog()
        .then(generateFromCommits.bind(this))
        .catch(console.log.bind(console, 'error'));
}

function generate(params, loadRC) {
    debug('generating ...');
    var self = this;

    return this.init(params, loadRC)
        .then(this.getCurrentTag.bind(this))
        .then(function (curr) {
            console.log('curr', curr);
            self.options.version_name = curr;
            curr = curr.substring(0, curr.length - 1);
            self.options.file = self.options.file + 'CHANGELOGS.md';
        })
        .then(this.getPreviousTag.bind(this))
        .then(function (tag) {
            self.options.tag = tag;
            return Promise.resolve(tag);
        })
        .then(generateFromTag.bind(this))
        .then(function () {
            return self.options;
        })
        .catch(function (err) {
            self.log('error', err);
            throw(err);
        });
}


module.exports = generate;
