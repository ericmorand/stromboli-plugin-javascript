'use strict';

const path = require('path');

const Promise = require('promise');
const Browserify = require('browserify');

class Plugin {
  constructor(config) {
    this.config = config;
  }

  /**
   *
   * @param file {String}
   * @param output {String}
   */
  render(file, output) {
    var that = this;

    if (!output) {
      output = 'index.js';
    }

    let renderResult = {
      binaries: [],
      binaryDependencies: [],
      sourceDependencies: [],
      error: null
    };

    let currentFile = null;

    return new Promise(function (fulfill, reject) {
      Browserify(file, that.config)
        .on('file', function (file, id, parent) {
          renderResult.sourceDependencies.push(file);

          currentFile = file;
        })
        .bundle(function (err, buffer) {
          if (err) {
            renderResult.error = {
              file: currentFile,
              message: err.message
            };

            reject(renderResult);
          }
          else {
            renderResult.binaries.push({
              name: output,
              data: buffer.toString()
            });

            fulfill(renderResult);
          }
        })
      ;
    });
  }
}

module.exports = Plugin;