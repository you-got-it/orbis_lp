<template>
  <header class="header ui">
    <img src="@/assets/images/logo.svg" alt="" class="header-logo" />
    <nav class="header-nav">
      <ul>
        <li class="header-nav-item">
          <!-- <router-link to="memories" class="header__menu-link"> -->
          <a href=""> MEMORIES </a>
          <!-- </router-link> -->
        </li>
        <li class="header-nav-item"><a href="">LEARN MORE</a></li>
        <li class="header-nav-item"><a href="">SHARE YOUR MEMORY</a></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
.header {
  z-index: 2;
  position: absolute;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
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
}
</style>
