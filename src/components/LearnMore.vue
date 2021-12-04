<template>
  <main class="info">
    <div class="showcase">
      <h1 class="showcase_title js-random-text">
        <span>If you lost your sight,</span> what moment would you want to see
        again?
      </h1>
      <h1 class="showcase_title js-random-text" style="display: none">
        <span>If you were going blind tomorrow,</span> what is the final image
        you’d want to see?
      </h1>
      <h1 class="showcase_title js-random-text" style="display: none">
        <span>If you went blind for 3 years,</span> what’s the first thing you’d
        want to see?
      </h1>
      <div
        style="
          position: absolute;
          top: 50px;
          left: 0;
          height: 400px;
          width: 100%;
          background-image: linear-gradient(180deg, #0c1f2f, transparent);
        "
      ></div>
      <video
        class="showcase_video"
        :src="`${publicPath}video/hero-video.mp4`"
        loop
        muted
        autoplay
        playsinline
        :poster="`${publicPath}img/hero-video-cover.jpg`"
      ></video>
    </div>

    <div class="content">
      <div class="intro">
        <h2 class="intro_title">
          Losing your sight is emotionally traumatic and isolating.
        </h2>
        <div class="intro_text">
          <p>
            We are Orbis: a charity that brings people together to fight
            avoidable blindness – and we are collecting memories of what people
            in the UK would want to see again if they lost their sight. We are
            asking you to share your moments with us so we can share these
            memories across our channels for others to read, bringing us closer
            together to better understand the impact vision loss can have on
            children and adults in low income-countries.
          </p>
        </div>
        <router-link to="share" class="button">share your memory</router-link>
      </div>

      <div class="video-section">
        <div class="video-section_container">
          <div class="video-embed">
            <iframe
              width="500"
              height="500"
              src="https://www.youtube.com/embed/v0cvbmtB1u8?cc_load_policy=1&amp;color=white&amp;rel=0"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <h2>
        Globally, there are <span class="bright-text">43 million</span> people
        living with blindness and
        <span class="bright-text">295 million</span> people living with
        moderate-to-severe sight loss.
        <span class="bright-text"
          >3 out of 4 cases of blindness are treatable.</span
        >
      </h2>
      <span class="marked-text">What is ‘I’d see’?</span>

      <div class="about">
        <h2>
          A platform for people to share their favourite moments to raise
          awareness about <span class="bright-text">avoidable blindness</span>.
        </h2>
        <router-link to="share" class="button">share your memory</router-link>
      </div>

      <div class="slider" ref="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-1.jpg`"
                alt=""
              />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-2.jpg`"
                alt=""
              />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-3.jpg`"
                alt=""
              />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-4.jpg`"
                alt=""
              />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-5.jpg`"
                alt=""
              />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="person">
              <img
                class="person_image"
                :src="`${publicPath}img/slider-6.jpg`"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div class="orbis">
        <picture class="orbis_image">
          <source
            :srcset="`${publicPath}img/girl-mobile.jpg`"
            media="(max-width: 768px)"
          />
          <img :src="`${publicPath}img/girl.jpg`" alt="" class="" />
        </picture>
        <span class="orbis_title">who are orbis?</span>
        <p>
          We are an international eye care charity that saves people’s sight,
          giving them the chance to change their lives. We train eye health
          professionals and workers, raise awareness, and improve access to eye
          care around the world.
        </p>
      </div>

      <div class="quote-wrapper">
        <div class="quote-wrapper_top-corners"></div>
        <div class="quote-wrapper_bottom-corners"></div>
        <figure>
          <blockquote>
            ‘Everywhere Orbis works, it leaves lasting change by training,
            educating and distributing knowledge and inspiring local teams to
            fight avoidable blindness in their own communities.’
          </blockquote>
          <figcaption>TOM DAVIES – EYE WEAR DESIGNER</figcaption>
        </figure>
      </div>

      <div class="form">
        <Title :title="currentTitle" />
        <router-link to="share" class="button">share your memory</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { Swiper } from "swiper";
import "swiper/swiper-bundle.css";
// import MemoriesStore from "@/store/memoriesStore";
// import { getModule } from "vuex-module-decorators";
// import { gsap } from "gsap";
import Texts from "../assets/js/texts.js";
import Title from "@/components/Title.vue";

@Component({
  components: { Title },
})
export default class LearnMore extends Vue {
  swiper;
  currentTitle = "";
  get publicPath() {
    return process.env.BASE_URL;
  }

  beforeDestroye() {
    this.swiper.destroy();
  }
  mounted() {
    this.currentTitle =
      Texts.titles[Math.trunc(Math.random() * Texts.titles.length)];
    this.$nextTick(() => {
      this.swiper = new Swiper(this.$refs.swiper, {
        slidesPerView: "auto",
        spaceBetween: 8,
        breakpoints: {
          768: {
            spaceBetween: 20,
          },
        },
      });
    });
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
.info {
  text-align: left;
  position: relative;
}
.swiper-slide {
  flex-shrink: 1;
}
</style>
