<template>
    <div>
        <canvas class="vert-center" ref="canvas" width="475" height="600"></canvas>
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import { Prop } from 'vue-property-decorator';

    import {sum} from 'lodash';

    @Component({})
    export default class extends Vue {
        @Prop() pdfs;

        currentPDF = 0;
        currentPage = 1;

        get page() {
            return sum(this.pdfs
                .filter((it, index) => index < this.currentPDF)
                .map(it => it.numPages)) + this.currentPage;
        }

        get totalPages() {
             return sum(this.pdfs.map(it => it.numPages));
        }

        previous() {
            let pdf = this.pdfs[this.currentPDF];

            if(this.currentPage === 1) {
                let previous = this.currentPDF - 1;
                this.currentPDF = previous < 0 ? this.pdfs.length - 1 : previous;
                pdf = this.pdfs[this.currentPDF];

                this.currentPage = pdf.numPages;
            } else {
                this.currentPage--;
            }

            this.renderCurrentPage()
        }

        next() {
            let pdf = this.pdfs[this.currentPDF];

            if(this.currentPage === pdf.numPages) {
                let next = this.currentPDF + 1;
                this.currentPDF = next > this.pdfs.length - 1 ? 0 : next;
                this.currentPage = 1;
            } else {
                this.currentPage++;
            }

            this.renderCurrentPage()
        }

        async renderCurrentPage() {
            if (this.pdfs.length < 1) return;

            let pdf = this.pdfs[this.currentPDF];

            let page = await pdf.getPage(this.currentPage);

            await this.renderPage(page);
        }

        async renderPage(page) {
            let element = this.$refs.canvas;
            let canvasContext = element.getContext('2d');
            let viewport = page.getViewport(1);
            let scaledViewport = page.getViewport(element.width / viewport.width);

            canvasContext.width = viewport.width;
            canvasContext.height = viewport.height;

            await page.render({ canvasContext, viewport: scaledViewport });
        }
    }
</script>
