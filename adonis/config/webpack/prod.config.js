const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Webpack = require('webpack');
var commonConfig = require('./common.conf');
var merge = require('webpack-merge')
const pluginLoader = require('./pluginLoader.conf');

module.exports = merge(commonConfig, {
    plugins: [
        pluginLoader.extractStyle,
        pluginLoader.BrowserSync,
        new Webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery",
            "windows.$": "jquery",
            Tether: 'tether',
            Waves: "adminbsb-materialdesign/plugins/node-waves/waves.js",
            io: 'socket.io-client',
        }),
        new Webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new UglifyJSPlugin({
            beautify: false,
            mangle: false,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                warnings: false,
                drop_console: false
            },
            comments: false
        }),
        pluginLoader.CopyWebpack()
    ],
});