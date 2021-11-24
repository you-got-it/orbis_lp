<template>
  <div class="content">
    <img class="logo" src="@/assets/images/logo.svg" />
    <div class="text-center">
      <div class="text-title">
        Unfortunately, the AR experience is not working properly on this device,
        please try:
      </div>
      <ul>
        <li>- Switching to another browser</li>
        <li>- Clearing the cache</li>
        <li>- Closing any apps that are currently running</li>
      </ul>
    </div>
    <a href="https://www.orbis.org/" target="_blank">www.orbis.org</a>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
.text-center {
  padding: 20px;
  text-align: center;
  ul {
    text-align: left;
    padding-left: 15px;
  }
}
.text-title {
  margin-bottom: 20px;
  font-weight: bold;
}
.content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 10vh 0;
  box-sizing: border-box;
  &__break {
    @media (orientation: landscape) {
      display: none;
    }
  }
  &__canvas {
    @media (orientation: portrait) {
      width: 100%;
      max-width: 440px;
      margin-left: auto;
      margin-right: auto;
    }
    @media (orientation: landscape) {
      height: 100%;
      max-height: 300px;
    }
    transition: opacity 0.6s ease-in-out;
    opacity: 0;
    margin-bottom: 22px;
    object-fit: contain;
  }
  &__button {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
    margin-bottom: 16px;
    @media (orientation: portrait) {
      margin-bottom: 20%;
    }
    @media (max-aspect-ratio: 16/10) and (orientation: landscape) {
      margin-bottom: 16%;
    }
    color: #fff;
    border: none;
    background: #00a3e0;
    padding: 10px;
    padding-bottom: 7px;
    font-size: 18px;
    letter-spacing: inherit;
    line-height: 22px;
  }
  &__text {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
    margin: 0px 20px 22px;
  }
}

.button--visible {
  opacity: 1;
  visibility: visible;
}
</style>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Error extends Vue {
  mounted() {
    //
  }
}
</script>
