<template>
    <div>
        <div class="row center-xs">
            <div class="flex space around">
                <button class="button" @click="process">Process</button>
                <button class="button" @click="backup">Backup Data</button>
            </div>
        </div>
        <canvas id="canvas" width="600" height="1000"></canvas>
        <img />
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import { Prop } from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        process() {

        }

        backup() {

        }
    }
</script>
