<template>
    <div>
        <Header />
        <div id="content">
            <nuxt />
        </div>
    </div>
</template>

<style scoped>
    #content {
        height: 100vh;
        width: 100vw;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
</style>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import { Prop } from 'vue-property-decorator';
    import Header from "../components/Header";

    @Component({
        components: { Header }
    })
    export default class extends Vue {

    }
</script>
