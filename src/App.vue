<template>
  <div
    id="app"
    :style="{
      'background-color': memoriesPage
        ? 'rgba(19, 30, 39, 1)'
        : 'rgba(19, 30, 39, 0)',
      overflow: memoriesPage ? 'hidden' : 'auto',
    }"
  >
    <Header :showIntro="showIntro && memoriesPage" />
    <!-- mode="out-in" :duration="1000" -->
    <transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 700, leave: 300 }"
    >
      <router-view :key="$route.fullPath" v-if="checkIntro" ref="route" />
    </transition>
    <transition name="fade" mode="out-in">
      <Overlay v-if="overlayId !== -1" :data="memories[overlayId]" />
    </transition>
    <transition name="fade" mode="out-in">
      <Intro v-if="showIntro && memoriesPage" @skipIntro="skipIntro" />
    </transition>
    <Footer
      :style="{
        transform: memoriesPage ? 'translateY(-100%)' : 'translateY(0)',
      }"
    />
  </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator";
import AR from "./components/AR.vue";
import Intro from "./components/Intro.vue";
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
    Intro,
    Overlay,
    Header,
    Footer,
    Error,
  },
})
export default class App extends Vue {
  currentPath = "/memories";
  showIntro = true;

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

  get checkIntro() {
    if (this.memoriesPage && this.showIntro) {
      return false;
    }
    return true;
  }

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal) {
    this.currentPath = newVal.path;
    //console.log(newVal);
  }

  get memoriesPage() {
    return this.currentPath === "/memories" ? true : false;
  }

  get routerPath() {
    return this.$router.currentRoute.path;
  }

  async created() {
    await this.memoriesStore.getData();
  }

  skipIntro() {
    this.showIntro = false;
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

  //color: #2c3e50;
  //background-color: #141e27;
  height: fit-content;

  @include tablet {
    height: 100%;
  }
  @include desktop {
    overflow: auto;
  }
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
  //  position: absolute;
  width: 100%;
  text-align: left;
  background: transparent;
  bottom: 0;
  transition: 0.3s transform;
  @include mobile {
    transform: translateY(0) !important;
  }
}

.fade-enter-active {
  transition-duration: 0.7s;
  transition-property: opacity, transform;
  //transition-timing-function: ease;
}

.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity, transform;
  //transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  //transform: translateY(100px);
}

// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.5s;
// }
// .fade-enter, .loaderFade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
//   opacity: 0;
// }
</style>
