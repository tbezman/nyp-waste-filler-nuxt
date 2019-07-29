<template>
    <div>
        <canvas  :style="{display: display ? '': 'none'}" class="vert-center" ref="canvas"></canvas>
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import jsPDF from 'jspdf';

    import { Prop } from 'vue-property-decorator';

    import { sum } from 'lodash';

    @Component({})
    export default class extends Vue {
        @Prop() pdfs;
        @Prop({ default: true }) display;

        //Current PDF index in the supplied array
        currentPDF = 0;

        // Current page number in the current pdf, first page is 1, not 0
        currentPage = 1;

        // Current PDF JS Page object
        currentPDFPage = null;

        get page() {
            return sum(this.pdfs
                .filter((it, index) => index < this.currentPDF)
                .map(it => it.numPages)) + this.currentPage;
        }

        get totalPages() {
            return sum(this.pdfs.map(it => it.numPages));
        }

        async previous() {
            let pdf = this.pdfs[this.currentPDF];

            if (this.currentPage === 1) {
                let previous = this.currentPDF - 1;
                this.currentPDF = previous < 0 ? this.pdfs.length - 1 : previous;
                pdf = this.pdfs[this.currentPDF];

                this.currentPage = pdf.numPages;
            } else {
                this.currentPage--;
            }

            await this.renderCurrentPage()
        }

        async next() {
            let pdf = this.pdfs[this.currentPDF];

            if (this.currentPage === pdf.numPages) {
                let next = this.currentPDF + 1;
                this.currentPDF = next > this.pdfs.length - 1 ? 0 : next;
                this.currentPage = 1;
            } else {
                this.currentPage++;
            }

            await this.renderCurrentPage()
        }

        async renderCurrentPage() {
            if (this.pdfs.length < 1) return;

            let pdf = this.pdfs[this.currentPDF];

            let page = await pdf.getPage(this.currentPage);

            await this.renderPage(page);
        }

        async renderPage(page) {
            this.currentPDFPage = page;

            let element = this.$refs.canvas;
            let container = element.parentNode;
            let canvasContext = element.getContext('2d');
            let viewport = page.getViewport(1);
            let scale = container.clientWidth / viewport.width;
            viewport = page.getViewport(scale);

            element.height = viewport.height;
            element.width = viewport.width;

            await page.render({ canvasContext, viewport: viewport });
        }

        async getFullPDF(text = [], excluded, included, renderer = null) {
            this.currentPage = 1;
            this.currentPDF = 0;

            await this.renderCurrentPage();

            const pdf = new jsPDF('p', 'mm', [this.$refs.canvas.width, this.$refs.canvas.height]);

            let current;
            for (current = 0; current < this.totalPages; current++) {
                let skip = false;

                if (excluded) {
                    skip = excluded.some(it => it.pdf === this.currentPDF && it.page === this.currentPage);
                }

                if (included) {
                    skip = !included.some(it => it.pdf === this.currentPDF && it.page === this.currentPage);
                }

                if (skip) {
                    await this.next();
                    continue;
                }

                if (renderer) {
                    const layouts = renderer({ page: this.currentPage, pdf: this.currentPDF });

                    if (layouts) {
                        for(const layout of layouts) {
                            let element = this.$refs.canvas;
                            let container = element.parentNode;
                            let context = element.getContext('2d');
                            let viewport = this.currentPDFPage.getViewport(1);
                            let scale = container.clientWidth / viewport.width;
                            viewport = this.currentPDFPage.getViewport(scale);

                            context.font = "40px Roboto";
                            context.fillText(layout.text, layout.x * viewport.width, layout.y * viewport.height);
                        }
                    }
                }
                const page = pdf.addPage();
                const image = this.$refs.canvas.toDataURL('image/jpeg');

                page.addImage(image, 'JPEG', 0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

                await this.next();
            }

            return pdf;
        }
    }
</script>
