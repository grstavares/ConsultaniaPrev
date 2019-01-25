var path = require( 'path' );

module.exports = function () {

  return {
    mode: "production",
    target: 'node',
    module: {
      rules: [ {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      } ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    externals: {
      'aws-sdk': 'aws-sdk'
    },
    output: {
      library: "index",
      libraryTarget: 'commonjs2',
      path: path.resolve( __dirname, './dist' )
    },
    optimization: {
      minimize: false
    }
  };

}();
