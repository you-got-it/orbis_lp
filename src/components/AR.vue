<template>
  <div ref="container" id="ar" class="ar">
    <canvas
      class="ar__canvas"
      ref="3d"
      width="10px"
      height="10px"
      :style="{
        cursor: mouse.hover ? 'pointer' : 'auto',
      }"
    ></canvas>
    <router-link to="share" class="button ar-button"
      >share your memory</router-link
    >
  </div>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MemoriesStore from "@/store/memoriesStore";
import { getModule } from "vuex-module-decorators";
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
  CylinderBufferGeometry,
  Raycaster,
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
import { ExploreControl } from "../assets/js/ExploreControl.js";

//import { Text, preloadFont } from "troika-three-text";
import {
  Text,
  preloadFont,
} from "../assets/js/troika-three-text/troika-three-text.esm";

import globalBus from "@/globalBus";

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
  loading = true;
  needsResize = false;
  mainTextString =
    "IF YOU LOST YOUR SIGHT, WHAT MOMENT WOULD YOU WANT TO SEE AGAIN?";
  mainTween;

  mouse = {
    x: 0,
    y: 0,
    pos: new Vector2(-1, -1),
    lastPos: new Vector2(),
    dragObject: null,
    lastX: 0,
    lastY: 0,
    offsetX: 0,
    offsetY: 0,
    isDown: false,
    hover: false,
  };

  get getDebugString() {
    return this.debugString;
  }
  // get mouse() {
  //   return globalBus.mouse;
  // }
  get memoriesStore() {
    return getModule(MemoriesStore, this.$store);
  }

  get memories() {
    return this.memoriesStore.memories;
  }

  get overlayId() {
    return this.memoriesStore.overlayId;
  }

  mometsOffset = 0;

  fetched = false;
  mometsInit = false;

  @Watch("memories") fetchDone() {
    this.fetched = true;
    this.mometsOffset = Math.ceil(Math.random() * this.memories.length);
    this.initMoments();
  }

  @Watch("overlayId") overlayIdCanged() {
    if (this.overlayId === -1) {
      this.setMometsSpeed();
    }
  }

  width = 0;
  height = 0;

  globalBus = globalBus;

  momentsString = [
    `I'd see my Beautiful Cat`,
    `I'd see the ocean with a beautiful sunset`,
    `I'd see a mountain range`,
    `I'd see my 3 children & 2 Grandsons`,
    `My Dad it would make me so happy`,
    `I'd my friends and my family`,
    `I'd see my beautiful nephew`,
  ];
  moments = [];

  explore = { phi: 0.01 };

  setDebugString(text) {
    this.debugString = text;
  }

  mounted() {
    //console.log(ArToolkitProfile);
    window.app = this;
    this.startAR();
    // console.log(this.memories);
  }

  beforeDestroy() {
    this.reset();
  }

  reset() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.animate.bind(this), false);
    this.$refs["3d"].removeEventListener("mousedown", this.mousedown);
    this.$refs["3d"].removeEventListener("mouseup", this.mouseup);
    this.$refs["3d"].removeEventListener("mousemove", this.mousemove);

    //  this.controls.dispose();
  }

  onWindowResizeEvent() {
    this.needsResize = true;
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const currentDesktop = this.isDesktop;

    if (this.width < 768) {
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }

    if (currentDesktop !== this.isDesktop && this.mainText) {
      this.splittedText.forEach((s) => {
        delete s._gsap;
      });
      this.moments.forEach((m) => {
        m.group.remove(m.bg);
        m.group.remove(m.string);
        this.scene.remove(m.group);
      });
      this.moments = [];
      this.initMoments();
      this.mainText.maxWidth = this.isDesktop ? 2.8 : 1.6;
    }

    this.renderer.setPixelRatio(1);

    if (!this.isDesktop) {
      this.height = this.width * 1.0;
      this.camera.zoom = 1.5;
      this.camera.setViewOffset(
        this.width,
        this.height,
        0,
        -60,
        this.width,
        this.height
      );
    } else {
      const tHeight = Math.max(window.innerHeight, 800);
      this.camera.zoom = (0.8 * this.width) / tHeight;
      this.camera.setViewOffset(
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
    }
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.needsResize = false;
    // });
  }

  async startAR() {
    this.initScene();
    this.onWindowResize();
    window.addEventListener(
      "resize",
      this.onWindowResizeEvent.bind(this),
      false
    );

    this.$refs["3d"].addEventListener("mousedown", this.mousedown);
    this.$refs["3d"].addEventListener("mouseup", this.mouseup);
    this.$refs["3d"].addEventListener("mousemove", this.mousemove);

    this.$refs["3d"].addEventListener("touchend", this.ontouchend, false);
    this.$refs["3d"].addEventListener("touchmove", this.touchmove, false);
    this.$refs["3d"].addEventListener("touchstart", this.ontouchstart, false);
    this.renderer.clear();
    await this.loadResources();
    this.setupObjects();
  }

  getMousePos(e) {
    const rect = this.$refs["3d"].getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  mousemove(e) {
    const rect = this.$refs["3d"].getBoundingClientRect();

    this.mouse.pos.set(
      (e.clientX / rect.width) * 2 - 1,
      -(e.clientY / rect.height) * 2 + 1
    );
  }

  touchmove(e) {
    const rect = this.$refs["3d"].getBoundingClientRect();

    this.mouse.pos.set(
      (e.touches[0].clientX / rect.width) * 2 - 1,
      -(e.touches[0].clientY / rect.height) * 2 + 1
    );
  }

  ontouchend(e) {
    // const rect = this.$refs["3d"].getBoundingClientRect();
    // this.mouse.pos.set(
    //   (e.touches[0].clientX / rect.width) * 2 - 1,
    //   -(e.touches[0].clientY / rect.height) * 2 + 1
    // );
    //console.log(...this.mouse.pos);
    //this.mouse.pos.set(-1, -1);
  }

  ontouchstart(e) {
    const rect = this.$refs["3d"].getBoundingClientRect();
    this.mouse.isDown = true;
    this.mouse.pos.set(
      (e.touches[0].clientX / rect.width) * 2 - 1,
      -(e.touches[0].clientY / rect.height) * 2 + 1
    );
    this.mouse.lastPos.copy(this.mouse.pos);
    this.updateMoments(0);
    this.explore.mouseDownId = this.explore.hoverId;
  }

  mousedown(e) {
    this.mouse.isDown = true;
    const rect = this.$refs["3d"].getBoundingClientRect();
    this.mouse.pos.set(
      (e.clientX / rect.width) * 2 - 1,
      -(e.clientY / rect.height) * 2 + 1
    );
    this.mouse.lastPos.copy(this.mouse.pos);
    this.explore.downTime = Date.now();
  }
  mouseup() {
    //this.mouse.pos.set(-1, -1);
    //this.mouse.isDown = false;
    //this.$emit("mouseup", this.mouse.pos);
  }

  mouseDown(e) {
    if (e.emitter === "wheel") {
      return;
    }
    gsap.to(this.moments, {
      duration: 0.3,
      speed: 0,
      ease: "sine.out",
    });
    this.explore.mouseDownId = this.explore.hoverId;
    this.explore.downTime = Date.now();
  }

  mouseUp() {
    if (!this.mouse.isDown) {
      return;
    }

    if (
      this.explore.mouseDownId !== "" &&
      this.explore.mouseDownId === this.explore.hoverId &&
      Math.abs(this.mouse.pos.x - this.mouse.lastPos.x) < 0.06 &&
      Date.now() - this.explore.downTime < 200
    ) {
      this.memoriesStore.setOverlayId(
        this.moments[this.explore.mouseDownId].storyId
      );
    } else {
      this.setMometsSpeed();
    }
    this.explore.mouseDownId = "";
    //this.mouse.pos.set(-1, -1);
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
            font: "./fonts/FontsFree-Net-aa1woff2-1.ttf",
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
    this.camera.position.set(0, -0.2, 6);
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

    // this.controls = new OrbitControls(this.camera, this.$refs["3d"]);
    // this.controls.target.set(0, 0, 0);
    // this.controls.dampingFactor = 0.1;
    // this.controls.enableDamping = true;

    // this.controls.update();
    // this.controls.autoRotate = false;
    // this.controls.autoRotateSpeed = -2;

    // this.controls.enabled = false;

    this.sceneGroup = new Group();
    this.scene.add(this.sceneGroup);

    this.scene.fog = new Fog(0x131e27, 6 - 0.5, 6 + 0.5);

    this.raycaster = new Raycaster();
    this.setExplorer();

    // this.pmremGenerator = new PMREMGenerator(this.renderer);
    // this.pmremGenerator.compileEquirectangularShader();
  }

  setExplorer() {
    this.explore = {
      phi: 0.01,
      // speed: 0,
      // theta: Math.PI / 2,
      // radius: 0,
      // sy: this.camera.position.y,
      // sx: -1,
      // sz: this.camera.position.z - 14,
      // memCounter: 0,
      // isOver: false,
      storyId: "",
      hoverId: "",
      mouseDownId: "",
      downTime: Date.now(),
      // selectable: false,
      // selected: false,
      // autoselect: true,
    };
    this.explore.controls = new ExploreControl(this.explore, this.$refs["3d"]);
    this.explore.controls.dampingFactor = 0.035;
    this.explore.controls.addEventListener("start", this.mouseDown, false);
    this.explore.controls.addEventListener("end", this.mouseUp, false);
    this.explore.controls.enabled = false;
  }

  setupObjects() {
    //
    this.initMainText();

    this.string = new Text();
    this.string.text = `I'd see my Beautiful Cat`;
    this.string.font = "./fonts/FontsFree-Net-aa1woff2-1.ttf";
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
          speed: { value: 0.1 /* Math.random() + 0.1*/ },
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
        float theta = position.x / rad  + addTime + timeDelta;     
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
    //this.string.material = customMaterial;
    this.string.material = new MeshStandardMaterial({ transparent: false });
    this.bgColor = new Color(0x008bdb);
    this.bgColorHover = new Color(0x253746);
    this.bgMat = new MeshStandardMaterial({
      color: this.bgColor,
      side: DoubleSide,
      transparent: false,
      // depthWrite: false,
    });
    // this.string.curveRadius = -0.33;
    // this.string.position.z = 0.33;
    //this.group3 = new Group();
    // this.group3.add(this.string);
    // this.scene.add(this.group3);
    this.scene.add(this.string);
    this.renderer.compile(this.scene, this.camera);
    this.scene.remove(this.string);

    if (this.memories.length > 0) {
      this.mometsOffset = Math.ceil(Math.random() * this.memories.length);
      this.initMoments();
    }
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
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
    this.mainText.font = "./fonts/FontsFree-Net-aa1woff2-1.ttf";
    this.mainText.fontSize = 0.2;
    this.mainText.position.z = 0;
    this.mainText.color = 0xffffff;
    this.mainText.maxWidth = this.isDesktop ? 2.8 : 1.6;
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
            ease: "power4.out",
          },
          i * 0.4
        )
        .to(
          item,
          {
            duration: 2,
            outlineOpacity: 1,
            ease: "power3.in",
          },
          i * 0.4
        );
    });
    this.mainTween.timeScale(1.5);
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

  initMoments() {
    for (let i = 0; i < 35; i += 1) {
      const string = this.string.clone();
      const storyId = (i + this.mometsOffset) % this.memories.length;
      const moment = this.memories[storyId];

      string.text =
        moment.title.length > 70
          ? moment.title.slice(0, 67) + "..."
          : moment.title;
      string.material = this.string.material.clone();

      const rad = this.isDesktop
        ? 1.52 + Math.random() * 0.3
        : 0.8 + Math.random() * 0.22;

      const dAng =
        Math.PI + (this.mometsInit ? Math.random() * Math.PI * 2 : 0); //Math.random() * Math.PI * 2;
      const speed = this.mometsInit ? this.getRandomSpeed() : 0; // Math.random() * 0.5 + 0.2;
      const group = new Group();
      // const dY = (Math.random() - 0.5) * (this.isDesktop ? 0.5 : 1.2);
      // const dY = (-0.5 + (Math.cos((i / 35) * Math.PI * 2) + 1) / 2) * 0.5;
      const dY = (-0.5 + i / 35) * 0.5;
      string.position.z = rad;
      group.rotation.y = dAng;

      //string.material.uniforms.rad.value = rad;
      //string.material.uniforms.speed.value = 1 + Math.random() * 0.5;

      group.add(string);
      // this.scene.add(string);
      group.position.y = dY;
      this.scene.add(group);
      string.sync(() => {
        const bgRad = rad - 0.002;

        const geometry = new CylinderBufferGeometry(
          bgRad,
          bgRad,
          this.string.fontSize + 0.02,
          30,
          1,
          true,
          -(string.geometry.boundingBox.max.x * 2 + 0.03) / 2 / bgRad,
          (string.geometry.boundingBox.max.x * 2 + 0.03) / bgRad
        );
        string.curveRadius = -rad;
        string.sync();
        const bgMesh = new Mesh(geometry, this.bgMat.clone());
        group.add(bgMesh);
        bgMesh.momentId = this.moments.length;

        this.moments.push({
          string,
          group,
          rad,
          speed,
          dAng,
          addAng: 0,
          storyId,
          dY,
          bg: bgMesh,
          text: string.text,
          hover: false,
        });
      });
    }
    if (!this.mometsInit) {
      gsap.delayedCall(4, () => {
        this.explore.phi = 0;
        this.stringAnim();
      });
    }
    this.mometsInit = true;
    // gsap.delayedCall(8, () => {
    //   this.stringAnim();
    // });
  }

  stringAnim() {
    this.explore.controls.enabled = true;
    gsap.to(this.moments, {
      duration: 2,
      dAng: () => {
        return Math.random() * Math.PI * 2;
      },
      speed: () => {
        return this.getRandomSpeed();
      },
      ease: "sine.inOut",
    });
  }

  getRandomSpeed() {
    return Math.random() * 1.1 + 0.1;
  }

  setMometsSpeed() {
    gsap.to(this.moments, {
      duration: 0.3,
      speed: () => {
        return this.getRandomSpeed();
      },
      ease: "sine.in",
    });
  }

  canvasClick() {
    //
  }

  hitTestStrings(pos) {
    this.raycaster.setFromCamera(pos, this.camera);
    let intersects = this.raycaster.intersectObjects(
      this.moments.map((s) => {
        return s.bg;
      })
    );

    if (intersects.length > 0 && intersects[0].distance < 6) {
      return intersects[0];
    } else {
      return undefined;
    }
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

  updateMoments(delta) {
    this.explore.controls.fps = delta;
    this.explore.controls.update();
    const intersect = this.hitTestStrings(this.mouse.pos);
    const currentHoverId = this.explore.hoverId;
    if (intersect) {
      // low speed on hover
      if (this.moments[intersect.object.momentId].hover === false) {
        gsap.to(this.moments[intersect.object.momentId], {
          duration: 0.2,
          speed: 0.0,
          ease: "sine.inOut",
        });
      }
      this.moments[intersect.object.momentId].hover = true;
      if (
        intersect.object.momentId !== currentHoverId &&
        currentHoverId !== ""
      ) {
        // random speed if hover changed
        gsap.to(this.moments[currentHoverId], {
          duration: 0.3,
          speed: this.getRandomSpeed(),
          ease: "sine.in",
        });
      }
      this.explore.hoverId = intersect.object.momentId;
      this.mouse.hover = true;
      globalBus.setHover(true);
    } else {
      this.mouse.hover = false;
      globalBus.setHover(false);
      if (this.explore.hoverId !== "") {
        // random speed if hover leave
        gsap.to(this.moments[this.explore.hoverId], {
          duration: 0.3,
          speed: this.getRandomSpeed(),
          ease: "sine.in",
        });
      }
      this.explore.hoverId = "";
    }
    this.moments.forEach((moment) => {
      moment.addAng += 0.004 * moment.speed;
      moment.group.rotation.y = moment.addAng + moment.dAng;
      moment.group.rotation.y -= this.explore.phi;
      if (moment.hover) {
        moment.bg.material.color = this.bgColorHover;
      } else {
        moment.bg.material.color = this.bgColor;
      }
      moment.hover = false;

      // const string = moment.string;
      // string.position.z = Math.cos(moment.group.rotation.y) * moment.rad;
      // string.position.x = Math.sin(moment.group.rotation.y) * moment.rad;
      // string.rotation.y = moment.group.rotation.y;
      // string.position.y = moment.dY;
    });
  }

  animate(nowMsec) {
    this.lastTimeMsec = this.lastTimeMsec || nowMsec - 1000 / 60;
    const deltaMsec = Math.min(200, nowMsec - this.lastTimeMsec);
    this.lastTimeMsec = nowMsec;
    if (this.needsResize) {
      this.onWindowResize();
    }
    this.updateMoments(deltaMsec);

    // this.camera.position.x +=
    //   (this.mouse.pos.x * 1.6 - this.camera.position.x) * 0.02;
    // this.camera.position.y +=
    //   (this.mouse.pos.y * 0.4 - this.camera.position.y) * 0.02;

    // this.mixers.forEach((mixer) => {
    //   mixer.update(deltaMsec / 1000);
    // });

    //this.mixer && this.mixer.update(deltaMsec / 1000);

    //this.controls.update();
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
@import "~@/assets/scss/mixins";
@import "~@/assets/scss/const";
.button {
  z-index: 1;
  margin-bottom: 10px;
  @include tablet {
    margin-bottom: 160px;
  }
  opacity: 1 !important;
  &:hover {
    opacity: 0.85 !important;
  }
}
.ar {
  overscroll-behavior: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;

  @include tablet {
    justify-content: flex-end;
    height: 100%;
  }
  &__canvas {
    left: 0;
    top: 0;
    background: $bg_color;
    @include tablet {
      position: fixed;
    }
    // top: 50%;
    // transform: translateY(-50%);
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
