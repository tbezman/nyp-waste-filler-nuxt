import Vue from 'vue';

import createPersistedState from 'vuex-persistedstate'
import PouchDB from 'pouchdb-browser'
import moment from 'moment';

Vue.mixin({
    methods: {
        async resetLogs() {
            await PouchDB('logs').destroy();

            this.logs = new PouchDB('logs', { adapter: 'websql' });
        },

        async resetDB() {
            await PouchDB('waste').destroy();

            this.db = new PouchDB('waste', { adapter: 'websql' });
        }
    }
});

Vue.filter('date', (input, format = '') => {
    return moment(input).format(format);
});

export default ({ store }) => {
    createPersistedState()(store)
}