var path = require('path');
var ZipPlugin = require('zip-webpack-plugin');

var defaultConfig = {
  mode: "production",
  target: 'node',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  output: {
    library: "index",
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, './dist')
  },
  optimization: {
    minimize: false
  }
};

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

// var services = [ 'financial', 'institution', 'messages', 'people'];
var services = [ 'news', 'retirement', 'activities', 'complaints', 'documents' ];

module.exports = function () {

  var array = [];
  var i = 0;
  for (i = 0; i < services.length; i++) {
    array.push(moduleConfig(services[i]));
  }

  return array;

}();
