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
        pluginLoader.CopyWebpack()
    ],
});