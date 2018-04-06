export const state = () => ({
    campus: 'east',
    files: {
        waste: [],
        logs: []
    },
    worksheets: []
});

export const mutations = {
    campus(state, campus) {
        state.campus = campus;
    },
    files(state, {name, files}) {
        state.files[name] = files;
    },
    worksheets(state, worksheets) {
        state.worksheets = worksheets;
    }
};

export const actions = {
    chooseFiles({commit, state}, {name, files}) {
        let fresh = state.files[name].slice();

        fresh.push(...files);

        commit('files', {name, files: fresh});
    },

    removeFile({commit, state}, {name, file}) {
        let files = state.files[name].slice();

        files.splice(files.indexOf(file), 1);

        commit('files', {name, files});
    },
};