<template>
    <div class="flex flex-column space around top-room">
        <div class="row center-xs">
            <h4>Here is where you will translate your columns to ours.</h4>
        </div>

        <div class="row center-xs">
            <p class="leggible">
                Below is a list of inputs with a constant label. Your next step is to choose from the list beneath the
                label which column from your excel sheet is associated with the given label.
            </p>
        </div>

        <div class="row center-xs">
            <div class="row center-xs flex-column space around">
                <h6>Working on sheet {{ worksheet.worksheet }} for file {{ worksheet.path }}</h6>

                <button class="button" @click="previousWorksheet">Previous</button>
                <button class="button" @click="nextWorksheet">Next</button>
            </div>

            <div class="row pin bottom top-room">
                <div class="padded" v-for="(title, column) in databaseTitles">
                    <label>{{ title }}</label>
                    <select v-model="worksheet.mappings[column]">
                        <option v-for="sheetColumn in worksheet.headers">{{ sheetColumn }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row around-xs">
            <button class="button" @click="next" :class="{'button-outline': !ready}" :disabled="!ready">Import</button>
        </div>

        <Spinner v-if="spinning" />
    </div>
</template>

<script>
    import Component, {Action, State, Mutation} from 'nuxt-class-component';
    import Vue from 'vue';

    import {ipcRenderer} from 'electron';

    import FileDisplay from "../components/FileDisplay";
    import Spinner from "../components/Spinner";

    @Component({
        components: {Spinner, FileDisplay}
    })
    export default class extends Vue {
        @State(state => state.session.worksheets) worksheets;
        @State(state => state.session.campus) campus;

        spinning = false;

        currentIndex = 0;

        rawDatabaseTitles = {
            'patient_number': 'Patient Number',
            'mrn': 'MRN',
            'account_number': 'Account Number',
            'charge_code': 'Charge Code',
            'charge_code_descriptor': 'Charge Code Descriptor',
            'units': 'Units',
            'rate': 'Rate',
            'date': 'Date',
            'time': 'Time'
        };

        ignoredPerCampus = {
            'east': [],
            'west': ['patient_number']
        };

        mounted() {
            ipcRenderer.on('imported', (event, logs) => {
                this.spinning = false;

                this.db.bulkDocs(logs);

                this.$router.push('/pdf-upload')
            });
        }

        get databaseTitles() {
            const filtered = {};

            for (const key in this.rawDatabaseTitles) {
                if (this.ignoredPerCampus[this.campus].indexOf(key) === -1)
                    filtered[key] = this.rawDatabaseTitles[key];
            }

            return filtered;
        }

        get worksheet() {
            if (!this.worksheets) return null;

            return this.worksheets[this.currentIndex];
        }

        get ready() {
            return !this.worksheets.some(worksheet => {
                return Object.keys(worksheet.mappings).length < Object.keys(this.databaseTitles).length;
            });
        }

        async next() {
            this.spinning = true;

            await this.resetDB();

            ipcRenderer.send('import', this.worksheets);
        }

        previousWorksheet() {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
        }

        nextWorksheet() {
            this.currentIndex = Math.min(this.worksheets.length - 1, this.currentIndex + 1);
        }
    }
</script>
