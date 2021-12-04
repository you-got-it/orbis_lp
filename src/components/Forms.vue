<template>
  <main class="forms layout">
    <form
      :class="['form', { submitted: submitted, done: done, waiting: waiting }]"
    >
      <Title class="form_title__success" :title="currentTitle" />
      <div class="form_row">
        <label for="want">i’d see...</label>
        <input
          type="text"
          id="want"
          name="cd_IDSEE"
          v-model="title"
          placeholder="Type here what you would see|"
          required
        />
        <span class="form_error">this is a required field</span>
      </div>
      <div class="form_row">
        <label for="moment"
          >could you describe that moment to us?
          <small>(optional)</small></label
        >
        <textarea
          type="text"
          id="moment"
          v-model="description"
          name="cd_IDSEEDESC"
          placeholder="Type here a description of that moment|"
        ></textarea>
      </div>
      <div class="form_row">
        <label for="name">first name</label>
        <input
          type="text"
          id="name"
          v-model="first_name"
          name="cd_FIRSTNAME"
          placeholder="Enter your first name|"
          required
        />
        <span class="form_error">this is a required field</span>
      </div>
      <div class="form_row">
        <label for="surname">second name</label>
        <input
          type="text"
          id="surname"
          name="cd_LASTNAME"
          v-model="second_name"
          placeholder="Enter your second name|"
          required
        />
        <span class="form_error">this is a required field</span>
      </div>
      <div class="form_row">
        <label for="mail">email address</label>
        <input
          type="email"
          id="mail"
          name="email"
          v-model="email"
          placeholder="Enter your email address|"
          required
        />
        <span class="form_error">this is a required field</span>
      </div>
      <div class="form_row">
        <input
          type="hidden"
          id="cd_IDSEEOPTIN_radio"
          name="cd_IDSEEOPTIN_radio"
          value="n"
        />
        <input
          type="checkbox"
          id="recieve"
          onclick="cd_IDSEEOPTIN_radio.value = this.checked ? 'y' : 'n';"
        />
        <label for="recieve"
          >Tick this box if you would like to receive email communications and
          updates about our work. We will use your data in accordance with our
          <a href="https://gbr.orbis.org/en/privacy-policy" target="__blank"
            >Privacy Policy</a
          ></label
        >
      </div>
      <div class="form_row">
        <input type="hidden" name="userid" value="27593" />
        <input
          type="hidden"
          name="SIG8d84b17650384ca190ee32335eab25c87bd17a81072830bd88f0b174aa21ccf7"
          value=""
        />
        <input type="hidden" name="programid" value="244184" />
        <input type="hidden" name="addressbookid" value="70042828" />
        <input
          type="hidden"
          name="ReturnURL"
          value="https://idsee.orbis.org/#thankyou"
        />
        <input type="hidden" id="ci_consenturl" name="ci_consenturl" value="" />
        <input type="submit" @click.stop.prevent="onSubmit" value="SUBMIT" />
      </div>

      <div class="form_success">
        <div class="social">
          <span class="social_title">share this page</span>
          <div class="social_links">
            <div class="addthis_inline_share_toolbox"></div>
          </div>
          <div class="social_copy">
            <span class="social_copy-title">Or share with link</span>
            <button class="social_copy-button js-copy-button">
              https://orbis.org/idsee
            </button>
            <input type="submit" />
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Title from "@/components/Title.vue";
import Texts from "../assets/js/texts.js";
import FormsStore from "@/store/formsStore";
import { getModule } from "vuex-module-decorators";
// import MemoriesStore from "@/store/memoriesStore";
// import { getModule } from "vuex-module-decorators";
// import { gsap } from "gsap";
@Component({
  components: { Title },
})
export default class Forms extends Vue {
  currentTitle = "";
  submitButton;
  form;
  title = "";
  description = "";
  first_name = "";
  second_name = "";
  email = "";
  submitted = false;
  done = false;
  waiting = false;

  get formsStore() {
    return getModule(FormsStore, this.$store);
  }

  mounted() {
    this.currentTitle =
      Texts.titles[Math.trunc(Math.random() * Texts.titles.length)];
    this.submitButton = document.querySelector('input[type="button"]');
    this.form = document.querySelector("form");
    //
  }

  async onSubmit(e) {
    console.log("tut");
    e.preventDefault();
    this.submitted = true;
    console.log(e);
    let isValid = true;
    document.querySelectorAll("input[name], textarea").forEach((el) => {
      console.log(el);
      if (!el.checkValidity()) {
        isValid = false;
      }
    });
    if (isValid) {
      this.formsStore.setData({
        title: this.title,
        description: this.description,
        first_name: this.first_name,
        second_name: this.second_name,
        email: this.email,
        date: Date.now(),
      });
      this.waiting = true;
      this.formsStore
        .submitForms()
        .then((result) => {
          this.waiting = false;
          this.done = true;
          this.currentTitle = Texts.thanks;
        })
        .catch((err) => {
          this.waiting = false;
          this.$router.go(this.$router.currentRoute);
        });
      // if (!result) {
      //   console.log("error");
      // } else {
      //   console.log(result);
      //   this.done = true;
      //   this.currentTitle = Texts.thanks;
      // }
    }
    /*   


  

    let formData = new FormData();
    document.querySelectorAll("input[name], textarea").forEach((el) => {
      console.log(el);
      if (!el.checkValidity()) {
        isValid = false;
      }
    });

    if (isValid) {
      this.form.submit();

      this.form.classList.add("done");
    }*/
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
.waiting {
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}
</style>
