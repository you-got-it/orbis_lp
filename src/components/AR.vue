<template>
  <div ref="container" id="ar" class="ar">
    <canvas
      class="ar__canvas"
      ref="3d"
      width="10px"
      height="10px"
      @click="canvasClick"
      :style="isDesktop ? { background: '#f2f2f2' } : {}"
    ></canvas>
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  Texture,
  AddOperation,
  EquirectangularReflectionMapping,
  BoxGeometry,
  BoxBufferGeometry,
  PerspectiveCamera,
  Vector3,
  Vector2,
  AmbientLight,
  WebGLRenderer,
  Color,
  DirectionalLight,
  DoubleSide,
  sRGBEncoding,
  Scene,
  MeshStandardMaterial,
  Raycaster,
  PMREMGenerator,
  Box3,
  UnsignedByteType,
  MeshPhongMaterial,
  Mesh,
  AnimationMixer,
  Shape,
  ShapePath,
  LineCurve3,
  MirroredRepeatWrapping,
  BufferGeometry,
  BufferAttribute,
  Group,
  MeshBasicMaterial,
  ExtrudeGeometry as ExtrudeGeometryNew,
  PlaneGeometry,
  PlaneBufferGeometry,
  LoopOnce,
  Plane,
  Fog,
  CylinderGeometry,
} from "three";
import {
  trueAlpha,
  random,
  randomSign,
  preload,
  PromiseAll,
  preloadImage,
  isTouchDevice,
  getTexture,
  newCanvas,
  radialGradientTexture,
} from "../assets/js/utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { createDerivedMaterial } from "troika-three-utils";
import { createCustomMaterial } from "../assets/js/customMaterial";

//import { Text, preloadFont } from "troika-three-text";
import {
  Text,
  preloadFont,
} from "../assets/js/troika-three-text/troika-three-text.esm";

//import { ArToolkitProfile } from "@ar-js-org/ar.js";
// import {
//   ArToolkitProfile,
//   ArToolkitSource,
//   ArToolkitContext,
//   ArMarkerControls,
//   ArSmoothedControls,
// } from "../assets/js/ar-threex-nft.js";
// } from "@ar-js-org/ar.js/three.js/build/ar-threex-nft.js";

//import gsap from "gsap";
import { gsap } from "gsap";

//require("@/assets/js/ar-nft.js");
@Component
export default class AR extends Vue {
  isDesktop = true;
  isStarted = false;
  currentScene;
  models = {};
  mixer;
  mixers = [];
  debugString = "String";
  loading = true;
  mainTextString =
    "IF YOU LOST YOUR SIGHT, WHAT MOMENT WOULD YOU WANT TO SEE AGAIN?";
  mainTween;
  get getDebugString() {
    return this.debugString;
  }

  momentsString = [
    `I'd see my Beautiful Cat`,
    `I'd see the ocean with a beautiful sunset`,
    `I'd see a mountain range`,
    `I'd see my 3 children & 2 Grandsons`,
    `My Dad it would make me so happy`,
    `I'd my friends and my family`,
    `I'd see my beautiful nephew`,
  ];

  setDebugString(text) {
    this.debugString = text;
  }

  mounted() {
    //console.log(ArToolkitProfile);
    window.app = this;
    this.startAR();
  }

  beforeDestroy() {
    this.reset();
  }

