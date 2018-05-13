<template>
    <div class="row flex">
        <div class="col-xs-7">
            <canvas ref="canvas" width="600" height="700"></canvas>
        </div>
        <div class="flex flex-column col-xs-5">
            <div class="top-room col-xs-8 col-xs-offset-2">
                <div v-for="(name, db) in databaseTitles">
                    <button @click="selected = db" :class="{'button-outline': db !== selected}"
                            class="button flex-width">
                        {{ name }}
                    </button>
                </div>
            </div>

            <div class="space between">
                <button @click="reset" type="button" class="button button-outline">Reset Layout</button>
                <nuxt-link tag="button" to="/pdf-filler" type="button" name="button">Next</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
    import Component, { State, Mutation } from 'nuxt-class-component';
    import Vue from 'vue';

    import { Prop } from 'vue-property-decorator';

    import PDFJS from 'pdfjs-dist';

    PDFJS.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

    @Component({})
    export default class extends Vue {
        @State(state => state.session.campus) campus;
        @State(state => state.session.layout) layout;
        @Mutation('session/addLayout') addLayout;
        @Mutation('session/clearLayout') clearLayout;

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

        selected = Object.keys(this.rawDatabaseTitles)[0];

        get databaseTitles() {
            const filtered = {};

            for (const key in this.rawDatabaseTitles) {
                if (this.ignoredPerCampus[this.campus].indexOf(key) === -1)
                    filtered[key] = this.rawDatabaseTitles[key];
            }

            return {
                ...filtered,
                'charge': "Charge",
                'vial_config': 'Vial Config',
                'entered_waste': 'Entered Waste'
            };
        }

        reset() {
            this.clearLayout();
            this.reRender();
        }

        mounted() {
           this.reRender()
        }

        async reRender() {
            let all = await this.logs.allDocs();

            this.pdfs = await Promise.all(all.rows.map(async it => {
                return await (PDFJS.getDocument({ data: atob(it.id) }).promise);
            }));

            let context = await this.renderPage(await this.pdfs[0].getPage(1));

            this.setupCanvasListeners(context);

            for(const key in this.layout) {
                let formatted = this.databaseTitles[key];
                let data = this.layout[key];
                let viewport = context.viewport;

                context.canvasContext.fillText(formatted, data.x * viewport.width, data.y * viewport.height);
            }
        }

        async renderPage(page) {
            let element = this.$refs.canvas;
            let canvasContext = element.getContext('2d');
            let viewport = page.getViewport(1);
            let scaledViewport = page.getViewport(element.width / viewport.width);

            canvasContext.width = viewport.width;
            canvasContext.height = viewport.height;

            await page.render({ canvasContext, viewport: scaledViewport });

            return {
                canvasContext,
                viewport: scaledViewport
            };
        }

        setupCanvasListeners(renderContext) {
            let context = renderContext.canvasContext;
            let viewport = renderContext.viewport;

            context.font = "20px Roboto";

            this.$refs.canvas.onclick = event => {
                let x = event.offsetX;
                let y = event.offsetY;

                context.fillText(this.databaseTitles[this.selected], x, y);

                this.addLayout({key: this.selected, data: { x: x / viewport.width, y: y / viewport.height }});
            }
        }
    }
</script>
