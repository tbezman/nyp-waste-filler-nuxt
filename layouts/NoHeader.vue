<template>
    <div>
        <div id="content">
            <nuxt />
        </div>
    </div>
</template>

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
