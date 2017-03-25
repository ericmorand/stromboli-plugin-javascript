const Plugin = require('../src/plugin');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

test('render', function (t) {
  var plugin = new Plugin();

  t.plan(3);

  return plugin.render(path.resolve('test/render/valid/index.js')).then(
    function(renderResult) {
      var binaries = renderResult.binaries;

      t.equal(renderResult.dependencies.length, 3);
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

  return plugin.render(path.resolve('test/render/error/index.js')).then(
    function(renderResult) {
      t.fail();
    },
    function(renderResult) {
      t.same(renderResult.dependencies, [
        path.resolve('test/render/error/index.js')
      ]);

      t.equal(renderResult.error.file, path.resolve('test/render/error/index.js'));
      t.ok(renderResult.error.message);
    }
  );
});

test('render with error in dependency', function (t) {
  var plugin = new Plugin();

  return plugin.render(path.resolve('test/render/error-in-dependency/index.js')).then(
    function(renderResult) {
      t.fail();
    },
    function(renderResult) {
      t.same(renderResult.dependencies, [
        path.resolve('test/render/error-in-dependency/index.js'),
        path.resolve('test/render/error-in-dependency/foo.js')
      ]);

      t.equal(renderResult.error.file, path.resolve('test/render/error-in-dependency/foo.js'));
      t.ok(renderResult.error.message);
    }
  );
});

test('render with output', function (t) {
  var plugin = new Plugin();

  t.plan(1);

  return plugin.render(path.resolve('test/render/valid/index.js'), 'custom.js').then(
    function(renderResult) {
      var binaries = renderResult.binaries;

      t.equal(binaries[0].name, 'custom.js');
    },
    function(err) {
      t.fail(err);
    }
  );
});