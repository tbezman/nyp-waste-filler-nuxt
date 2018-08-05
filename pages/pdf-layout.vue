<template>
    <div class="row flex">
        <div class="col-xs-3">
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
    import { rawTitles, rawTitlesForCampus, specialTitles } from '../util/constants';

    PDFJS.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

    @Component({})
    export default class extends Vue {
        @State(state => state.session.campus) campus;
        @State(state => state.session.layout) layout;
        @Mutation('session/addLayout') addLayout;
        @Mutation('session/clearLayout') clearLayout;

        ignoredPerCampus = {
            'east': [],
            'west': ['patient_number']
        };

        selected = Object.keys(rawTitles)[0];

        get databaseTitles() {
            console.log(rawTitlesForCampus((this.campus)));
            return {
                ...rawTitlesForCampus(this.campus),
                ...specialTitles
            };
        }

        reset() {
            this.clearLayout();
            this.clearRender();
        }

        mounted() {
            this.clearRender();
        }

        async clearRender() {
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
            let container = element.parentNode;
            let canvasContext = element.getContext('2d');
            let viewport = page.getViewport(1);
            let scale = container.clientWidth / viewport.width;
            viewport = page.getViewport(scale);

            element.height = viewport.height;
            element.width = viewport.width;

            await page.render({ canvasContext, viewport: viewport });

            return {
                canvasContext,
                viewport
            };
        }

        setupCanvasListeners(renderContext) {
            let context = renderContext.canvasContext;
            let viewport = renderContext.viewport;

            context.font = "40px Roboto";

            this.$refs.canvas.onclick = event => {
                let x = event.offsetX;
                let y = event.offsetY;

                context.fillText(this.databaseTitles[this.selected], x, y);

                this.addLayout({key: this.selected, data: { x: x / viewport.width, y: y / viewport.height }});
            }
        }
    }
</script>
