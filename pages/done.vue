<template>
    <div>
        <div class="row center-xs">
            <div class="flex space around">
                <button
                        class="button"
                        @click="process"
                >Process
                </button>
                <button
                        class="button"
                        @click="downloadIncomplete"
                >Download Incomplete
                </button>
            </div>
        </div>
        <PdfRenderer :display="false" ref="renderer" :pdfs="pdfs" />
    </div>
</template>

<script>
    import Component, { State } from 'nuxt-class-component';
    import Vue from 'vue';

    import * as PDFJS from 'pdfjs-dist';
    import PdfRenderer from '../components/PdfRenderer';
    import { logToLayoutMap, wasted_units } from '../util/pdf-layout';
    import { BatchService } from '../util/batch';

    PDFJS.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

    @Component({
        components: { PdfRenderer }
    })
    export default class extends Vue {
        @State(state => state.session.pdfWaste) pdfWaste;
        @State(state => state.session.layout) layout;
        @State(state => state.session.campus) campus;

        pdfs = [];

        async mounted() {
            let all = await this.logs.allDocs();

            this.pdfs = await Promise.all(all.rows.map(async it => {
                return await (PDFJS.getDocument({ data: atob(it.id) }).promise);
            }));

            Vue.nextTick(() => this.$refs.renderer.renderCurrentPage());
        }

        complete() {
            return this.pdfWaste.filter(it => it.amount && it.vial && it.waste);
        }

        async downloadIncomplete() {
            const excluded = this.pdfWaste.map(it => ({ page: it.page, pdf: it.pdf }));

            const pdf = await this.$refs.renderer.getFullPDF([], excluded);

            pdf.save('Incomplete Logs.pdf');
        }

        async downloadComplete() {
            const included = this.complete()
                .map(it => ({ page: it.page, pdf: it.pdf }));

            const pdf = await this.$refs.renderer.getFullPDF([], null, included, ({ pdf, page }) => {
                const found = this.pdfWaste.find(it => it.pdf === pdf && page === it.page);
                console.log(found);

                if (found) return logToLayoutMap(found, this.layout);
            });

            pdf.save('Complete Logs.pdf');
        }

        async downloadExcelFile() {
            let fields = {
                'when': 'Date',
                'account_number': 'Account Number',
                'charge_code': 'Charge Code',
                'wasted_units': 'Wasted Units',
                'rate': 'Rate'
            };
            const rows = [Object.values(fields)];
            let csvContent = "data:text/csv;charset=utf-8,";

            rows.push(...this.complete().map(log => {
                if (!log.waste) return [];

                return Object.keys(fields).map(field => {
                    if (field === 'wasted_units') {
                        return wasted_units(log);
                    } else {
                        return log.waste[field]
                    }
                });
            }));

            // Make sure we remove ones that failed
            const filtered = rows.filter(cols => cols.length);

            filtered.forEach((rowArray) => {
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });

            window.location.assign(encodeURI(csvContent));
        }

        async downloadBatchFile() {
            new BatchService(this.complete()).save(this.campus);
        }

        async process() {
            await this.downloadComplete();

            await this.downloadExcelFile();

            await this.downloadBatchFile();
        }

        backup() {

        }
    }
</script>
