/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
import {
	EventDispatcher,
	MOUSE,
	Quaternion,
	Spherical,
	Vector2,
	Vector3
} from "three";

import { trueAlpha } from './utils.js';

var ExploreControl = function (object, domElement) {

	this.object = object;

	this.domElement = (domElement !== undefined) ? domElement : document;



	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = true;
	this.dampingFactor = 0.045;


	this.mouseButtons = { LEFT: MOUSE.LEFT, MIDDLE: MOUSE.MIDDLE, RIGHT: MOUSE.RIGHT };
	this.rotateSpeed = 0.06;
	this.phi = 0;
	this.delta = 0;
	this.fps = 16.66;
	this.startX = 0;
	this.endX = 0;

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function () {

		var offset = new Vector3();

		return function update() {


			//phi += delta;
			this.delta = delta;
			//console.log(phi)
			//scope.rotateSpeed += (scope.sRotateSpeed - scope.rotateSpeed)*0.07;

			if (scope.enableDamping === true) {

				delta *= (1 - scope.dampingFactor * (this.fps / 16.66));

			}
			scope.object.phi += delta;
			return false;

		};

	}();

	this.dispose = function () {

		scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
		scope.domElement.removeEventListener('mousedown', onMouseDown, false);
		scope.domElement.removeEventListener('wheel', onMouseWheel, false);

		scope.domElement.removeEventListener('touchstart', onTouchStart, false);
		scope.domElement.removeEventListener('touchend', onTouchEnd, false);
		scope.domElement.removeEventListener('touchmove', onTouchMove, false);

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mouseup', onMouseUp, false);

		window.removeEventListener('keydown', onKeyDown, false);

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	var rotateStart = new Vector2();
	var rotateEnd = new Vector2();
	var rotateDelta = new Vector2();
	var startX = 0;

	var phi = 0;
	var delta = 0;


	var dollyStart = new Vector2();
	var dollyEnd = new Vector2();
	var dollyDelta = new Vector2();


	function rotateLeft(angle) {
		//scope.object.phi -= angle;
		delta -= angle;

	}



	function handleMouseDownRotate(event) {


		rotateStart.set(event.clientX, event.clientY);
		startX = rotateStart.x;

	}


	function handleMouseMoveRotate(event) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set(event.clientX, event.clientY);

		rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
		scope.rotateSpeed = trueAlpha(Math.abs(rotateEnd.x - startX) / (element.clientWidth * 0.25)) * 0.04;

		rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);

		rotateStart.copy(rotateEnd);

		scope.update();

	}

	function onMouseWheel(event) {
		if (scope.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		scope.dispatchEvent(startEvent);

		handleMouseWheel(event);

		scope.dispatchEvent(endEvent);

	}

	function handleMouseWheel(event) {
		rotateLeft(event.deltaY * 0.0001);
		/*if ( event.deltaY < 0 ) {

			rotateLeft( 0.01 );

		} else if ( event.deltaY > 0 ) {

			rotateLeft( -0.01 );

		}*/

		scope.update();

	}


	function handleTouchEnd(event) {

		//console.log( 'handleTouchEnd' );

	}
	function handleMouseUp(event) {

		// console.log( 'handleMouseUp' );

	}


	function handleTouchStartRotate(event) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
		scope.startX = event.touches[0].pageX;
		scope.endX = event.touches[0].pageX;

	}


	function handleTouchMoveRotate(event) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
		scope.endX = event.touches[0].pageX;
		rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		scope.rotateSpeed = trueAlpha(Math.abs(rotateEnd.x - startX) / (element.clientWidth * 0.25)) * 0.04;

		rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

		//rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

		rotateStart.copy(rotateEnd);

		scope.update();

	}


	function onMouseDown(event) {

		if (scope.enabled === false) return;

		// Prevent the browser from scrolling.

		event.preventDefault();

		// Manually set the focus since calling preventDefault above
		// prevents the browser from setting it automatically.

		scope.domElement.focus ? scope.domElement.focus() : window.focus();

		switch (event.button) {

			case scope.mouseButtons.LEFT:


				handleMouseDownRotate(event);

				state = STATE.ROTATE;
				break;
		}

		if (state !== STATE.NONE) {

			document.addEventListener('mousemove', onMouseMove, false);
			document.addEventListener('mouseup', onMouseUp, false);

			scope.dispatchEvent(startEvent);

		}

	}

	function onMouseMove(event) {

		if (scope.enabled === false) return;

		event.preventDefault();

		switch (state) {

			case STATE.ROTATE:

				if (scope.enableRotate === false) return;

				handleMouseMoveRotate(event);

				break;

			case STATE.DOLLY:

				if (scope.enableZoom === false) return;

				handleMouseMoveDolly(event);

				break;

			case STATE.PAN:

				if (scope.enablePan === false) return;

				handleMouseMovePan(event);

				break;

		}

	}

	function onMouseUp(event) {

		if (scope.enabled === false) return;

		handleMouseUp(event);

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mouseup', onMouseUp, false);

		scope.dispatchEvent(endEvent);

		state = STATE.NONE;

	}

	function onTouchStart(event) {

		if (scope.enabled === false) return;

		event.preventDefault();

		switch (event.touches.length) {

			case 1:	// one-fingered touch: rotate

				if (scope.enableRotate === false) return;

				handleTouchStartRotate(event);

				state = STATE.TOUCH_ROTATE;

				break;


			default:

				state = STATE.NONE;

		}

		if (state !== STATE.NONE) {

			scope.dispatchEvent(startEvent);

		}

	}

	function onTouchMove(event) {

		if (scope.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		switch (event.touches.length) {

			case 1: // one-fingered touch: rotate

				if (scope.enableRotate === false) return;
				if (state !== STATE.TOUCH_ROTATE) return; // is this needed?

				handleTouchMoveRotate(event);

				break;

			case 2: // two-fingered touch: dolly-pan

				if (scope.enableZoom === false && scope.enablePan === false) return;
				if (state !== STATE.TOUCH_DOLLY_PAN) return; // is this needed?

				handleTouchMoveDollyPan(event);

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd(event) {

		if (scope.enabled === false) return;

		handleTouchEnd(event);

		scope.dispatchEvent(endEvent);

		state = STATE.NONE;

	}

	function onContextMenu(event) {

		if (scope.enabled === false) return;

		event.preventDefault();

	}

	//

	scope.domElement.addEventListener('contextmenu', onContextMenu, false);

	scope.domElement.addEventListener('mousedown', onMouseDown, false);
	scope.domElement.addEventListener('wheel', onMouseWheel, false);

	scope.domElement.addEventListener('touchstart', onTouchStart, false);
	scope.domElement.addEventListener('touchend', onTouchEnd, false);
	scope.domElement.addEventListener('touchmove', onTouchMove, false);
	// force an update at start

	this.update();

};

ExploreControl.prototype = Object.create(EventDispatcher.prototype);
ExploreControl.prototype.constructor = ExploreControl;


export { ExploreControl };
