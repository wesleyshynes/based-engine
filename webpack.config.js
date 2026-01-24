const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/index.js',
  entry: {
    index: './src/index.ts',
    // index: './src/index.js'
  },
  devtool: 'inline-source-map',
  // mode: 'development',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    contentBase: './dist',
    // host: '10.0.0.241' // set to your local ip to test on your phone or other network devices
    // host: '192.168.1.143' // set to your local ip to test on your phone or other network devices
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(ogg|mp3)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
   new HtmlWebpackPlugin({
     // title: 'Custom Title',
     template: './src/assets/index.html'
   }),
 ],
 resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
