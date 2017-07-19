var ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var path = require('path');
const Webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const extractStyle = new ExtractTextPlugin({
//     filename: 'style/style.css',
//     allChunks: false
// });
const ROOT_PATH = process.cwd();
const extractStyle = new ExtractTextPlugin({
    filename: '[name]/style/main.css',
    allChunks: true
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
        admin: './resources/html/admin/app.js',
        web: './resources/html/web/app.js',
    },
    output: {
        path: PATHS.build,
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
        CopyWebpack()
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loaders: [
                'babel-loader?presets[]=es2015',
            ],
            exclude: /node_modules/,
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
                    'js': 'babel-loader?presets[]=es2015',
                    'vue': 'babel-loader?presets[]=es2015'
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
        from: 'resources/html/web/image',
        to: 'web/images'
    },
    {
        from: 'resources/html/web/fonts',
        to: 'web/fonts'
    }]);
}