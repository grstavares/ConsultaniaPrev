var path = require('path');

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

  return Object.assign({}, defaultConfig, {
    name: name,
    entry: './src/' + name + '/index.ts',
    output: {
      filename: name + '/index.js'
    }
  });

}

var newsService = Object.assign({}, defaultConfig, {
  name: 'service_news',
  entry: './src/news/index.ts',
  output: {
    filename: 'news/index.js'
  }
});

var messagesService = Object.assign({}, defaultConfig, {
  name: 'service_messages',
  entry: './src/messages/index.ts',
  output: {
    filename: 'messages/index.js'
  }
});

var services = ['activities', 'complaints', 'documents', 'financial', 'institution', 'messages', 'news', 'people', 'retirement'];
var servicesConfig = services.forEach(value => moduleConfig(value));

module.exports = function () {

  var array = [];
  var i = 0;
  for (i = 0; i < services.length; i++) {
    array.push(moduleConfig(services[i]));
  }

  return array;

}();

// module.exports = {
//   mode: "production",
//   target: 'node',
//   entry: ['./src/news/index.ts', './src/messages/index.ts'],
//   module: {
//     rules: [{
//       test: /\.tsx?$/,
//       use: 'ts-loader',
//       exclude: /node_modules/
//     }]
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js']
//   },
//   externals: {
//     'aws-sdk': 'aws-sdk'
//   },
//   output: {
//     filename: 'service_[name].js',
//     library: "index",
//     libraryTarget: 'commonjs2',
//     path: path.resolve(__dirname, './dist')
//   },
//   optimization: {
//     minimize: false
//   }
// };
