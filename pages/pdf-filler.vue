<template>
    <div id="root" class="flex">
        <div class="row">
            <PdfRenderer class="col-xs-5" ref="pdf" :pdfs="pdfs" />

            <DrugSearch @selected="selected" class="flex col-xs-7">
                <div v-if="waste && waste.vial">
                    <label>({{ waste.vial.drug }}) Wasted Amount({{ waste.vial.unit }})</label>
                    <select :value="waste.vial.drug" @change="e => waste.vial = vials.find(it => it.drug === e.target.value)">
                        <option v-for="vial in vials" :value="vial.drug">{{ vial.drug }}</option>
                    </select>
                    <input type="number" v-model="waste.amount">
                </div>
                <div class="col-xs-1" v-if="waste">
                    <button @click="update" class="button button-outline button-bottom-room">
                        Update
                    </button>
                </div>
            </DrugSearch>
        </div>
        <div class="row top-room">
            <div class="row col-xs-6">
                <div class="row center-xs middle-xs space around">
                    <h5 class="col-xs-3" :class="[waste ? waste.status : 'incomplete']">
                        {{ (waste ? waste.status : 'incomplete') | capitalize }}
                    </h5>
                    <h5 class="col-xs-4">
                        {{ $refs.pdf ? $refs.pdf.page : 0 }}
                        of
                        {{ $refs.pdf ? $refs.pdf.totalPages : 0 }}
                    </h5>
                </div>
                <div class="row space around">
                    <button @click="problem" class="button button-outline col-xs-3">
                        Problem
                    </button>
                    <button class="button button-outline col-xs-4">
                        Next Incomplete
                    </button>
                </div>
            </div>
            <div class="col-xs-6 space around top-room">
                <button type="button" name="button" @click="previous">&lt&lt Previous Log</button>
                <button type="button" name="button" @click="next">Next Log &gt&gt</button>
                <nuxt-link tag="button" to="/done" type="button" name="button">Next</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style>
    #root {
        width: 100vw;
    }
</style>

<script>
    import Component, { State, Mutation, Action } from 'nuxt-class-component';
    import Vue from 'vue';

    import { Watch } from 'vue-property-decorator';

    import PDFJS from 'pdfjs-dist/build/pdf';
    import levenshtein from 'fast-levenshtein';

    import DrugSearch from "../components/DrugSearch";
    import PdfRenderer from "../components/PdfRenderer";

    PDFJS.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

    import { sortBy } from 'lodash'

    @Component({
        components: { PdfRenderer, DrugSearch }
    })
    export default class extends Vue {
        @State(state => state.vials.vials) vials;
        @State(state => state.session.pdfWaste) pdfWaste;
        @Action('session/putWaste') putWaste;

        pdfs = [];

        waste = null;

        updateWaste() {
            let found = this.pdfWaste.find(it => it.pdf === this.$refs.pdf.currentPDF && it.page === this.$refs.pdf.currentPage);

            this.waste = found;
        }

        selected({ waste, only }) {
            let mapped = this.vials.map(it => ({
                vial: it,
                distance: levenshtein.get(it.drug.split(' ')[0], waste.charge_code_descriptor.split(' ')[0])
            }));

            let sorted = (sortBy(mapped, it => it.distance));
            console.log(sorted);
            let vial = sorted[0].vial;

            if(sorted[0].distance > 3) return;

            this.waste = { vial, amount: 0, waste, only_patient: only };
        }

        next() {
            this.$refs.pdf.next();

            this.updateWaste()
        }

        previous() {
            this.$refs.pdf.previous();

            this.updateWaste()
        }

        problem() {
            this.putWaste({ status: 'problematic', pdf: this.$refs.pdf.currentPDF, page: this.$refs.pdf.currentPage });

            this.next()
        }

        update() {
            this.putWaste({ ...this.waste, pdf: this.$refs.pdf.currentPDF, page: this.$refs.pdf.currentPage });

            this.next()
        }

        async mounted() {
            let all = await this.logs.allDocs();

            this.pdfs = await Promise.all(all.rows.map(async it => {
                return await (PDFJS.getDocument({ data: atob(it.id) }).promise);
            }));

            Vue.nextTick(() => {
                this.$refs.pdf.renderCurrentPage();

                this.updateWaste()
            })
        }
    }
</script>
