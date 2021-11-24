<template>
  <div id="app">
    <!-- <Error v-if="!checkMedia" />
    <HintScreen v-if="page === 0 && checkMedia" @buttonClick="buttonClick" /> -->
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
</style>
