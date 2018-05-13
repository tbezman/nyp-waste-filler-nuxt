import Vue from 'vue';

import createPersistedState from 'vuex-persistedstate'
import PouchDB from 'pouchdb-browser'
import PouchDBFind from 'pouchdb-find';
import moment from 'moment';

PouchDB.plugin(PouchDBFind);

let db = new PouchDB('waste', { adapter: 'websql' });
let logs = new PouchDB('logs', { adapter: 'websql' });

Vue.mixin({
    data() {
        return { db, logs };
    },

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