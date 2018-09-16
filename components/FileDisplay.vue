<template>
    <div class="row between">
        <p class="leggible">{{ fileName }}</p>
        <div class="actions">
            <i class="fa fa-times pointer pointer" @click="$emit('remove')">Remove</i>
        </div>
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import {Prop} from 'vue-property-decorator';

    @Component({})
    export default class FileDisplay extends Vue {
        @Prop() path;

        get fileName() {
            let split = this.path.split('/');

            return split[split.length - 1];
        }
    }
</script>
