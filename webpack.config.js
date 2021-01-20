const path = require('path');
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const webpackRawBundler = require('webpack-raw-bundler');
const glob = require('glob');
const vuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
let bundleAnalyzerPlugin = webpackBundleAnalyzer.BundleAnalyzerPlugin;

let config = {
    mode: 'development',
    entry: {
        'vue-script': './webpack-source/vue-script/core.js',
        'npm-libraries': glob.sync('./webpack-source/npm-libraries/*.js'),
        'custom-libraries': glob.sync('./webpack-source/custom-libraries/*.js'),
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name]-bundled.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new vueLoaderPlugin(),
        new vuetifyLoaderPlugin(),
        new bundleAnalyzerPlugin(),
        new webpackRawBundler({
            //진짜 단순히 합치기만 해 줌
            //모듈 불러오기나 파일을 압축하는 Minify 과정이나 호환성 변환같은 것들은 전~혀 실행하지 않음
            //그렇기 때문에 이 폴더에는 이미 Minified된 외부 CDN 라이브러리 파일(****.min)들만 넣어야 함
            bundles: [
                'cdn-libraries-bundled.js',
            ],
            'cdn-libraries-bundled.js': [
                './webpack-source/cdn-libraries/*.js'
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins:
                        [
                            '@babel/plugin-proposal-class-properties'
                        ]
                }
            },
            // this will apply to both plain `.css` files AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
}

module.exports = (env, argv) => {
    if (argv.mode == 'production') {
        config.module.rules[1].options.plugins.push('babel-plugin-transform-remove-console');
    }
    return config;
}