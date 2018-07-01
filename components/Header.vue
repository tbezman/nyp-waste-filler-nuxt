<template>
    <div class="row flex padded">
        <button @click="back">Back</button>
    </div>
</template>

<style>
spinner{text-align:center;z-index:999}spinner > svg{top:50%;left:50vw;transform:translateY(-50%) translateX(-50%);position:relative}spinner > .background{background-color:rgba(238,238,238,.67);top:0;width:100%;height:100%;position:fixed}.done{color:green}.incomplete{color:#a68f0a}.problematic{color:#a00018}.button-bottom-room{position:relative;bottom:5px}#searchButton{position:relative;bottom:5px}.pointer{cursor:pointer}.selectable{cursor:pointer}.selectable:hover{background-color:#eee}.invisible{visibility:hidden}.vert-center{position:relative;top:50%;transform:translateY(-50%)}.drug-table{height:calc(100vh - 400px);overflow:auto}.selected{background-color:rgba(155,77,202,.18)}.strange{background-color:rgba(255,57,77,.55)}a{text-decoration:none}.animate.ng-hide-add{animation:.5s fadeOutUp ease}.animate.ng-hide-remove{animation:.5s fadeInUp ease}.container{text-align:center}.subtitle{color:gray}ui-view{height:100%;width:100%}div.flex{height:100%}.flex-width{width:100%}.leggible{width:60rem;text-align:left}div.row{padding-left:50px;padding-right:50px}.padded{padding:10px}work-flow .header{height:40px}work-flow .content{height:calc(100% - 40px)}.flex-column{display:flex;flex-flow:column;height:100%}.flex-column .flex-rest{flex:1 1 auto;position:relative}.pin.bottom{display:flex;align-items:flex-end;flex-grow:1}.space.between{display:flex;justify-content:space-between;flex-grow:1}.space.around{display:flex;justify-content:space-around;flex-grow:1}.top-room{padding-top:15px}.hr-line{height:2px;background-color:#eee;width:100%}.progress-outer{background-color:#eee}.progress-inner{background-color:purple}
</style>


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
