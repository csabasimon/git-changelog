'use strict';

var debug = require('debug')('changelog:setDefaults');

function setDefaults() {
  debug('setting defaults');
  this.options = {};
  this.cmd = {
    gitTag: 'git tag | tail -n 2 | head -n 1',
    gitCurrentTag: 'git describe --abbrev=0',
    gitRepoUrl: 'git config --get remote.origin.url',
    gitLog: null,
    gitLogNoTag: null
  };
  this.header = '<a name="%s">%s</a>\n# %s (%s)\n\n';
  this.emptyComponent = '$$';
  this.links = null;
  this.provider = null;
}

module.exports = setDefaults;
