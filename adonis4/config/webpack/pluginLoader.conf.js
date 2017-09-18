const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractStyle = new ExtractTextPlugin({
    filename: '[name]/style/main.css',
    allChunks: false
});

const BrowserSync = new BrowserSyncPlugin({
    proxy: "http://localhost:2206",
    files: ["app/**/*.*", "resources/**/*.*"],
    port: 1111
}, {
        reload: true
    }
);

const CopyWebpack = () => {
    return new CopyWebpackPlugin([{
        from: 'resources/web/image',
        to: 'web/images'
    },
    {
        from: 'resources/web/fonts',
        to: 'web/fonts'
    }]);
}

module.exports = {
    extractStyle,
    CopyWebpack,
    BrowserSync
}