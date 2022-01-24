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
          ref="titleInput"
          v-model="title"
          placeholder="Type here what you would see|"
          required
        />
        <span
          class="form_error"
          v-html="
            errors.title
              ? 'Please remove any prohibited words'
              : 'this is a required field'
          "
          >this is a required field</span
        >
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
          ref="descriptionInput"
          name="cd_IDSEEDESC"
          placeholder="Type here a description of that moment|"
        ></textarea>
        <span
          class="form_error"
          :style="{ display: this.errors.description ? 'block' : 'none' }"
          >Please remove any prohibited words</span
        >
      </div>
      <div class="form_row">
        <label for="name">first name</label>
        <input
          type="text"
          id="name"
          v-model="first_name"
          ref="firstNameInput"
          name="cd_FIRSTNAME"
          placeholder="Enter your first name|"
          required
        />
        <span
          class="form_error"
          v-html="
            errors.first_name
              ? 'Please remove any prohibited words'
              : 'this is a required field'
          "
          >this is a required field</span
        >
      </div>
      <div class="form_row">
        <label for="surname">second name</label>
        <input
          type="text"
          id="surname"
          name="cd_LASTNAME"
          ref="secondNameInput"
          v-model="second_name"
          placeholder="Enter your second name|"
          required
        />
        <span
          class="form_error"
          v-html="
            errors.second_name
              ? 'Please remove any prohibited words'
              : 'this is a required field'
          "
          >this is a required field</span
        >
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
      <div class="form_row intro_text">
        <p>
          When you submit your memory it will appear on the website along with
          your first name
        </p>
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
          v-model="recive"
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
            <!-- <div class="addthis_inline_share_toolbox"></div> -->
            <AddThis
              publicId="ra-6142409eb2f29e37"
              :data-url="`https://idsee.orbis.org/#/memories?id=${sharingId}`"
            />
          </div>
          <div class="social_copy">
            <span class="social_copy-title">Or share with link</span>
            <button
              class="social_copy-button js-copy-button"
              @click="copyClick"
            >
              {{ `https://idsee.orbis.org/#/memories?id=${sharingId}` }}
            </button>
          </div>
        </div>
        <router-link
          :to="{ path: 'memories', query: { id: sharingId } }"
          class="button"
          >View your memory</router-link
        >
      </div>
    </form>
    <div class="lmblock">
      <h1 class="lmblock-title">Want to find out more?</h1>
      <div class="intro_text content">
        <p>
          We are an international eye care charity that saves people's sight,
          giving them the chance to change their lives. We train eye health
          professionals and workers, raise awareness, and improve access to eye
          care around the world.
        </p>
      </div>
      <router-link to="info" class="button">More about Orbis</router-link>
    </div>
  </main>
</template>

<script>
import { Component, Prop, Vue, Watch, Ref } from "vue-property-decorator";
import Title from "@/components/Title.vue";
import Texts from "../assets/js/texts.js";
import BadWords from "../assets/js/badwords.js";
import FormsStore from "@/store/formsStore";
import MemoriesStore from "@/store/memoriesStore";
import { getModule } from "vuex-module-decorators";
import AddThis from "vue-simple-addthis-share";

// import MemoriesStore from "@/store/memoriesStore";
// import { getModule } from "vuex-module-decorators";
// import { gsap } from "gsap";
@Component({
  components: { Title, AddThis },
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
  recive = false;
  submitted = false;
  done = false;
  waiting = false;

  errors = {
    title: false,
    description: false,
    first_name: false,
    second_name: false,
  };
  sharingId = "";

  @Ref("titleInput")
  titleInput;
  @Ref("descriptionInput")
  descriptionInput;
  @Ref("firstNameInput")
  firstNameInput;
  @Ref("secondNameInput")
  secondNameInput;

  @Watch("title")
  setTileValidity() {
    this.titleInput.setCustomValidity("");
    this.errors.title = false;
  }
  @Watch("description")
  setDescriptionValidity() {
    this.descriptionInput.setCustomValidity("");
    this.errors.description = false;
  }
  @Watch("first_name")
  setFirstNameValidity() {
    this.firstNameInput.setCustomValidity("");
    this.errors.first_name = false;
  }
  @Watch("second_name")
  setSecondNameValidity() {
    this.secondNameInput.setCustomValidity("");
    this.errors.second_name = false;
  }

  get formsStore() {
    return getModule(FormsStore, this.$store);
  }
  get memoriesStore() {
    return getModule(MemoriesStore, this.$store);
  }

  mounted() {
    this.currentTitle =
      Texts.titles[Math.trunc(Math.random() * Texts.titles.length)];
    this.submitButton = document.querySelector('input[type="button"]');
    this.form = document.querySelector("form");

    //
  }

  copyClick(e) {
    e.preventDefault();

    navigator.clipboard.writeText(e.target.innerText).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  // @Watch("title")

  // }

  badFilterold(text) {
    const array = text.split(" ");
    for (let i = 0; i < array.length; i += 1) {
      if (BadWords.includes(array[i].toLowerCase())) {
        return "";
      }
    }

    return text;
  }

  badFilter(text) {
    const array = text.split(" ");
    for (let i = 0; i < array.length; i += 1) {
      if (BadWords.includes(array[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  async onSubmit(e) {
    e.preventDefault();
    this.submitted = true;
    this.errors.title = this.badFilter(this.title);
    this.errors.description = this.badFilter(this.description);
    this.errors.first_name = this.badFilter(this.first_name);
    this.errors.second_name = this.badFilter(this.second_name);
    let error = false;
    if (this.errors.title) {
      //this.title = "";
      this.titleInput.setCustomValidity("bad words");
      error = true;
    }
    if (this.errors.description) {
      //this.description = "";
      this.descriptionInput.setCustomValidity("bad words");
      error = true;
    }
    if (this.errors.first_name) {
      //this.first_name = "";
      this.firstNameInput.setCustomValidity("bad words");
      error = true;
    }
    if (this.errors.second_name) {
      //this.second_name = "";
      this.secondNameInput.setCustomValidity("bad words");
      error = true;
    }
    if (error) {
      return;
    }
    // this.title = this.badFilter(this.title, this.errors.title);
    // this.description = this.badFilter(this.description);
    // this.first_name = this.badFilter(this.first_name);
    // this.second_name = this.badFilter(this.second_name);
    this.sharingId = Date.now().toString(36);
    let isValid = true;
    document.querySelectorAll("input[name], textarea").forEach((el) => {
      if (!el.checkValidity()) {
        isValid = false;
      }
    });
    if (isValid) {
      const memObj = {
        title: this.title,
        description: this.description,
        first_name: this.first_name,
        second_name: this.second_name,
        email: this.email,
        date: new Date().toISOString().slice(0, 10),
        recive: this.recive ? "y" : "n",
        id: this.sharingId,
      };
      this.formsStore.setData(memObj);
      this.waiting = true;
      this.formsStore
        .submitForms()
        .then((result) => {
          this.waiting = false;
          this.done = true;
          this.currentTitle = Texts.thanks;
          this.memoriesStore.addMemorie(memObj);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          document.getElementById("app").scrollTo({
            top: 0,
            behavior: "smooth",
          });

          // Send Facebook Pixel Lead standard event.
          // https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking/#standard-events
          if (window.fbq) {
            window.fbq("track", "Lead");
          }
        })
        .catch((err) => {
          this.waiting = false;
          this.$router.go(this.$router.currentRoute);
        });
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";

.lmblock {
  margin-bottom: 110px;
  .lmblock-title {
    text-transform: uppercase;
  }
}

.forms {
  z-index: 1;
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
