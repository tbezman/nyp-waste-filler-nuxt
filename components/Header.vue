<template>
    <div class="row flex padded">
        <button @click="back">Back</button>
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import {Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        steps = [
            '/',
            '/waste-upload',
            '/waste-mapper',
            '/pdf-upload',
            '/pdf-layout',
            '/pdf-filler',
            '/done'
        ];

        back() {
            let index = this.steps.indexOf(this.$route.path);

            this.$router.push({path: this.steps[index - 1]});
        }
    }
</script>
