<template>
  <div class="overlay layout">
    <figure>
      <h3 class="form_title overlay-title"><span v-html="getTitle"></span></h3>
      <div class="intro_text content overlay-description">
        <p>
          {{ data.description }}
        </p>
      </div>
      <blockquote class="overlay-name">
        {{ data.first_name }} {{ data.second_name }}
      </blockquote>
    </figure>
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Overlay extends Vue {
  @Prop()
  data;

  get title() {
    return this.data.title;
  }

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
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(19, 30, 39, 0.96);
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: auto;
  .overlay-title {
    margin-bottom: 60px;

    span {
      font-weight: 900;
      font-size: 24px;
      line-height: 30px;
      @include desktop {
        font-weight: 900;
        font-size: 42px;
        line-height: 42px;
      }
    }
  }
  .overlay-name {
    color: #fff;
    font-size: 20px;
    line-height: 18px;
  }

  .overlay-description {
    margin-bottom: 50px;
    // max-height: 40%;
    // overflow: auto;
  }
}
</style>
