var defaultConfig = require('../../webpack.config_default');
var ZipPlugin = require('zip-webpack-plugin');
var moduleName = 'complaints';

function moduleConfig(name) {

  var zipConfig = {
    path: name + '/',
    filename: name + '.zip',
    extension: 'zip'
  };

  var moduleOutput = Object.assign( {
    filename: name + '/index.js'
  }, defaultConfig.output );

  var config = Object.assign({}, defaultConfig, {
    name: name,
    entry: './src/' + name + '/index.ts',
    output: moduleOutput,
    plugins: [new ZipPlugin(zipConfig)]
  });

  return config;

}

var moduleConfiguration = moduleConfig(moduleName);

module.exports = function() {

  var moduleConfiguration = moduleConfig(moduleName);
  return moduleConfiguration;

}();
