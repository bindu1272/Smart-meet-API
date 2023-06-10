const nodeExternals = require('webpack-node-externals')
module.exports = {
    entry: "./lambda.js",
    target: 'node',
    output: {
        path:__dirname+ '/dist',
        filename: "lambda.js",
        // publicPath: '/',
        libraryTarget: 'commonjs'
    },

    // devServer: {
    //     inline: false,
    //     contentBase: "./dist",
    // },
    mode : "production",
    externals: [nodeExternals(), { pg: { commonjs: 'pg' },mysql2 :{commonjs : 'mysql2'} }],
    //   resolve: {
    //     alias: {
    //       'pg-native': 'noop2',
    //       tedious: 'noop2',
    //       sqlite3: 'noop2',
    //       mysql2: 'noop2',
    //     },
    //   },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                
            },
            {
                test: /\.ejs$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'views',
                }
            },
               
        ]
    },
    
    
};