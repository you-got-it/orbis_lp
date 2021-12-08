<template>
  <h3 class="form_title">
    <span v-html="getTitle" style="white-space: pre-line"></span>
  </h3>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import MemoriesStore from "@/store/memoriesStore";
// import { getModule } from "vuex-module-decorators";
// import { gsap } from "gsap";

@Component
export default class Title extends Vue {
  @Prop()
  title;

  // get title() {
  //   return this.data.title;
  // }

  get getTitle() {
    const words = this.title.split(" ");
    let str = "";
    words.forEach((w, i) => {
      str += "<span>";
      str += w;
      str += "</span>";
      if (i < words.length - 1) {
        str += " ";
      }
    });
    return str;
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
</style>
