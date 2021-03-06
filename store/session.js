import { sum } from 'lodash';
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
    files(state, { name, files }) {
        state.files[name] = files;
    },
    worksheets(state, worksheets) {
        state.worksheets.push(...worksheets);
    },
    changeWorksheetMapping(state, { worksheet, column, value }) {
        state.worksheets = [...state.worksheets];

        worksheet.mappings[column] = value;
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
    addLayout(state, { key, data }) {
        state.layout[key] = data;
    }
};

export const actions = {
    chooseFiles({ commit, state }, { name, files }) {
        let fresh = state.files[name].slice();

        fresh.push(...files);

        commit('files', { name, files: fresh });
    },

    changeMapping({ commit, state }, { worksheet, column, value }) {
        commit('changeWorksheetMapping', { worksheet, column, value });

        console.log(worksheet.mappings);
    },

    removeFile({ commit, state }, { name, file }) {
        let files = state.files[name].slice();

        files.splice(files.indexOf(file), 1);

        commit('files', { name, files });
    },

    putWaste({ commit }, data) {
        if (!data.status) {
            data.status = 'done';
        }

        if (data.status === 'problematic') return commit('putWaste', data);

        // Continue on with waste processing
        let vial = data.vial;
        let sizes = vial.vial_size.toString().split(',').map(it => parseInt(it)).sort();
        let billable_units = parseFloat(vial.billable_units);
        let used = (parseFloat(data.waste.units) * billable_units);
        let allSizes = [];


        let best;

        sizes.forEach(size => {
            let worstCase = Math.ceil(used / size);

            for (let i = 0; i < worstCase; i++) {
                allSizes.push(size);
            }
        });

        console.log(data, used, allSizes);

        let combinations = Combinatorics.power(allSizes);
        let current;
        while (current = combinations.next()) {
            let total = sum(current);
            const amount = parseFloat(data.amount);
            const minimumOf = [total - used, sizes[0]];

            if (!data.only_patient) {
                minimumOf.push(amount);
            }

            let waste = Math.min(...minimumOf);

            if (total < used) continue;

            if (!best) {
                best = { total, waste, config: current };
                continue;
            }

            if (total < best.total) best = { total, config: current, waste }
        }

        console.log(best);

        data.config = best;
        commit('putWaste', data);
    }
};
