var ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var path = require('path');

// const extractStyle = new ExtractTextPlugin({
//     filename: 'style/style.css',
//     allChunks: false
// });
const ROOT_PATH = process.cwd();
const extractStyle = new ExtractTextPlugin({
    filename: '[name]/main.css',
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
        admin: './resources/html/admin/app.js',
        web: './resources/html/web/app.js',
    },
    output: {
        path: PATHS.dist,
        filename: '[name]/main.js'
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
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
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
    externals: {
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
        "windows.$": "jquery",
        Tether: 'tether',
        io: 'socket.io-client',
    }
};