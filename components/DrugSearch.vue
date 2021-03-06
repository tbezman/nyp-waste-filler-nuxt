<template>
    <div>
        <form @submit.prevent="search(query)" class="row bottom-xs space between">
            <div class="col-xs-4">
                <label>Drug</label>
                <input type="text" v-model="query">
            </div>
            <div class="col-xs-4">
                <label>Date</label>
                <MaskedInput type="text" mask="11/11/1111" v-model="date" />
            </div>
            <div>
                <button @click="search(query)">Search</button>
            </div>
        </form>

        <div class="row center-xs bottom-xs">
            <slot name="default" />
        </div>

        <div class="drug-table">
            <table>
                <thead>
                <th>Drug</th>
                <th>Date/Time</th>
                    <th>MRN</th>
                <th>Units</th>
                <th>Description</th>
                <th>Actions</th>
                </thead>
                <tbody>
                <tr class="selected" v-if="selected">
                    <td>{{ selected.waste.charge_code_descriptor }}</td>
                    <td>{{ selected.waste.when }}</td>
                    <td>{{ selected.waste.mrn }}</td>
                    <td>{{ selected.waste.units }}</td>
                    <td>NA</td>
                </tr>
                <tr class="selectable" v-for="result in results" :key="result.id">
                    <td>{{ result.timestamp}}</td>
                    <td>{{ result.when }}</td>
                    <td>{{ result.mrn }}</td>
                    <td>{{ result.units }}</td>
                    <td>{{ result.charge_code_descriptor }}</td>
                    <td class="row flex center-xs around-xs">
                        <button @click="select(result, false)" type="button" name="button">
                            Select
                        </button>
                        <button @click="select(result, true)" type="button" name="button">
                            Only Patient
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import Component from 'nuxt-class-component';
    import Vue from 'vue';

    import moment from 'moment';
    import {sortBy} from 'lodash';

    import MaskedInput from "vue-masked-input";

    import { Prop } from 'vue-property-decorator';

    @Component({
        components: { MaskedInput }
    })
    export default class extends Vue {

        date = '';
        query = '';
        results = [];

        @Prop() selected;

        select(result, only = false) {
            this.$emit('selected', {waste: result, only});
        }

        async search(drug) {
            this.$emit('onStatus', true);

            try {
                let result = await this.db.find({
                    selector: {
                        'charge_code_descriptor': {
                            $regex: new RegExp('.*' + drug + '.*', 'i')
                        }
                    }
                });

                this.results = result.docs.map(it => {
                    return { ...it, when: moment(it.when).format('MM/DD/YYYY H:mm A'), timestamp: it.when }
                }).filter(it => {
                    if(!this.date) return true;
                    let date = moment(this.date);
                    let when = moment(it.timestamp);

                    if(!date) return true;

                    return when.get('year') === date.get('year') &&
                            when.get('date') === date.get('date') &&
                            when.get('month') === date.get('month')

                });

                this.results = sortBy(this.results, it => it.timestamp);
            } catch (e) {
                console.error(e);
            } finally {
                this.$emit('onStatus', false);
            }

        }

    }
</script>
