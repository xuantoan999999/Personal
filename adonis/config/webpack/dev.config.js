var ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
const Webpack = require('webpack');

// const extractStyle = new ExtractTextPlugin({
//     filename: 'style/style.css',
//     allChunks: false
// });
const ROOT_PATH = process.cwd();
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

const PATHS = {
    src: ROOT_PATH,
    assets: ROOT_PATH + '/public/assets/',
    dist: ROOT_PATH + '/public/assets/dist',
    build: ROOT_PATH + '/public/assets/build',
    lib: ROOT_PATH + '/public/assets/lib/',
    layout: ROOT_PATH + '/app/templates/web/layouts/',
    module: ROOT_PATH + '/resources/html/',
    script: ROOT_PATH + '/public/assets/scripts/',
    style: ROOT_PATH + '/public/assets/styles/',
    image: ROOT_PATH + '/public/assets/images/',
    font: ROOT_PATH + '/public/assets/fonts/',
    data: ROOT_PATH + '/app/public/assets/data/'
};

module.exports = {
    entry: {
        // admin_vendor:
        // admin_main:
        admin: './resources/admin/app.js',
        web: './resources/web/app.js',
    },
    output: {
        path: PATHS.dist,
        filename: '[name]/script/main.js'
    },
    plugins: [
        extractStyle,
        BrowserSync,
        new Webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery",
            "windows.$": "jquery",
            Tether: 'tether',
            Waves: "adminbsb-materialdesign/plugins/node-waves/waves.js",
            io: 'socket.io-client',
        }),
        CopyWebpack()
    ],
    module: {
        rules: [{
            test: /\.(vue|js|jsx)$/,
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
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                }
            }
        }, {
            test: /\.(scss|sass)$/,
            use: extractStyle.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader?url=false'
                }, {
                    loader: 'sass-loader',
                }]
            })
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
};

function CopyWebpack() {
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