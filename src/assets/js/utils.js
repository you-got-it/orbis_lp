/*
 * File Created: Monday, 3rd September 2018 11:42:26 am
 * Author: Artihovich Kirill (k_artikhovich@wargaming.net)
 * -----
 * Last Modified: Monday, 9th August 2021 4:08:59 am
 * Modified By: LENINGOLD (you@you.you)
 * -----
 * Copyright 2018 ALL RIGHTS RESERVED, Wargaming
 */
import { sRGBEncoding, Texture, MirroredRepeatWrapping } from "three";
/**
 * Creates random number from min to max
 * @param  {Number} min
 * @param  {Number} max
 */
export const random = (min, max) => Math.random() * (max - min) + min;

export const calculateDistance = (p1x, p1y, p2x, p2y) => {
  const xDistance = p1x - p2x;
  const yDistance = p1y - p2y;
  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
};

/* eslint no-restricted-syntax: ["error",  "WithStatement"] */
/**
 * Gets all values from object
 * @param  {Object} object with key-value, and nested key-value objects
 * @example
 * // returns ['key1', 'key2', 'key3'];
 * callGetAllValues({
 *  shot: 'key1',
 *   shot1: {
 *     shot2: 'key2',
 *     shot3: {
 *      shot4: 'key3',
 *    },
 *   },
 * });
 * @returns {Array}
 * Returns array of string values;
 */
const callGetAllValues = object1 => {
  const result = [];
  const getAllValues = object => {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (typeof object[key] === "string") {
          result.push(object[key]);
        } else if (typeof object[key] === "object") {
          getAllValues(object[key]);
        }
      }
    }
  };
  getAllValues(object1);
  return result;
};
/**
 * @typedef {Object} PreloadResult
 * @property {Image} image itself
 * @property {String} url of image
 */

/**
 * Preloads image and resolves a Promise with results
 * @param  {String} url
 * @returns {Promise<PreloadResult>} Promise object image itself and it's url
 */
export const preloadImage = (url, key) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve({ image, url, key });
    image.onerror = () => reject();
  });

/**
 * Preloads image and resolves a Promise with results
 * @param  {[String]} images array url
 * @returns {Promise<[PreloadResult]>} Array of objects - image itself and it's url
 */
const loadImages = images =>
  Promise.all(images.map(image => preloadImage(image.image, image.key)));

/**
 * Preloads all images from current banner set and resolves a Promise with results
 * @returns {Promise<[PreloadResult]>} Array of objects - image itself and it's url
 */
export const preload = shapes => {
  const allShapes = Object.keys(shapes)
    .map(itm => shapes[itm])
    .map((shape, index) => ({ image: shape, key: Object.keys(shapes)[index] }));
  return loadImages(allShapes);
};
/**
 * runs all promises, and return results even someting throw an error
 * @param {[Promise]} arrray of promises
 * @returns {[Result]} array of reults, don't forget to check if result is instance of Error
 */
export const PromiseAll = promises =>
  new Promise(resolve => {
    const results = [];
    let count = 0;
    promises.forEach((promise, idx) => {
      promise
        .catch(err => err)
        .then(valueOrError => {
          results[idx] = valueOrError;
          count += 1;

          if (count === promises.length) resolve(results);
        });
    });
  });

/**
 * merges two objects in one, usefull for options in functions
 * @param {Object} current
 * @param {Object} update
 * @returns {Object} changed original current
 */
function callMerge(current, update) {
  Object.keys(update).forEach(key => {
    // if update[key] exist, and it's not a string or array,
    // we go in one level deeper
    if (
      Object.prototype.hasOwnProperty.call(current, key) &&
      typeof current[key] === "object" &&
      !(current[key] instanceof Array)
    ) {
      callMerge(current[key], update[key]);

      // if update[key] doesn't exist in current, or it's a string
      // or array, then assign/overwrite current[key] to update[key]
    } else {
      current[key] = update[key];
    }
  });
  return current;
}

/**
 * merges two objects in one, usefull for options in functions
 * @param {Object} current
 * @param {Object} update
 * @returns {Object} new Object
 */
export function merge(current, update) {
  const first = { ...current };
  const second = { ...update };

  return callMerge(first, second);
}

export function trueAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return Math.round(alpha * 100) / 100;
}



export function newCanvas(width, height) {
  const canvas = document.createElement("CANVAS");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function MaskedCanvas(img, mask) {
  const canvas = newCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function radian(a) {
  return (a * Math.PI) / 180;
}

export function isTouchDevice() {
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const mq = function(query) {
    return window.matchMedia(query).matches;
  };

  if ("ontouchstart" in window || window.DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  return mq(query);
}

export function randomSign() {
  if (Math.random() < 0.5) {
    return -1;
  }
  return 1;
}

export function drawFrame(ctx, image, frame) {
  ctx.drawImage(
    image,
    frame[0],
    frame[1],
    frame[2],
    frame[3],
    -frame[5],
    -frame[6],
    frame[2],
    frame[3]
  );
}

CanvasRenderingContext2D.prototype.roundRect = function(
  x,
  y,
  width,
  height,
  radius
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

export function getTexture(image) {
  const texture = new Texture(image);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = MirroredRepeatWrapping;
  texture.needsUpdate = true;
  texture.encoding = sRGBEncoding;
  return texture;
}

Math.sign =
  Math.sign ||
  function(x) {
    x = +x; // преобразуем в число
    if (x === 0 || Number.isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };

export function radialGradientTexture({
  size = 256,
  r1 = 0,
  r2 = 1,
  fillColors,
  fillRatios
}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  // draw gradient
  context.rect(0, 0, size, size);

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    (size / 2) * r1,
    size / 2,
    size / 2,
    (size / 2) * r2
  );
  for (let i = 0; i < fillRatios.length; i++) {
    gradient.addColorStop(fillRatios[i], fillColors[i]);
  }

  //..gradient.addColorStop(fillRatios, ...fillColor); // light blue
  // gradient.addColorStop(1, '#e2e4e5'); // dark blue
  context.fillStyle = gradient;
  context.fill();
  return canvas;
}
