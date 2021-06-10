// This is primarily adopted from webxr-button.js
// copying the original license here
// TODO :: custom solution for buttons
//
//
//
// Copyright 2016 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

// This is a stripped down and specialized version of WebVR-UI
// (https://github.com/googlevr/webvr-ui) that takes out most of the state
// management in favor of providing a simple way of listing available devices
// for the needs of the sample pages. Functionality like beginning sessions
// is intentionally left out so that the sample pages can demonstrate them more
// clearly.

export default class p5xrButton {
  constructor(options) {
    this.options = options || {};

    this.options.color = options.color || 'rgb(237, 34, 93)';
    this.options.background = options.background || false;
    this.options.disabledOpacity = options.disabledOpacity || 0.5;
    this.options.height = options.height || window.innerWidth / 5;
    this.options.corners = options.corners || 'square';
    this.options.cssprefix = options.cssprefix || 'webvr-ui';

    this.options.textEnterXRTitle = options.textEnterXRTitle || 'ENTER XR';
    this.options.textXRNotFoundTitle = options.textXRNotFoundTitle || 'XR NOT FOUND';
    this.options.textExitXRTitle = options.textExitXRTitle || 'EXIT XR';

    this.options.onRequestSession = options.onRequestSession || (function () {});
    this.options.onEndSession = options.onEndSession || (function () {});

    this.options.injectCSS = options.injectCSS !== false;

    this.options = options;

    this.device = null;
    this.session = null;
    this.logoScale = 1.2;
    this._WEBXR_UI_CSS_INJECTED = {};

    // Pass in your own domElement if you really dont want to use ours
    this.domElement = options.domElement || this.createDefaultView(options);
    this.__defaultDisplayStyle = this.domElement.style.display || 'initial';

    // Bind button click events to __onClick
    this.domElement.addEventListener('click', () => this.__onXRButtonClick());

    this.__forceDisabled = false;
    this.__setDisabledAttribute(true);
    this.setTitle(this.options.textXRNotFoundTitle);
  }

  generateInnerHTML(cssPrefix, height) {
    const logoHeight = height * this.logoScale;
    const svgString = this.generateXRIconString(cssPrefix, logoHeight)
      + this.generateNoXRIconString(cssPrefix, logoHeight);

    return `<button class="${cssPrefix}-button">
    <div class="${cssPrefix}-title"></div>
    <div class="${cssPrefix}-logo" >${svgString}</div>
    </button>`;
  }

  createDefaultView(options) {
    const fontSize = options.height / 3;

    if (options.injectCSS) {
      // Check that css isnt already injected
      if (!this._WEBXR_UI_CSS_INJECTED[options.cssprefix]) {
        this.injectCSS(this.generateCSS(options, fontSize));
        this._WEBXR_UI_CSS_INJECTED[options.cssprefix] = true;
      }
    }

    const el = document.createElement('div');
    el.innerHTML = this.generateInnerHTML(options.cssprefix, fontSize);
    return el.firstChild;
  }

  createXRIcon(cssPrefix, height) {
    const el = document.createElement('div');
    el.innerHTML = generateXRIconString(cssPrefix, height);
    return el.firstChild;
  }

  createNoXRIcon(cssPrefix, height) {
    const el = document.createElement('div');
    el.innerHTML = generateNoXRIconString(cssPrefix, height);
    return el.firstChild;
  }

  generateXRIconString(cssPrefix, height) {
    const aspect = 28 / 18;
    return `<svg class="${cssPrefix}-svg" version="1.1" x="0px" y="0px"
        width="${aspect * height}px" height="${height}px" viewBox="0 0 28 18" xml:space="preserve">
        <path d="M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7
        c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l
        1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2 h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,
        1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6 V3.6C28,2.7,27.5,
        1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8
        C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7
        ,6.2,23,7.4,23,9 C23,10.5,21.7,11.8,20.1,11.8z"/>
    </svg>`;
  }

