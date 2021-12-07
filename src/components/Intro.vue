<template>
  <div class="intro">
    <img src="@/assets/images/logo.svg" alt="" class="header-logo" />
    <div class="intro-showcase">
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          height: 30%;
          width: 100%;
          background-image: linear-gradient(180deg, #0c1f2f, transparent);
        "
      ></div>
      <video
        class="intro_video"
        :src="`${publicPath}video/hero-video.mp4`"
        loop
        muted
        autoplay
        playsinline
        :poster="`${publicPath}img/hero-video-cover.jpg`"
      ></video>
    </div>
    <div class="button intro-skip" @click="$emit('skipIntro')">skip</div>
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Overlay extends Vue {
  get publicPath() {
    return process.env.BASE_URL;
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";

.header-logo {
  position: fixed;
  z-index: 1;
  top: 30px;
  left: 30px;
  pointer-events: all;
  width: 89px;
  flex-shrink: 0;
  @include desktop {
    width: 133px;
    top: 82px;
    left: 82px;
  }
}

.intro {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #0c1f2f;
  z-index: 3;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  overflow: hidden;
  top: 0;
  left: 0;

  &-showcase {
    display: flex;
    position: relative;
    justify-content: center;
    max-height: 100%;
  }

  .intro-skip {
    position: absolute;
    bottom: 30px;
    opacity: 1 !important;
    &:hover {
      opacity: 0.85 !important;
    }

    @include desktop {
      bottom: 6%;
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

  &_video {
    display: block;
    width: 230%;
    //position: absolute;
    //bottom: 0;
    //left: 50%;
    max-height: 110%;
    height: auto;
    margin: 0;
    transform: none;
    @include tablet {
      width: 140%;
      //margin: auto;
      //transform: none;
    }
    @include desktop {
      width: 110%;
    }
  }
}
</style>
