import Vue from 'vue';

import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

export default () => {
    PouchDB.plugin(PouchDBFind);

    let db = new PouchDB('waste', { adapter: 'websql' });
    let logs = new PouchDB('logs', { adapter: 'websql' });

    Vue.mixin({
        data() {
            return {db, logs};
        }
    })
}