  generateNoXRIconString(cssPrefix, height) {
    const aspect = 28 / 18;
    return `<svg class="${cssPrefix}-svg-error" x="0px" y="0px"
        width="${aspect * height}px" height="${aspect * height}px" viewBox="0 0 28 28" xml:space="preserve">
        <path d="M17.6,13.4c0-0.2-0.1-0.4-0.1-0.6c0-1.6,1.3-2.8,2.8-2.8s2.8,1.3,2.8,2.8s-1.3,2.8-2.8,2.8
        c-0.2,0-0.4,0-0.6-0.1l5.9,5.9c0.5-0.2,0.9-0.4,1.3-0.8
        c0.7-0.7,1.1-1.6,1.1-2.5V7.4c0-1-0.4-1.9-1.1-2.5c-0.7-0.7-1.6-1-2.5-1
        H8.1 L17.6,13.4z"/>
        <path d="M10.1,14.2c-0.5,0.9-1.4,1.4-2.4,1.4c-1.6,0-2.8-1.3-2.8-2.8c0-1.1,0.6-2,1.4-2.5
        L0.9,5.1 C0.3,5.7,0,6.6,0,7.5v10.7c0,1,0.4,1.8,1.1,2.5c0.7,0.7,1.6,1,2.5,1
        h5c0.7,0,1.3-0.1,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.3-2.6 L10.1,14.2z"/>
        <path d="M25.5,27.5l-25-25C-0.1,2-0.1,1,0.5,0.4l0,0C1-0.1,2-0.1,2.6,0.4l25,25c0.6,0.6,0.6,1.5
        ,0,2.1l0,0 C27,28.1,26,28.1,25.5,27.5z"/>
    </svg>`;
  }

  /**
   * Sets the XRDevice this button is associated with.
   * @param {XRDevice} device
   * @return {EnterXRButton}
   */
  setDevice(device) {
    this.device = device;
    this.__updateButtonState();
    return this;
  }

  /**
 * Indicate that there's an active XRSession. Switches the button to "Exit XR"
 * state if not null, or "Enter XR" state if null.
 * @param {XRSession} session
 * @return {EnterXRButton}
 */
  setSession(session) {
    this.session = session;
    this.__updateButtonState();
    return this;
  }

  /**
 * Set the title of the button
 * @param {string} text
 * @return {EnterXRButton}
 */
  setTitle(text) {
    this.domElement.title = text;
    this.ifChild(this.domElement, this.options.cssprefix, 'title', (title) => {
      if (!text) {
        title.style.display = 'none';
      } else {
        title.innerText = text;
        title.style.display = 'initial';
      }
    });

    return this;
  }

  /**
 * Generate the CSS string to inject
 *
 * @param {Object} options
 * @param {Number} [fontSize=18]
 * @return {string}
 */
  generateCSS(options, fontSize = 18) {
    const { height } = options;
    const borderWidth = 2;
    const borderColor = options.background ? options.background : options.color;
    const cssPrefix = options.cssprefix;

    let borderRadius;
    if (options.corners == 'round') {
      borderRadius = options.height / 2;
    } else if (options.corners == 'square') {
      borderRadius = 2;
    } else {
      borderRadius = options.corners;
    }

    return (`
      @font-face {
          font-family: 'Karla';
          font-style: normal;
          font-weight: 400;
          src: local('Karla'), local('Karla-Regular'),
              url(https://fonts.gstatic.com/s/karla/v5/31P4mP32i98D9CEnGyeX9Q.woff2) format('woff2');
          unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
      }
      @font-face {
          font-family: 'Karla';
          font-style: normal;
          font-weight: 400;
          src: local('Karla'), local('Karla-Regular'),
              url(https://fonts.gstatic.com/s/karla/v5/Zi_e6rBgGqv33BWF8WTq8g.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074,
                        U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
      }

      button.${cssPrefix}-button {
          font-family: 'Karla', sans-serif;

          border: ${borderColor} ${borderWidth}px solid;
          border-radius: ${borderRadius}px;
          box-sizing: border-box;
          background: ${options.background ? options.background : 'none'};

          height: ${height}px;
          min-width: ${fontSize * 9.6}px;
          display: inline-block;
          position: absolute;
          top: 5%;
          left: 15%;
          cursor: pointer;
      }

      button.${cssPrefix}-button:focus {
        outline: none;
      }

      /*
      * Logo
      */

      .${cssPrefix}-logo {
          width: ${height}px;
          height: ${height}px;
          position: absolute;
          top:0px;
          left:0px;
          width: ${height - 4}px;
          height: ${height - 4}px;
      }
      .${cssPrefix}-svg {
          fill: ${options.color};
          margin-top: ${(height - fontSize * this.logoScale) / 2 - 2}px;
          margin-left: ${height / 3}px;
      }
      .${cssPrefix}-svg-error {
          fill: ${options.color};
          display:none;
          margin-top: ${(height - 28 / 18 * fontSize * this.logoScale) / 2 - 2}px;
          margin-left: ${height / 3}px;
      }


      /*
      * Title
      */

      .${cssPrefix}-title {
          color: ${options.color};
          position: relative;
          font-size: ${fontSize}px;
          padding-left: ${height * 1.05}px;
          padding-right: ${(borderRadius - 10 < 5) ? height / 3 : borderRadius - 10}px;
      }

      /*
      * disabled
      */

      button.${cssPrefix}-button[disabled=true] {
          opacity: ${options.disabledOpacity};
      }

      button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg {
          display:none;
      }

      button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg-error {
          display:initial;
      }
    `);
  }

