<template>
    <div id="container" class="flex space around">
        <DotLoader id="spinner" :color="'purple'"/>
    </div>
</template>

<style scoped lang="scss">
    #container {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;

        text-align: center;

        background-color: rgba(0, 0, 0, .5);
    }

    #spinner {
        position: relative;
        top: 50%;
    }
</style>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import {Prop} from 'vue-property-decorator';

    import DotLoader from 'vue-spinner/src/DotLoader.vue';

    @Component({
        components: {DotLoader}
    })
    export default class extends Vue {

    }
</script>
