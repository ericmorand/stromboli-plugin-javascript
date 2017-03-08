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
      dependencies: [],
      error: null
    };

    return new Promise(function (fulfill, reject) {
      Browserify(file, that.config)
        .on('file', function (file, id, parent) {
          renderResult.dependencies.push(file);
        })
        .bundle(function (err, buffer) {
          if (err) {
            // unfortunately, browserify doesn't return the file that triggered the error
            // luckily, files with errors trigger the 'file' event, thus allowing us to maintain dependencies
            renderResult.error = {
              file: null,
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