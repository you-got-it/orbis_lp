<template>
  <div id="app">
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
    <div class="overlay">
      <div class="overlay-title">I’d see my 3 children & 2 Grandsons</div>
      <div class="overlay-story">
        It would be magical, my stomach would be turning with excitement at the
        thought of seeing all of their smiling faces. I would be excited at
        seeing how much my Grandsons had grown and changed in those 3 years,are
        they taller, have their faces changed, had logans hair darkened, Is
        Aiden taller then me now. Do my children look older now then I remember
        them looking.
      </div>
      <div class="overlay-name">Angela</div>
    </div>
    <AR v-if="page === 1" />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import AR from "./components/AR.vue";
import HintScreen from "./components/HintScreen.vue";
import Error from "./components/Error.vue";

@Component({
  components: {
    AR,
    HintScreen,
    Error,
  },
})
export default class App extends Vue {
  page = 1;
  mounted() {
    //
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common/mixins";
@import "~@/assets/scss/common/variables";
#app {
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  border: 0;
}
.content {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;

  @include desktop-up-layout {
    max-width: 746px;
  }
}
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
.overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(19, 30, 39, 0.9);
  z-index: 1;
  display: none;
}
</style>
