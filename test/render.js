const Plugin = require('../src/plugin');
const RenderResult = require('../node_modules/stromboli/lib/render-result.js');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

test('render', function (t) {
  var plugin = new Plugin();

  t.plan(3);

  var renderResult = new RenderResult();

  return plugin.render(path.resolve('test/render/valid/index.js'), renderResult).then(
    function(renderResult) {
      var binaries = renderResult.getBinaries();

      t.equal(renderResult.getDependencies().size, 3);
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index.js');
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

test('render with output', function (t) {
  var plugin = new Plugin();

  t.plan(1);

  var renderResult = new RenderResult();

  return plugin.render(path.resolve('test/render/valid/index.js'), renderResult, 'custom.js').then(
    function(renderResult) {
      var binaries = renderResult.getBinaries();

      t.equal(binaries[0].name, 'custom.js');
    },
    function(err) {
      t.fail(err);
    }
  );
});