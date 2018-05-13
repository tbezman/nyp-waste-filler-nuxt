module.exports = {
    /*
    ** Electron Settings
    */
    electron: {
        width: 1024,
        height: 768
    },

    css: ['~/assets/css/animate.css', '~/assets/css/main.scss', '~/assets/css/flexboxgrid.css', '~/assets/css/milligram.css', 'font-awesome/css/font-awesome.css'],

    mode: 'spa',

    plugins: ['~/plugins/vuex-persist', '~/plugins/vue2-filters'],

    build: {
        babel: {
            plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-flow-strip-types'],
            presets: ['stage-0']
        },

        extend(config, {isClient}) {
            // Extend only webpack config for client-bundle
            if (isClient) {
                config.target = 'electron-renderer'
            }
        }
    }
}
