<template>
  <div id="app">
    <Header />
    <AR v-if="page === 1" />
    <Overlay />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import AR from "./components/AR.vue";
import Header from "./components/Header.vue";
import Overlay from "./components/Overlay.vue";
import Error from "./components/Error.vue";

@Component({
  components: {
    AR,
    Overlay,
    Header,
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
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
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

  @include desktop {
    max-width: 746px;
  }
}
</style>
