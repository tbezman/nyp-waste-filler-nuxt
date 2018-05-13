import {sum} from 'lodash';
import Combinatorics from 'js-combinatorics';

export const state = () => ({
    campus: 'east',
    files: {
        waste: [],
        logs: []
    },
    layout: {},
    importedLogs: false,
    worksheets: [],
    pdfWaste: []
});

export const mutations = {
    campus(state, campus) {
        state.campus = campus;
    },
    files(state, {name, files}) {
        state.files[name] = files;
    },
    worksheets(state, worksheets) {
        state.worksheets.push(...worksheets);
    },
    clearWorksheets(state) {
        state.worksheets = [];
    },
    putWaste(state, data) {
        state.pdfWaste = state.pdfWaste.filter(it => !(it.pdf === data.pdf && it.page === data.page));

        state.pdfWaste.push(data);
    },
    clearLayout(state) {
        state.layout = {};
    },
    addLayout(state, {key, data}) {
        state.layout[key] = data;
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

    putWaste({commit}, data) {
        if(!data.status) {
            data.status = 'done';
        }

        if(data.status === 'problematic') return commit('putWaste', data);

        // Continue on with waste processing
        let vial = data.vial;
        let sizes = vial.vial_size.split(',').map(it => parseInt(it));
        let allSizes = [];

        let best;

        sizes.forEach(size => {
            let worstCase = Math.ceil(data.amount / size);

            for (let i = 0; i < worstCase; i++) {
                allSizes.push(size);
            }
        });

        let combinations = Combinatorics.power(allSizes);
        let current;
        while(current = combinations.next()) {
            let total = sum(current);

            if(total < data.amount) continue;

            if(!best) {
                best = {total, config: current};
                continue;
            }

            if(total < best.total) best = {total, config: current}
        }

        data.config = best;
        commit('putWaste', data);
    }
};