  reset() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.animate.bind(this), false);

    this.controls.dispose();
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(1);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  async startAR() {
    this.initScene();
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    await this.loadResources();
    this.setupObjects();
  }

  async loadResources() {
    const imagesToLoad = {
      //shadow: "images/shadow.jpg",
    };
    const modelsToLoad = {
      // model: "models/anim_7.glb",
      // model: "models/GroundVehicle.glb",
    };
    this.images = {};
    this.models = {};
    this.animations = {};
    const promises = [];
    Object.keys(imagesToLoad).map((key) =>
      promises.push(
        preloadImage(imagesToLoad[key], key).then((data) => {
          this.images[data.key] = data.image;
        })
      )
    );

    promises.push(
      new Promise((resolve, reject) => {
        preloadFont(
          {
            font: "/fonts/FontsFree-Net-aa1woff2-1.ttf",
            characters: this.mainTextString,
          },
          () => {
            resolve();
          }
        );
      })
    );

    // promises.push(
    //   new Promise((resolve, reject) => {
    //     new RGBELoader().setDataType(UnsignedByteType).load(
    //       "./images/env.hdr",
    //       (texture) => {
    //         this.pmremGenerator._renderer.toneMappingExposure = 100;
    //         const envMap =
    //           this.pmremGenerator.fromEquirectangular(texture).texture;
    //         this.hdrEnv = envMap;
    //         resolve({ envMap });
    //       },
    //       undefined,
    //       null
    //     );
    //   })
    // );

    Object.keys(modelsToLoad).map((key) => {
      promises.push(this.loadModel(key, modelsToLoad[key]));
    });
    //

    await Promise.all(promises).then(() => {
      this.loading = false;
      if (this.isDesktop) {
        this.markersLoading = false;
      }
      console.log("promiseAll");
      //
    });
  }

  initScene() {
    this.scene = new Scene();
    this.ambient = new AmbientLight(0xdbf2ff, 0.1);
    this.scene.add(this.ambient);
    this.light = new DirectionalLight(0xdbf2ff, 0.66);
    this.light.position.set(-3.6, 2, 5);
    this.scene.add(this.light);

    this.camera = new PerspectiveCamera(35, 1, 0.01, 1000);
    this.camera.position.set(0, 0, 6);
    this.scene.add(this.camera);

    // render
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      canvas: this.$refs["3d"],
    });
    this.renderer.setClearColor(0x131e27, 1);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.autoClear = true;

    this.controls = new OrbitControls(this.camera, this.$refs["3d"]);
    this.controls.target.set(0, 0, 0);
    this.controls.dampingFactor = 0.1;
    this.controls.enableDamping = true;

    this.controls.update();
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = -2;
    this.sceneGroup = new Group();
    this.scene.add(this.sceneGroup);

    this.scene.fog = new Fog(0x131e27, 6 - 0.5, 6 + 0.5);

    this.pmremGenerator = new PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
  }

  setupObjects() {
    //
    this.initMainText();
    gsap.delayedCall(0.05, () => {
      this.initString();
    });

    this.raf = window.requestAnimationFrame(this.animate.bind(this));
  }

  updateColorRanges() {
    const array = this.mainText.geometry.attributes.aTroikaGlyphColor.array;
    let last = 0;
    for (let i = 0; i < this.splittedText.length; i += 1) {
      const item = this.splittedText[i];
      for (let ind = 0; ind < item.text.length; ind += 1) {
        const start = ind * 3 + last;
        array[start] = item.outlineBlur;
        array[start + 1] = item.outlineOpacity * this.mainText.fillOpacity;
        array[start + 2] = item.z;
      }
      last += item.text.length * 3;
    }
    this.mainText.geometry.attributes.aTroikaGlyphColor.needsUpdate = true;
  }

  initMainText() {
    this.mainText = new Text(createCustomMaterial);
    this.scene.add(this.mainText);
    this.splittedText = this.splitWithIndex(this.mainTextString, " ");
    this.splittedText = this.splittedText.map((i) => {
      return {
        ...i,
        outlineBlur: 0.03,
        outlineOpacity: 0,
        z: 0,
      };
    });
    // this.colorRandge = this.mainTextString.split(" ").map();
    //this.mainText.colorRanges =  {0: Math.random()*100000, 24: Math.random()*100000,50:Math.random()*100000, }

    this.mainText.colorRanges = {};
    this.splittedText.forEach((i) => {
      this.mainText.colorRanges[i.index] = i;
    });

    this.mainText.text = this.mainTextString;
    this.mainText.font = "/fonts/FontsFree-Net-aa1woff2-1.ttf";
    this.mainText.fontSize = 0.2;
    this.mainText.position.z = 0;
    this.mainText.color = 0xffffff;
    this.mainText.maxWidth = 2.8;
    this.mainText.textAlign = "center";
    this.mainText.anchorX = "center";
    this.mainText.anchorY = "middle";
    this.mainText.outlineBlur = 0;
    this.mainText.outlineColor = 0xffffff;
    this.mainText.material = new MeshBasicMaterial({
      fog: false,
      side: DoubleSide,
    });
    // this.mainText.material = customMaterial;
    // Set properties to configure:

    this.mainText.sync(() => {
      this.startMainAnim();
    });
  }

  startMainAnim() {
    this.mainTween = gsap.timeline({
      onUpdate: () => {
        this.updateColorRanges();
      },
      onComplete: () => {
        this.mainText.fillOpacity = 1;
        this.mainText.outlineBlur = 0;
      },
      delay: 0.0,
    });
    this.splittedText.forEach((item, i) => {
      item.outlineBlur = 0.2;
      item.outlineOpacity = 0;
      item.z = -0.4;
      this.mainTween
        .to(
          item,
          {
            duration: 3,
            outlineBlur: 0.0001,
            z: 0,
            //outlineOpacity: 1,
            ease: "power4.out",
          },
          i * 0.4
        )
        .to(
          item,
          {
            duration: 2,
            //outlineBlur: 0.0001,
            outlineOpacity: 1,
            ease: "power3.in",
          },
          i * 0.4
        );
    });
    this.mainTween.timeScale(1.5);
  }

  initString() {
    this.string = new Text();
    this.scene.add(this.string);

    this.string.text = `I'd see my Beautiful Cat`;
    this.string.font = "/fonts/FontsFree-Net-aa1woff2-1.ttf";
    this.string.fontSize = 0.06;
    this.string.color = 0xffffff;
    this.string.textAlign = "center";
    this.string.anchorX = "center";
    this.string.anchorY = "middle";

    const customMaterial = createDerivedMaterial(
      new MeshStandardMaterial({ transparent: false }),
      {
        uniforms: {
          // Total width of the text, assigned on synccomplete
          rad: { value: 1.56 },
          speed: { value: 0 /* Math.random() + 0.1*/ },
          timeDelta: { value: 0 },
        },
        timeUniform: "time",
        vertexDefs: `      
          uniform float rad;
          uniform float timeDelta;
          uniform float speed;
        `,
        // vertexTransform: `
        //   float scale = 1.0 / textLength * PI * 1.98;
        //   float theta = -position.x * scale;
        //   float r = 10.0;
        //   float r2 = r + position.y * scale * r;
        //   position.z = cos(theta) * r2;
        //   position.y = sin(theta) * r2;
        // `,
        vertexTransform: `
        float addTime = time * 0.0005 * speed;
        float theta = position.x / rad + addTime + timeDelta;        
        position.xz = vec2(sin(theta) * rad, cos(theta) * rad);
        `,
        /* Secondary example ala https://tympanus.net/codrops/2019/10/10/create-text-in-three-js-with-three-bmfont-text/
        timeUniform: 'time',
        vertexTransform: `
          float frequency1 = 0.035;
          float amplitude1 = 20.0;
          float frequency2 = 0.025;
          float amplitude2 = 70.0;

          // Oscillate vertices up/down
          position.y += (sin(position.x * frequency1 + time / 1000.0) * 0.5 + 0.5) * amplitude1;

          // Oscillate vertices inside/outside
          position.z += (sin(position.x * frequency2 + time / 1000.0) * 0.5 + 0.5) * amplitude2;
        `
        */
      }
    );
    this.string.material = customMaterial;
    this.stringsArray = [];

    this.string.sync(() => {
      // console.log(this.string.geometry.boundingBox.max);

      // const geometry = new PlaneGeometry(
      //   this.string.geometry.boundingBox.max.x * 2,
      //   this.string.geometry.boundingBox.max.y * 2,
      //   56,
      //   1
      // );

      const geometry = new CylinderGeometry(
        1.559,
        1.559,
        this.string.geometry.boundingBox.max.y * 2 + 0.05,
        30,
        1,
        true,
        -(this.string.geometry.boundingBox.max.x * 2 + 0.05) / 2 / 1.559,
        (this.string.geometry.boundingBox.max.x * 2 + 0.05) / 1.559
      );
      // console.log(geometry);

      const material = new MeshStandardMaterial({
        color: 0x008bdb,
        side: DoubleSide,
        transparent: false,
        // depthWrite: false,
      });
      this.plane = new Mesh(geometry, material);
      this.scene.add(this.plane);

      this.group = new Group();
      this.group.add(this.string);
      this.group.add(this.plane);
      this.string.renderOrder = 1;
      this.scene.add(this.group);
      this.group2 = this.group.clone();
      //this.scene.add(this.group2);
      for (let i = 0; i < 20; i += 1) {
        const group = this.group.clone();
        group.position.y = Math.random() * 0.6 - 0.3;
        group.rotation.y = Math.random() * 7;
        const scale = 1 - Math.random() * 0.3;
        group.scale.set(scale, scale, scale);
        this.scene.add(group);
        this.stringsArray.push(group);
      }
      // for (let i = 0; i < 16; i += 1) {
      //   const string = this.string.clone();
      //   string.material = customMaterial.clone();
      //   string.material.uniforms.timeDelta.value = Math.random() * 6;
      //   string.material.uniforms.rad.value = 1.52 + Math.random() * 0.3;
      //   string.material.uniforms.speed.value = Math.random() + 0.1;
      //   this.stringsArray.push(string);
      //   // this.scene.add(string);
      // }
      // this.stringsArray.forEach((s) => {
      //   s.position.y = Math.random() * 0.6 - 0.3;
      // });
      // this.string.scale.set(6, 6, 6);
      //this.string.position.z = 1;
    });
  }

  canvasClick() {
    //
  }

  getCorrectPath(url) {
    let correctUrl = url;
    correctUrl =
      correctUrl.slice(-1) === "/" ? correctUrl.slice(0, -1) : correctUrl;
    correctUrl = correctUrl.replace(/\/[^/]+?\.[^/]+?$/, "").slice(1);
    return correctUrl;
  }

  loadModel(key, url) {
    return new Promise((resolve, reject) => {
      new GLTFLoader().load(
        // resource URL
        url,
        // called when the resource is loaded
        (model) => {
          const scene = model.scene;
          //scene.children[0].name = key;
          this.models[key] = scene;
          // this.animations[key] = model.animations || [];

          this.clips = model.animations || [];

          // this.clips.forEach((clip, clipIndex) => {
          //   // Autoplay the first clip.
          //   let action;
          //   if (clipIndex === 0) {
          //     action = this.mixer.clipAction(clip);
          //     action.play();
          //   }
          // });
          resolve({ scene });
        },
        // called when loading is in progresses
        (xhr) => {
          //  console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
        },
        // called when loading has errors
        (error) => {
          // console.log('An error happened');
        }
      );
    });
  }

  setClips(clips, model) {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = null;
    }
    this.clips = clips;
    if (!clips.length) return;

    this.mixer = new AnimationMixer(model);
  }

  animate(nowMsec) {
    this.lastTimeMsec = this.lastTimeMsec || nowMsec - 1000 / 60;
    const deltaMsec = Math.min(200, nowMsec - this.lastTimeMsec);
    this.lastTimeMsec = nowMsec;
    if (this.group) {
      this.group.rotation.y += 0.01;
      this.stringsArray.forEach((g) => {
        g.rotation.y += 0.005;
      });
    }
    // this.mixers.forEach((mixer) => {
    //   mixer.update(deltaMsec / 1000);
    // });

    //this.mixer && this.mixer.update(deltaMsec / 1000);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.raf = window.requestAnimationFrame(this.animate.bind(this));
  }

  static sortLayers(a, b) {
    if (a.cameraDist < b.cameraDist) {
      return 1;
    }
    if (a.cameraDist > b.cameraDist) {
      return -1;
    }
    return 0;
  }

  splitWithIndex(str, delim) {
    var ret = [];
    var splits = str.split(delim);
    var index = 0;
    for (var i = 0; i < splits.length; i++) {
      ret.push({ index, text: splits[i] });
      index += splits[i].length + delim.length;
    }
    return ret;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/assets/scss/app.scss";
.subcont {
  font-size: 16px;
  bottom: 70px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  position: absolute;
  z-index: 6;
  line-height: 1.5em;
  @include font($font-alright-normal);
  @include desktop-up-layout {
    font-size: 32px;
  }
}
.subtitles {
  display: inline;
  background: #253746;
  color: white;
  padding: 0.28em;
  padding-left: 0;
  padding-right: 0;
  box-shadow: 8px 0 0 #253746, -8px 0 0 #253746;
}
.ar {
  overscroll-behavior: none;
  &__canvas {
    position: fixed;
    left: 0;
    top: 0;
  }
}
.debug {
  font-size: 16px;
  font-weight: 400;
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: left;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 10px;
  z-index: 100;
}
.loader {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
}
</style>
