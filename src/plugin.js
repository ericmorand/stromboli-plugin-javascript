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
      try {
        Browserify(file, that.config)
          .on('dep', function (dep) {
            renderResult.addDependency(dep.file);
          })
          .bundle(function (err, buffer) {
            if (err) {
              reject(err);
            }
            else {
              renderResult.addBinary('index.js', buffer);

              fulfill(renderResult);
            }
          })
        ;
      }
      catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Plugin;