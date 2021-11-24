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
  explore = {};
  currentScene;
  groundPetals = [];
  models = {};
  explorePetals = [];
  mixer;
  mixers = [];
  debugString = "String";
  currentMarker = 0;
  lastMarker = -1;
  found = false;
  loading = true;
  markersLoading = true;
  loadedMarkers = 0;
  markers = [];
  layers = [];
  currentSubtitle = "";

  targetScene = 2;

  get getDebugString() {
    return this.debugString;
  }

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
    if (this.isDesktop) {
      this.controls.dispose();
    } else {
      this.arToolkitSource.domElement.srcObject.getTracks()[0].stop();
    }
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (!this.isDesktop) {
      this.threeCamera.updateProjectionMatrix();
      this.renderer.setSize((640 * this.height) / 480, this.height);
      this.renderer.setPixelRatio(1 + (window.devicePixelRatio - 1) * 0.34);
    } else {
      this.renderer.setPixelRatio(1);
      this.threeCamera.aspect = this.width / this.height;
      this.threeCamera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }
  }
  resizeAR() {
    this.arToolkitSource.onResizeElement();
    console.log(this.renderer.domElement.style.height);
    this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
    // const mat = this.arToolkitContext.getProjectionMatrix();
    // mat.elements[14] *= 200;
    // this.threeCamera.projectionMatrix.copy(mat);
    if (this.arToolkitContext.arController !== null) {
      // this.arToolkitSource.copyElementSizeTo(
      //   this.arToolkitContext.arController.canvas
      // );
    }
    console.log("resize2");
  }

  async startAR() {
    document.body.style.backgroundColor = "transparent";
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
    this.ambient = new AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambient);
    this.light = new DirectionalLight(0xffffff, 0.52);
    this.light.position.set(-1, 20, 15);
    this.scene.add(this.light);

    this.threeCamera = new PerspectiveCamera(56, 1, 1, 10000);
    this.threeCamera.position.set(0, 15, 40);
    this.threeCamera.position.set(-24, 10 + 4, 0);
    this.scene.add(this.threeCamera);

    // render
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      canvas: this.$refs["3d"],
    });
    this.renderer.setClearColor(0xffeea0, 0);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.autoClear = true;
    this.renderer.localClippingEnabled = true;
    this.initPlane = new Plane(new Vector3(0, 1, 0), 0);
    this.clippingPlane = this.initPlane.clone();
    //this.renderer.clippingPlanes = [this.clippingPlane];

    this.controls = new OrbitControls(this.threeCamera, this.$refs["3d"]);
    this.controls.target.set(0, -0.2, -0.2);
    this.controls.target.set(0, -0.2 + 4, 0.2);
    //this.controls.maxPolarAngle = 1.45;
    this.controls.update();
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = -2;
    this.sceneGroup = new Group();
    this.scene.add(this.sceneGroup);

    this.pmremGenerator = new PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
  }

  setupObjects() {
    //
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

  initAR() {
    //window.THREEx.ArToolkitContext.baseURL = "./";
    this.localUrl = this.getCorrectPath(window.location.pathname);
    window.THREEx.ArToolkitContext.baseURL = this.localUrl + "/";
    // window.THREEx.ArToolkitContext.baseURL =
    //   "https://wg-ads.com/banners/book/ar/";
    //const config = { video: { width: 320 /* 320-640-1280 */ } };
    /* const v = document.createElement('video');
  const start = () => navigator.mediaDevices.getUserMedia(config)
    .then(stream => v.srcObject = stream)
    .then(() => new Promise(resolve => v.onloadedmetadata = resolve))
    .then(() => log(`Success: ${v.videoWidth}x${v.videoHeight}`))
    .catch(log);
  start();
  var log = msg => this.$refs.log.innerHTML += `<p>${msg}</p>`; */
    this.arToolkitSource = new window.THREEx.ArToolkitSource({
      // to read from the webcam
      sourceType: "webcam",

      // sourceWidth: (window.innerWidth > window.innerHeight ? 640 : 480) * 1,
      // sourceHeight: (window.innerWidth > window.innerHeight ? 480 : 640) * 1,
      sourceWidth: (window.innerWidth > window.innerHeight ? 640 : 480) * 1,
      sourceHeight: (window.innerWidth > window.innerHeight ? 480 : 640) * 1,
      displayWidth: 640,
      displayHeight: 480,
      // displayWidth: 640,
      // displayHeight: 480,
    });

    this.arToolkitSource.init(() => {
      setTimeout(() => {
        this.resizeAR();
      }, 1000);
      window.addEventListener("resize", this.resizeAR.bind(this), false);
    });
    this.arToolkitContext = new window.THREEx.ArToolkitContext(
      {
        //cameraParametersUrl: this.localUrl + "./data/camera_para.dat",
        cameraParametersUrl: `data/camera_para.dat`,
        detectionMode: "mono",
        //patternRatio: 0.75,
        maxDetectionRate: 20,
        // canvasWidth: (window.innerWidth > window.innerHeight ? 640 : 480)*0.25,
        //  canvasHeight: (window.innerWidth > window.innerHeight ? 480 : 640)*0.25,
        canvasWidth: 640 * 0.25,
        canvasHeight: 480 * 0.25,
        //imageSmoothingEnabled: false,
        // sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
        // sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
      }
      // ,
      // {
      //   sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
      //   sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
      // }
    );

    this.onRenderFcts = [];
    this.onRenderFcts.push(() => {
      if (!this.arToolkitSource.ready) return;
      this.arToolkitContext.update(this.currentMarker);
      if (this.found === false) {
        this.currentMarker += 1;
        this.currentMarker %= this.arToolkitContext._arMarkersControls.length;
      }

      // update scene.visible if the marker is seen
    });
    const markerUrls = [
      this.localUrl + "/data/0/0",
      this.localUrl + "/data/1/1",
      this.localUrl + "/data/2/2",
      this.localUrl + "/data/3/3",
      this.localUrl + "/data/4/4",
    ];
    this.markers = [];
    this.markers = markerUrls.map((url, index) => {
      const marker = new window.THREEx.ArMarkerControls(
        this.arToolkitContext,
        this.markerRoot,
        {
          type: "nft",
          descriptorsUrl: url,
        }
      );
      marker.id = index;
      marker.addEventListener("markerFound", () => {
        this.currentMarker = index;
        if (this.lastMarker !== index) {
          this.lastMarker = index;
          this.setLayers(index);
        }
        this.found = true;
      });
      marker.addEventListener("loaded", () => {
        this.loadedMarkers += 1;
        if (this.loadedMarkers === markerUrls.length) {
          this.markersLoading = false;
        }
      });
      return marker;
    });
    // this.markerControls = new window.THREEx.ArMarkerControls(
    //   this.arToolkitContext,
    //   this.markerRoot,
    //   {
    //     type: "nft",
    //     descriptorsUrl: "data/1/1",
    //   }
    // );
    // this.markerControls1 = new window.THREEx.ArMarkerControls(
    //   this.arToolkitContext,
    //   this.markerRoot,
    //   {
    //     type: "nft",
    //     descriptorsUrl: "data/2/2",
    //   }
    // );
    // this.markerControls2 = new window.THREEx.ArMarkerControls(
    //   this.arToolkitContext,
    //   this.markerRoot,
    //   {
    //     type: "nft",
    //     descriptorsUrl: "data/3/3",
    //   }
    // );
    // this.markerControls3 = new window.THREEx.ArMarkerControls(
    //   this.arToolkitContext,
    //   this.markerRoot,
    //   {
    //     type: "nft",
    //     descriptorsUrl: "data/1/1",
    //   }
    // );
    // this.markerControls4 = new window.THREEx.ArMarkerControls(
    //   this.arToolkitContext,
    //   this.markerRoot,
    //   {
    //     type: "nft",
    //     descriptorsUrl: "data/2/2",
    //   }
    // );
    // this.markerControls.addEventListener("markerFound", (evt) => {
    //   this.currentMarker = 0;
    //   this.found = true;
    // });
    // this.markerControls1.addEventListener("markerFound", (evt) => {
    //   this.currentMarker = 1;
    //   this.found = true;
    // });
    // this.markerControls2.addEventListener("markerFound", (evt) => {
    //   this.currentMarker = 2;
    //   this.found = true;
    // });
    // this.markerControls3.addEventListener("markerFound", (evt) => {
    //   this.currentMarker = 3;
    //   this.found = true;
    // });
    // this.markerControls4.addEventListener("markerFound", (evt) => {
    //   this.currentMarker = 4;
    //   this.found = true;
    // });

    // initialize it
    this.arToolkitContext.init(() => {
      // copy projection matrix to camera
      // const mat = this.arToolkitContext.getProjectionMatrix();
      // mat.elements[14] *= 200;
      // this.threeCamera.projectionMatrix.copy(mat);
      const canvas = this.arToolkitContext.arController.canvas;
      // this.$el.appendChild(canvas);
      canvas.style.position = "fixed";
      canvas.style.zIndex = 55;
      canvas.style.left = 0;
    });
    // this.markerControls2.addEventListener("markerFound", (evt) => {
    //   console.log("onMarkerFound!!1");
    // });

    // build a smoothedControls
    this.smoothedRoot = new Group();
    this.scene.add(this.smoothedRoot);

    this.smoothedControls = new window.THREEx.ArSmoothedControls(
      this.smoothedRoot,
      {
        // lerp coeficient for the position - between [0,1] - default to 1
        lerpPosition: 0.03,
        // lerp coeficient for the quaternion - between [0,1] - default to 1
        lerpQuaternion: 0.03,
        // lerp coeficient for the scale - between [0,1] - default to 1
        lerpScale: 0.03,
        // delay for lerp fixed steps - in seconds - default to 1/120
        lerpStepDelay: 1 / 90,
        // minimum delay the sub-control must be visible before this controls become visible - default to 0 seconds
        minVisibleDelay: 0.0,
        // minimum delay the sub-control must be unvisible before this controls become unvisible - default to 0 seconds
        minUnvisibleDelay: 1,
      }
    );

    this.smoothedControls.addEventListener("markerLost", () => {
      this.found = false;
    });

    this.onRenderFcts.push(() => {
      this.smoothedControls.update(this.markerRoot);
    });

    // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
    this.onRenderFcts.push(() => {
      const ratio = this.renderer.getPixelRatio();
      const left = (this.renderer.domElement.width / ratio - this.width) / 2;
      // const { width } = this;
      //this.smoothedRoot.getWorldPosition();

      this.renderer.setScissorTest(true);
      this.renderer.setScissor(left, 0, this.width + 5, this.height);
      // this.threeCamera.position.x = 0;
      // this.threeCamera.position.y = 0;
      // this.threeCamera.position.z = 5;
      // this.markerRoot.position.set(0, 0, 0);
      // this.threeCamera.lookAt(this.markerRoot);
      //this.markerRoot.position.set(0, 0, 0);
      // this.markerRoot.scale.set(1, 1, 1);
      //console.log(this.markerRoot.scale.x);
      //this.smoothedRoot.position.y = -20;
      //this.markerRoot.visible = true;
      if (this.smoothedRoot) {
        this.clippingPlane
          .copy(this.initPlane)
          .applyMatrix4(this.smoothedRoot.matrixWorld);
      }
      this.renderer.render(this.scene, this.threeCamera);
    });

    this.lastTimeMsec = null;
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
    //console.log(this.arToolkitContext);
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
    console.log("wtf");
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

    this.mixers.forEach((mixer) => {
      mixer.update(deltaMsec / 1000);
    });
    this.layers.forEach((l) => {
      const wPos = new Vector3();
      l.children[1].getWorldPosition(wPos);
      l.cameraDist = this.threeCamera.position.clone().sub(wPos).length();
    });
    this.layers.sort(AR.sortLayers);
    this.layers.forEach((l, i) => {
      l.renderOrder = i + 1;
    });
    //this.mixer && this.mixer.update(deltaMsec / 1000);
    if (this.isDesktop) {
      this.controls.update();
      this.renderer.render(this.scene, this.threeCamera);
    } else {
      this.onRenderFcts.forEach((onRenderFct) => {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
      });
      //this.smoothedRoot.visible = this.markerRoot.visible;
    }
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
