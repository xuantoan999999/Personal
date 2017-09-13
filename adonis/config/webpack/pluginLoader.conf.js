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
        from: 'public/image/web',
        to: 'web/images'
    },
    {
        from: 'public/fonts',
        to: 'web/fonts'
    },
    {
        from: 'public/image/admin',
        to: 'admin/images'
    },
    {
        from: 'public/fonts',
        to: 'admin/fonts'
    }]);
}

module.exports = {
    extractStyle,
    CopyWebpack,
    BrowserSync
}