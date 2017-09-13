const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const pluginLoader = require('./pluginLoader.conf');
const helpers = require('./helpers');

const ROOT_PATH = process.cwd();

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
        web: './resources/web/app.js',
        polyfills: './resources/admin/polyfills.ts',
        vendor: './resources/admin/vendor.ts',
        app: './resources/admin/main.ts'
    },
    output: {
        path: PATHS.dist,
        filename: '[name]/script/main.js'
    },
    module: {
        rules: [{
            test: /\.(vue|js|jsx)$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.ts$/,
            loaders: [
                {
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: helpers.root('resources/admin', 'tsconfig.json') }
                }, 'angular2-template-loader'
            ]
        },
        {
            test: /\.html$/,
            loader: 'html-loader'
        },
        {
            test: /\.(jpg|png|gif|svg)$/,
            loader: 'url-loader?limit=100000'
        },
        // {
        //     test: /\.css$/,
        //     use: ExtractTextPlugin.extract({
        //         use: 'css-loader'
        //     }),
        // },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                }
            }
        },
        {
            test: /\.css$/,
            exclude: helpers.root('resources/admin', 'app'),
            loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
        },
        {
            test: /\.css$/,
            include: helpers.root('resources/admin', 'app'),
            loader: 'raw-loader'
        }, {
            test: /\.(scss|sass)$/,
            use: pluginLoader.extractStyle.extract({
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
        },
        extensions: ['.ts', '.js']
    },
};