  injectCSS(cssText) {
    // Create the css
    const style = document.createElement('style');
    style.innerHTML = cssText;

    const head = document.getElementsByTagName('head')[0];
    head.insertBefore(style, head.firstChild);
  }

  ifChild(el, cssPrefix, suffix, fn) {
    const c = el.querySelector(`.${cssPrefix}-${suffix}`);
    c && fn(c);
  }

  /**
 * Set the tooltip of the button
 * @param {string} tooltip
 * @return {EnterXRButton}
 */
  setTooltip(tooltip) {
    this.domElement.title = tooltip;
    return this;
  }

  /**
 * Show the button
 * @return {EnterXRButton}
 */
  show() {
    this.domElement.style.display = this.__defaultDisplayStyle;
    return this;
  }

  /**
 * Hide the button
 * @return {EnterXRButton}
 */
  hide() {
    this.domElement.style.display = 'none';
    return this;
  }

  /**
 * Enable the button
 * @return {EnterXRButton}
 */
  enable() {
    this.__setDisabledAttribute(false);
    this.__forceDisabled = false;
    return this;
  }

  /**
 * Disable the button from being clicked
 * @return {EnterXRButton}
 */
  disable() {
    this.__setDisabledAttribute(true);
    this.__forceDisabled = true;
    return this;
  }

  /**
 * clean up object for garbage collection
 */
  remove() {
    if (this.domElement.parentElement) {
      this.domElement.parentElement.removeChild(this.domElement);
    }
  }

  /**
 * Set the disabled attribute
 * @param {boolean} disabled
 * @private
 */
  __setDisabledAttribute(disabled) {
    if (disabled || this.__forceDisabled) {
      this.domElement.setAttribute('disabled', 'true');
    } else {
      this.domElement.removeAttribute('disabled');
    }
  }

  /**
 * Handling click event from button
 * @private
 */
  __onXRButtonClick() {
    if (this.session) {
      this.options.onEndSession(this.session);
    } else if (this.device) {
      // feature detect
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', () => {});
            }
          })
          .catch(console.error);
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', () => {});
            }
          })
          .catch(console.error);
      }

      this.options.onRequestSession(this.device);
    }
  }

  /**
 * Updates the display of the button based on it's current state
 * @private
 */
  __updateButtonState() {
    if (this.session) {
      this.setTitle(this.options.textExitXRTitle);
      this.setTooltip('Exit XR presentation');
      this.__setDisabledAttribute(false);
    } else if (this.device) {
      this.setTitle(this.options.textEnterXRTitle);
      this.setTooltip('Enter XR');
      this.__setDisabledAttribute(false);
    } else {
      this.setTitle(this.options.textXRNotFoundTitle);
      this.setTooltip('No XR headset found.');
      this.__setDisabledAttribute(true);
    }
  }
}
