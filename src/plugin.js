/**
 * Created by ericmorand on 06/09/16.
 */
const StromboliPlugin = require('stromboli-plugin');
const path = require('path');

const Promise = require('promise');
const Browserify = require('browserify');

class Plugin extends StromboliPlugin {
  /**
   *
   * @param file {String}
   * @param renderResult {StromboliRenderResult}
   */
  render(file, renderResult) {
    var that = this;

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
            renderResult.addBinary('index.js', buffer);

            fulfill(renderResult);
          }
        })
      ;
    });
  }
}

module.exports = Plugin;