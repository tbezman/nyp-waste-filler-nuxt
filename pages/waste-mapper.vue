<template>
    <div class="flex flex-column space around top-room">
        <div class="row center-xs">
            <h4>Here is where you will translate your columns to ours.</h4>
        </div>

        <div class="row center-xs">
            <p class="leggible">
                Below is a list of inputs with a constant label. Your next step is to choose from the list beneath the
                label which column from your excel sheet is associated with the given label.
            </p>

            <div class="row pin bottom top-room">
                <div class="padded">
                    <label>{{ name }}</label>
                    <select>
                        <!--<option value="{{ fileColumn }}" ng-repeat="(index, fileColumn) in waste.fileColumns">{{ fileColumn }}</option>-->
                    </select>
                </div>
            </div>
        </div>

        <div class="row around-xs">
            <button @click="selectFile" :class="{'button-outline': uploaded}">Select Files</button>
            <button class="button" ng-class="{'button-outline': !waste.excelReady}" ng-disabled="!waste.isReady()"
                    ng-click="waste.next()">Next
            </button>
        </div>

    </div>
</template>

<script>
    const {dialog} = require('electron').remote;
    import Component, {Action, State} from 'nuxt-class-component';
    import Vue from 'vue';

    import {Prop, Watch} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
    }
</script>
