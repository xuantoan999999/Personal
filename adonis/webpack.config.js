var ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var path = require('path');

// const extractStyle = new ExtractTextPlugin({
//     filename: 'style/style.css',
//     allChunks: false
// });

const extractStyle = new ExtractTextPlugin('style/main.css');
const BrowserSync = new BrowserSyncPlugin({
    proxy: "http://localhost:2006",
    files: ["app/**/*.*", "resources/**/*.*"],
    port: 2206
}, {
        reload: true
    }
);

module.exports = {
    entry: './public/assets/app.js',
    output: {
        path: path.resolve(__dirname, "public/assets/dist"),
        filename: 'script/main.js'
    },
    plugins: [
        extractStyle,
        BrowserSync
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(jpg|png|gif|svg)$/,
            loader: 'url-loader?limit=100000'
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: 'css-loader'
            }),
            // options: {
            //     includePaths: ['node_modules']
            // }
        }]
    },
};