<template>
  <div class="overlay layout">
    <figure v-if="data">
      <!-- <h3 class="form_title overlay-title"><span v-html="getTitle"></span></h3> -->
      <Title :title="data.title" />
      <div class="intro_text content overlay-description">
        <p>
          {{ data.description }}
        </p>
      </div>
      <blockquote class="overlay-name">
        {{ data.first_name }} {{ String(data.second_name).charAt(0) }}
      </blockquote>
    </figure>
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import Title from "@/components/Title.vue";

@Component({
  components: {
    Title,
  },
})
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

/deep/.form_title {
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

.overlay {
  position: absolute;
  background-color: rgba(19, 30, 39, 0.96);
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: flex-start;
  padding: 150px 40px 40px;
  @include tablet {
    padding: 120px 140px 40px;
    justify-content: center;
    position: fixed;
    height: 100%;
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
  .figure {
    width: 100%;
  }
  figure {
    margin: 0;
  }
}
</style>
