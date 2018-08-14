module.exports = {

    css: ['~/assets/css/animate.css', '~/assets/css/flexboxgrid.css', '~/assets/css/main.css', '~/assets/css/milligram.css'],

    plugins: [
        { src: '~/plugins/vuex-persist', ssr: false },
        { src: '~/plugins/vue2-filters', ssr: false },
        { src: '~/plugins/vue-pouchdb', ssr: false }
    ],

    loading: false,

    dev: true,

    mode: 'spa',

    build: {
        babel: {
            plugins: ['transform-decorators-legacy', 'transform-class-properties'],
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
