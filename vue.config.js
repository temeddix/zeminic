const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const vuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    transpileDependencies: ['vuetify'], //vuetify 컴포넌트의 ie11호환을 위해 꼭 필요함
    configureWebpack: {
        entry: {
        },
        output: {
        },
        plugins: [
            new vuetifyLoaderPlugin(),
            //new webpackBundleAnalyzer.BundleAnalyzerPlugin(), //이걸 켜면 웹팩 프로세스가 종료되지 않아 애저(Azure)에 배포 시 빌드만 하고 배포 단계로 넘어가지 않음.
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