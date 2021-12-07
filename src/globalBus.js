import Vue from 'vue';
import { Vector2 } from 'three';

const globalBus = new Vue({
  width: window.innerWidth,
  height: window.innerHeight,
  data: {
    mouse: {
      x: 0,
      y: 0,
      pos: new Vector2(-1,-1),
      lastPos: new Vector2(),
      dragObject: null,
      lastX: 0,
      lastY: 0,
      offsetX: 0,
      offsetY: 0,
      isDown: false,
      hover: false,
    },  
  },
  computed: {
    isTouchDevice() {
      const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
      function mq(query) {
        return window.matchMedia(query).matches;
      }
      if (('ontouchstart' in window) || window.DocumentTouch) {
        return true;
      }
      // include the 'heartz' as a way to have a non matching MQ to help terminate the join
      // https://git.io/vznFH
      const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
      return mq(query);
    },
    ie11() {
      return !!window.MSInputMethodContext && !!document.documentMode;
    },
  },
  methods: {
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.$emit('resize', { width: window.innerWidth, height: window.innerHeight });
    },
    mousemove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.pos.set( ( e.clientX / window.innerWidth ) * 2 - 1,  - ( e.clientY / window.innerHeight ) * 2 + 1);

      this.$emit('mousemove');
    },
    mousedown(e) {
      this.mouse.isDown = true;
      this.mouse.pos.set( ( e.clientX / window.innerWidth ) * 2 - 1,  - ( e.clientY / window.innerHeight ) * 2 + 1);
      this.mouse.lastPos.copy( this.mouse.pos);     
    },
    mouseup() {
      this.mouse.isDown = false;
      this.$emit('mouseup', this.mouse.pos);
    },
    onVisibilityChange() {
      if (!document[this.hidden]) {
        this.$emit('tabVisible');
      }
    }, 
    setHover(value) {
        this.mouse.hover = value;
        //console.log( this.mouse.hover);
    }
  },
  created() {
     window.addEventListener('resize', this.resize);
    // window.addEventListener('mousedown', this.mousedown);
    // window.addEventListener('mouseup', this.mouseup);
    // window.addEventListener('mousemove', this.mousemove);
    // VISIBILITY
    let visibilityChange = 'visibilitychange';
    this.hidden = '';
    if (typeof document.hidden !== 'undefined') {
      this.hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      this.hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    document.addEventListener(visibilityChange, this.onVisibilityChange, false);
  },
});

export default globalBus;
