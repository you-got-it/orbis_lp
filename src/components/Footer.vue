<template>
  <footer class="footer ui">
    <div class="footer_holder">
      <div class="footer_info">
        <div class="footer_menu">
          <a
            href="https://gbr.orbis.org/en/privacy-policy"
            target="__blank"
            class="footer_menu-link"
            >Privacy policy</a
          >
          <a
            href="https://gbr.orbis.org/en/website-terms-conditions"
            target="__blank"
            class="footer_menu-link"
            >terms & conditions</a
          >
          <a
            href=" https://secure.orbis.org/ "
            target="__blank"
            class="footer_menu-link"
            >Donate</a
          >
          <a
            href="https://gbr.orbis.org/en/about-us"
            target="__blank"
            class="footer_menu-link"
            >About Orbis</a
          >
        </div>
        <div class="footer_copyrights">
          <p>
            Orbis UK (Orbis Charitable Trust) is an affiliate of Orbis
            International.
          </p>
          <p>Registered charity number 1061352, company number 3303689</p>
          <p>6th Floor, 10 Lower Thames Street, London EC3R 6AF</p>
        </div>
      </div>
      <img src="@/assets/images/fr.svg" alt="" class="footer-logo" />
    </div>
  </footer>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import MemoriesStore from "@/store/memoriesStore";
// import { getModule } from "vuex-module-decorators";
// import { gsap } from "gsap";

@Component
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
.footer {
  padding: 30px;
  @include desktop {
    padding: 30px 82px;
  }
  box-sizing: border-box;
  .footer-logo {
    width: 158px;
  }
  p {
    margin: 0;
  }
}
</style>
