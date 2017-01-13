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
   * @param renderResult {StromboliRenderResult}
   * @param output {String}
   */
  render(file, renderResult, output) {
    var that = this;

    if (!output) {
      output = 'index.js';
    }

    return new Promise(function (fulfill, reject) {
      Browserify(file, that.config)
        .on('file', function (file, id, parent) {
          renderResult.addDependency(file);
        })
        .bundle(function (err, buffer) {
          if (err) {
            // unfortunately, browserify doesn't return the file that triggered the error
            // luckily, files with errors trigger the 'file' event, thus allowing us to maintain dependencies
            var error = {
              file: null,
              message: err.message
            };

            reject(error);
          }
          else {
            renderResult.addBinary(output, buffer.toString());

            fulfill(renderResult);
          }
        })
      ;
    });
  }
}

module.exports = Plugin;