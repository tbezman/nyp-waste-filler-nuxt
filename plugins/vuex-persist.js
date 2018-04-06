import createPersistedState from 'vuex-persistedstate'
import electron from 'electron';
import path from 'path';
import fs from 'fs';

const FILE_PATH = path.join(electron.remote.app.getPath('userData'), 'state.json');

export default ({store}) => {
    createPersistedState()(store)
}