<template>
  <header :class="['header', 'ui']">
    <img src="@/assets/images/logo.svg" alt="" class="header-logo" />
    <div class="header-right">
      <nav class="header-nav">
        <ul>
          <li class="header-nav-item">
            <router-link to="memories" class="header__menu-link">
              MEMORIES
            </router-link>
          </li>
          <li class="header-nav-item">
            <router-link to="info" class="header__menu-link">
              LEARN MORE
            </router-link>
          </li>
          <li class="header-nav-item"><a href="">SHARE YOUR MEMORY</a></li>
        </ul>
      </nav>
      <img
        class="header-close"
        @click="closeClick"
        src="@/assets/images/close.svg"
      />
    </div>
  </header>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MemoriesStore from "@/store/memoriesStore";
import { getModule } from "vuex-module-decorators";
import { gsap } from "gsap";

@Component
export default class Header extends Vue {
  get memoriesStore() {
    return getModule(MemoriesStore, this.$store);
  }
  get overlayId() {
    return this.memoriesStore.overlayId;
  }

  closeClick() {
    this.memoriesStore.setOverlayId(-1);
  }

  @Watch("overlayId") setOverlayAnim() {
    if (this.overlayId !== -1) {
      gsap.to(".header-nav-item", {
        duration: 0.4,
        autoAlpha: 0,
        x: -250,
        stagger: 0.1,
        ease: "sine.inOut",
      });
      gsap.to(".header-close", {
        duration: 0.7,
        rotate: 0,
        scale: 1,
        delay: 0.2,
        ease: "power3.out",
      });
    } else {
      gsap.to(".header-nav-item", {
        duration: 0.3,
        autoAlpha: 1,
        x: 0,
        stagger: -0.06,
        delay: 0.4,
        ease: "sine.inOut",
      });
      gsap.to(".header-close", {
        duration: 0.7,
        rotate: -260,
        scale: 0,
        ease: "power3.in",
      });
    }
  }

  mounted() {
    //
    this.$nextTick(() => {
      gsap.set([".header-close"], {
        rotate: -260,
        scale: 0,
      });
    });
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
@import "~@/assets/scss/basic/fonts";
.header {
  z-index: 3;
  position: absolute;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  box-sizing: border-box;
  .header-nav {
    & ul {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .header-nav-item {
    margin-left: 40px;
    pointer-events: all;
  }
  .header-logo {
    pointer-events: all;
  }
  .header-right {
    position: relative;
  }
  .header-close {
    position: absolute;
    right: 0;
    top: -14px;
    padding: 10px;
    pointer-events: all;
    cursor: pointer;
  }
  a {
    @include font($font-alright-normal);
    color: $cYellow;
    font-size: 20px;
    line-height: 18px;
    font-weight: bold;
  }
}
</style>
