const Plugin = require('../src/plugin');
const RenderResult = require('../node_modules/stromboli/lib/render-result.js');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

test('render', function (t) {
  var plugin = new Plugin();

  t.plan(2);

  var renderResult = new RenderResult();

  return plugin.render(path.resolve('test/render/valid/index.js'), renderResult).then(
    function(renderResult) {
      t.equal(renderResult.getDependencies().size, 3);
      t.equal(renderResult.getBinaries().length, 1);
    },
    function(err) {
      t.fail(err);
    }
  );
});

test('render with error', function (t) {
  var plugin = new Plugin();

  t.plan(1);

  var renderResult = new RenderResult();

  return plugin.render(path.resolve('test/render/error/index.js'), renderResult).then(
    function(renderResult) {
      t.fail();
    },
    function(err) {
      t.pass(err);
    }
  );
});