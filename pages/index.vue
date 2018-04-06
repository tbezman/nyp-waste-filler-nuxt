<template>
    <div class="row flex-column middle-xs center-xs flex">
        <div>
            <h3>Welcome to the Auto Waste Log Filler</h3>
            <div class="container">
                <h6>Press Next To Continue</h6>
            </div>
        </div>

        <div class="row flex-rest center-xs middle-xs">
            <div class="col-xs-4">
                <p class="leggible">
                    Please choose which campus you are doing waste for.
                </p>
                <select :value="campus" @change="e => updateCampus(e.target.value)">
                    <option v-for="campus in campuses">{{ campus }}</option>
                </select>
            </div>
        </div>

        <div class="row bottom-xs column column-offset-75">
            <nuxt-link :to="'/waste-upload'" tag="button" ui-sref="waste-upload">Next</nuxt-link>
        </div>
    </div>
</template>

<script>
    import Component, {State, Mutation} from 'nuxt-class-component';
    import Vue from 'vue';

    import {Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        campuses = ['east', 'west'];

        @State(state => state.session.campus) campus;
        @Mutation('session/campus') updateCampus;

    }
</script>

