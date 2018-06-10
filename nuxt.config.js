module.exports = {

    css: ['~/assets/css/animate.css', '~/assets/css/main.scss', '~/assets/css/flexboxgrid.css', '~/assets/css/milligram.css', 'font-awesome/css/font-awesome.css'],

    plugins: [
        { src: '~/plugins/vuex-persist', ssr: false },
        { src: '~/plugins/vue2-filters', ssr: false },
        { src: '~/plugins/vue-pouchdb', ssr: false }
    ],

    dev: process.env.NODE_ENV === 'DEV',

    mode: 'spa',

    build: {
        babel: {
            plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-flow-strip-types'],
            presets: ['stage-0']
        },

        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                // Run ESLint on save
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    exclude: /(node_modules)/
                })
            }
            // Extend only webpack config for client-bundle
            if (isClient) {
                config.target = 'electron-renderer'
            }
        }
    }
}
