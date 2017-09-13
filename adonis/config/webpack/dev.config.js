const Webpack = require('webpack');
const commonConfig = require('./common.conf');
const merge = require('webpack-merge')
const pluginLoader = require('./pluginLoader.conf');
const helpers = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        pluginLoader.CopyWebpack(),
        new Webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./resources/admin'), // location of your resources/admin
            {} // a map of your routes
        ),

        new Webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'resources/admin/index.html'
        })
    ],
});