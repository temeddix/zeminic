const webpackBundleAnalyzer = require('webpack-bundle-analyzer');

module.exports = {
    //vuetify 컴포넌트의 ie11호환을 위해 꼭 필요함
    transpileDependencies: ['vuetify'],

    configureWebpack: {
        entry: {},
        output: {},
        plugins: [
            //new webpackBundleAnalyzer.BundleAnalyzerPlugin(), //이걸 켜면 웹팩 프로세스가 종료되지 않아서, 애저(Azure)에 배포 시 깃허브에서 빌드만 하고 배포 단계로 넘어가지 않음.
        ],
        module: {},
        devServer: {
            // 8080포트에서 돌아가는 Vue-cli 서버가 80포트에서 돌아가는 Node 기본서버에 Ajax 요청을 할 수 있도록 프록시(Proxy) 해주기
            // https://velog.io/@skyepodium/vue-proxy-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
            proxy: {
                '/ajax': {
                    target: 'http://localhost:80',
                    changeOrigin: true,
                }
            }
        }
    }
}