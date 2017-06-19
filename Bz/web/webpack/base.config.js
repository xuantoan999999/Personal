// @flow
const Glob = require('glob');
const path = require('path');
const Webpack = require('webpack');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtLibs = require('./variables.js');
const configManager = require('kea-config');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

configManager.setup('./app/config');
const ROOT_PATH = process.cwd();

const PATHS = {
    src: ROOT_PATH,
    assets: ROOT_PATH + '/public/assets/',
    dist: ROOT_PATH + '/public/assets/dist',
    build: ROOT_PATH + '/public/assets/build',
    lib: ROOT_PATH + '/public/assets/lib/',
    layout: ROOT_PATH + '/app/templates/web/layouts/',
    module: ROOT_PATH + '/app/templates/web/html/',
    script: ROOT_PATH + '/public/assets/scripts/',
    style: ROOT_PATH + '/public/assets/styles/',
    image: ROOT_PATH + '/public/assets/images/',
    font: ROOT_PATH + '/public/assets/fonts/',
    data: ROOT_PATH + '/app/public/assets/data/'
};

var assets = configManager.get('web.assets.required');

let mainResource = Glob.sync(PATHS.module + "**/client/+(js|css)/+(*.js|*.scss)");

const extractStyle = new ExtractTextPlugin({
    filename: 'styles/[name].css',
    allChunks: false
});

let Entries = {
    vendor: assets,
    main: mainResource
};

module.exports = function(env) {
    return {
        target: ExtLibs.target,
        entry: Entries,
        resolve: {
            extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css', '.scss']
        },
        output: {
            path: env.env == "dev" ? PATHS.dist : PATHS.build,
            publicPath: '',
            filename: 'scripts/[name].js',
            chunkFilename: '[name].js',
            sourceMapFilename: '[name].map'
        },
        plugins: [
            extractStyle,
            CommonsChunkVendor(),
            Ignore(),
            Provide(),
            AsyncDeferWebpack(),
            CopyWebpack(),
            BrowserSync(),
            WebpackNotifier(),
        ],
        module: {
            rules: [{
                    test: /\.(js|jsx)$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpg|png|gif|svg)$/,
                    use: 'file-loader?name=images/[name].[ext]'
                },
                {
                    test: /\.css$/,
                    use: extractStyle.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader?url=false'
                        }]
                    })
                },
                {
                    test: /\.scss$/,
                    use: extractStyle.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader?url=false'
                        }, {
                            loader: 'sass-loader',
                            options: {
                                includePaths: ['node_modules']
                            }
                        }, {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    PATHS.module + 'core/client/css/config/_variables.scss',
                                    PATHS.module + 'core/client/css/tools/_mixins.scss'
                                ]
                            },
                        }, ]
                    })
                }
            ]
        },
        externals: ExtLibs.externals
    };
};

/********************************
 * Extension Methods
 ********************************/

function ExtractText() {
    return new ExtractTextPlugin({
        filename: 'styles/[name].css',
        allChunks: false
    });
}

function CommonsChunkVendor() {
    return new Webpack.optimize.CommonsChunkPlugin({
        names: ['main', 'vendor']
    })
}

function AsyncDeferWebpack() {
    return new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
    })
}

function Ignore() {
    return new Webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]);
}

function Provide() {
    return new Webpack.ProvidePlugin(ExtLibs.ProvidePlugin)
}

function CopyWebpack() {
    return new CopyWebpackPlugin([{
            from: 'public/assets/images',
            to: 'images'
        },
        {
            from: 'public/assets/fonts',
            to: 'fonts'
        }
    ]);
}

function WebpackNotifier() {
    return new WebpackBuildNotifierPlugin({
        title: configManager.get('web.name'),
        logo: path.resolve("./img/favicon.png"),
        suppressSuccess: true
    })
}

function BrowserSync() {
    return new BrowserSyncPlugin({
        proxy: "http://localhost:2206/tims",
        files: ["app/**/*.*"],
        port: 2206
    }, {
        reload: true
    });
}