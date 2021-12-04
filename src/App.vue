<template>
  <div id="app">
    <Header />
    <router-view :key="$route.fullPath" ref="route" />
    <Overlay v-if="overlayId !== -1" :data="memories[overlayId]" />
    <Footer />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import AR from "./components/AR.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Overlay from "./components/Overlay.vue";
import Error from "./components/Error.vue";
import FormsStore from "@/store/formsStore";
import MemoriesStore from "@/store/memoriesStore";
import { getModule } from "vuex-module-decorators";

@Component({
  components: {
    AR,
    Overlay,
    Header,
    Footer,
    Error,
  },
})
export default class App extends Vue {
  page = 1;

  get formsStore() {
    return getModule(FormsStore, this.$store);
  }
  get memoriesStore() {
    return getModule(MemoriesStore, this.$store);
  }

  get memories() {
    return this.memoriesStore.memories;
  }
  get overlayId() {
    return this.memoriesStore.overlayId;
  }

  async created() {
    await this.memoriesStore.getData();
  }

  mounted() {
    // this.formsStore.setData({
    //   id: "meme1",
    //   title: "I’d see my 3 children & 2 Grandsons",
    //   description:
    //     "It would be magical, my stomach would be turning with excitement at the thought of seeing all of their smiling faces. I would be excited at seeing how much my Grandsons had grown and changed in those 3 years,are they taller, have their faces changed, had logans hair darkened, Is Aiden taller then me now. Do my children look older now then I remember them looking.",
    //   first_name: "Angela",
    //   second_name: "Klichko",
    //   email: "aaa@aa.cpm",
    //   date: Math.random(),
    // });
    // this.formsStore.submitForms();
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
.footer {
  z-index: 1;
  position: absolute;
  width: 100%;
  text-align: left;
  background: transparent;
  bottom: 0;
}
</style>
