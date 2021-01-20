const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const vuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    configureWebpack: {
        entry: {
        },
        output: {
        },
        plugins: [
            new vuetifyLoaderPlugin(),
            new webpackBundleAnalyzer.BundleAnalyzerPlugin(),
        ],
        module: {
            rules: [{
                enforce: 'pre',
                test: /\.js/,
                loader: 'import-glob'
            },
            {
                enforce: 'pre',
                test: /\.scss/,
                loader: 'import-glob'
            }]
        }
    }
}