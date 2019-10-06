<template>
  <div>
    <div class="row flex space between padded">
      <button @click="back">Back</button>
      <button @click="resetToInitial">Reset Vials</button>
      <button @click="save">Save</button>
    </div>
    <div class="row flex" v-for="vial in vials">
      <div class="col-xs-3">
        <input type="text" v-model="vial.drug" />
      </div>
      <div class="col-xs-3">
        <input type="text" v-model="vial.vial_size" />
      </div>
      <div class="col-xs-3">
        <input type="text" v-model="vial.billable_units" />
      </div>
      <div class="col-xs-2">
        <input type="text" v-model="vial.unit" />
      </div>
      <div class="col-xs-1">
        <button @click="remove(vial)">X</button>
      </div>
    </div>
    <div class="row">
      <button @click="addVial" class="col-xs-6 AddButton">Add</button>
    </div>
  </div>
</template>

<style scoped>
.AddButton {
  margin: auto;
}
</style>

<script>
import Component, { State, Action } from "nuxt-class-component";
import Vue from "vue";

@Component({
  layout: "NoHeader"
})
export default class extends Vue {
  @State(state => state.vials.initialVials) initialVials;
  @Action("vials/save") saveVials;

  vials = [];

  mounted() {
    let foundVials;
    if (typeof window !== "undefined") {
      foundVials = JSON.parse(window.localStorage.getItem("vials"));
    }

    if (!foundVials) {
      foundVials = [...this.initialVials];
    }

    foundVials.sort((a, b) =>
      a.drug.toLowerCase().localeCompare(b.drug.toLowerCase())
    );

    this.vials = foundVials;
  }

  addVial() {
    this.vials = [...this.vials, {}];
  }

  resetToInitial() {
    this.vials = [...this.initialVials];
  }

  remove(vial) {
    this.vials = this.vials.filter(it => it !== vial);
  }

  back() {
    this.$router.back();
  }

  save() {
    this.saveVials(this.vials);
  }
}
</script>
