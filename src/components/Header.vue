<template>
  <header :class="['header', 'ui', { _menu: showMenu }]">
    <router-link to="memories" class="header__menu-link header__menu-logo">
      <img src="@/assets/images/logo.svg" alt="" class="header-logo" />
    </router-link>
    <div :class="['header-right', { _hidden: showIntro }]">
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
          <li class="header-nav-item">
            <router-link to="share" class="header__menu-link">
              SHARE YOUR MEMORY
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <img
      class="header-close"
      @click="closeClick"
      src="@/assets/images/close.svg"
    />
    <img
      class="header-burger"
      @click="burgerClick"
      src="@/assets/images/burger.svg"
    />
    <div class="header-mobile">
      <img src="@/assets/images/logo.svg" alt="" class="header-logo" />
      <nav class="header-mobile-nav">
        <ul>
          <li class="header-nav-item">
            <router-link
              to="memories"
              @click.native="closeClick"
              class="header__menu-link"
            >
              MEMORIES
            </router-link>
          </li>
          <li class="header-nav-item">
            <router-link
              to="info"
              @click.native="closeClick"
              class="header__menu-link"
            >
              LEARN MORE
            </router-link>
          </li>
          <li class="header-nav-item">
            <router-link
              to="share"
              @click.native="closeClick"
              class="header__menu-link"
            >
              SHARE YOUR MEMORY
            </router-link>
          </li>
        </ul>
      </nav>
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
  @Prop()
  showIntro;

  get showMenu() {
    return this.memoriesStore.showMenu;
  }

  get memoriesStore() {
    return getModule(MemoriesStore, this.$store);
  }
  get overlayId() {
    return this.memoriesStore.overlayId;
  }

  closeClick() {
    console.log("!!!WWW");
    if (this.showMenu) {
      this.hideCloseButton();
      this.memoriesStore.setShowMenu(false);
      return;
    }
    this.memoriesStore.setOverlayId(-1);
  }

  burgerClick() {
    gsap.fromTo(
      ".header-close",
      {
        duration: 0.7,
        rotate: -260,
        scale: 0,
        ease: "power3.in",
      },
      {
        duration: 0.7,
        rotate: 0,
        scale: 1,
        delay: 0.2,
        ease: "power3.out",
      }
    );
    this.memoriesStore.setShowMenu(true);
  }

  @Watch("overlayId") setOverlayAnim() {
    if (this.overlayId !== -1) {
      gsap.to(".header-nav-item", {
        duration: 0.4,
        autoAlpha: 0,
        //x: -250,
        stagger: 0.02,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        ".header-close",
        {
          duration: 0.7,
          rotate: -260,
          scale: 0,
          ease: "power3.in",
        },
        {
          duration: 0.7,
          rotate: 0,
          scale: 1,
          delay: 0.2,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(".header-nav-item", {
        duration: 0.3,
        autoAlpha: 1,
        //x: 0,
        stagger: -0.02,
        delay: 0.4,
        ease: "sine.inOut",
      });
      this.hideCloseButton();
    }
  }

  hideCloseButton() {
    gsap.fromTo(
      ".header-close",
      {
        rotate: 0,
        scale: 1,
        delay: 0.2,
      },
      {
        duration: 0.5,
        rotate: -260,
        scale: 0,
        ease: "power3.in",
      }
    );
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
._hidden {
  opacity: 0;
  visibility: hidden;
}
.header__menu-logo {
  opacity: 1 !important;
}

.header-mobile {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #142636;
  margin: -30px;
  padding: inherit;
  display: none;
  flex-direction: column;
  ._menu & {
    display: flex;
  }
  .header-mobile-nav {
    margin-left: -30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .header-nav-item {
    margin: 1em 0;
  }
}

.header {
  z-index: 3;
  position: absolute;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  box-sizing: border-box;
  .header-nav {
    display: none;
    @include desktop {
      display: block;
    }
    & ul {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .header-nav-item {
    pointer-events: all;
    @include desktop {
      margin-left: 40px;
    }
  }
  .header-logo {
    pointer-events: all;
    width: 89px;
    flex-shrink: 0;
    @include desktop {
      width: 133px;
    }
  }
  .header-right {
    position: relative;
    transition: 0.4s;
    transition-property: opacity, visible;
  }
  .header-close {
    position: fixed;
    right: 34px;
    top: 34px;
    padding: 10px;
    pointer-events: all;
    cursor: pointer;
    z-index: 1;
    @include desktop {
      right: 60px;
      top: 66px;
    }
  }

  &-burger {
    position: absolute;
    right: 26px;
    top: 26px;
    padding: 10px;
    pointer-events: all;
    cursor: pointer;
    transform: scale(1);
    transition: 0.3s transform 0.4s;
    ._menu & {
      transform: scale(0);
    }
    @include desktop {
      display: none;
    }
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
