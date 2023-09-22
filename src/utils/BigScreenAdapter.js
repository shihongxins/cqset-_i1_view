export class BigScreenAdapter {
  static singleton;
  constructor(designWidth = 1920, designHeight = 1080) {
    this.designWidth = designWidth;
    this.designHeight = designHeight;
    this.baseFontSize = 16;
    this.solution = null;
    if (!BigScreenAdapter.singleton) {
      BigScreenAdapter.singleton = this;
    }
    return BigScreenAdapter.singleton;
  }
  static throttle(fn, holdTime = 200, bindScope = null, immediate = false) {
    const wait = Math.max(holdTime, 200);
    let timer = 0;
    return function () {
      const context = bindScope || this;
      const args = arguments;
      const task = function () {
        fn.apply(context, args);
      };
      clearTimeout(timer);
      if (immediate) {
        if (Date.now() - timer > wait) {
          timer = Date.now();
          task();
        }
      } else {
        timer = setTimeout(task, wait);
      }
    };
  }
  static px2rem(px = 0) {
    const rootElement = document.documentElement;
    let rootFontSize = rootElement.style.fontSize;
    if (!/px$/i.test(rootFontSize)) {
      rootFontSize = getComputedStyle(rootElement).fontSize;
    }
    const rem = parseFloat(px) / parseFloat(rootFontSize);
    return +rem.toFixed(5);
  }
  static rem2px(rem = 0) {
    const rootElement = document.documentElement;
    let rootFontSize = rootElement.style.fontSize;
    if (!/px$/i.test(rootFontSize)) {
      rootFontSize = getComputedStyle(rootElement).fontSize;
    }
    const px = parseFloat(rem) * parseFloat(rootFontSize);
    return +px.toFixed(5);
  }
  static designPx2rem2pxInEchart(dpx = 0) {
    const rootElement = document.documentElement;
    let rootFontSize = rootElement.style.fontSize;
    if (!/px$/i.test(rootFontSize)) {
      rootFontSize = getComputedStyle(rootElement).fontSize;
    }
    const baseFontSize = BigScreenAdapter.singleton ? BigScreenAdapter.singleton.baseFontSize : 16;
    const ratio = rootFontSize / baseFontSize;
    return +(dpx * ratio).toFixed(5);
  }
  static camelCaseToKebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  _onEvent() {
    if (!this.solution) {
      throw new Error(
        'BigScreenAdapter: solution is not defined, please choose a solution by useXXXSolution() method'
      );
    }
    this.solution();
    ['resize', 'orientationchange', 'fullscreenchange'].forEach((eventName) => {
      window.addEventListener(eventName, this.solution);
    });
  }
  _offEvent() {
    if (!this.solution) {
      throw new Error('BigScreenAdapter: solution is not defined, no event to remove');
    }
    ['resize', 'orientationchange', 'fullscreenchange'].forEach((eventName) => {
      window.removeEventListener(eventName, this.solution);
    });
  }
  get remInfo() {
    const designRatio = this.designWidth / this.designHeight;
    const { innerWidth = 1920, innerHeight = 1080 } = window;
    const windowRatio = innerWidth / innerHeight;
    const val =
      (innerWidth / this.designWidth) *
      this.baseFontSize *
      (Math.min(designRatio, windowRatio) / windowRatio);
    const isMinist = val < 12;
    return {
      val: +Math.max(val, 12).toFixed(5),
      isMinist,
    };
  }
  useRemSolution(baseFontSize = 16) {
    this.baseFontSize = parseFloat(baseFontSize) || 16;
    this.solution = BigScreenAdapter.throttle(
      function () {
        const rootElement = document.documentElement;
        rootElement.style.fontSize = `${this.remInfo.val}px`;
        rootElement.style.setProperty('--rem-val', rootElement.style.fontSize);
        console.log('BigScreenAdapter useRemSolution', this.remInfo);
      },
      200,
      this
    );
    this._onEvent();
  }
  useScaleSolution(options = {}) {
    const {
      target,
      keepRatio = true,
      parentOverflowHidden = true,
      withImportant = false,
      inlineStyle = false,
    } = options;
    const targetElement =
      target instanceof HTMLElement ? target : document.querySelector(target || 'body');
    if (!targetElement) {
      throw new Error('BigScreenAdapter useScaleSolution target is not HTMLElement');
    }
    if (parentOverflowHidden) {
      const parentElement = targetElement.parentElement || document.documentElement;
      parentElement.style.overflow = 'hidden';
    }
    const important = withImportant ? ' !important' : '';
    this.solution = BigScreenAdapter.throttle(
      function () {
        const { innerWidth = 1920, innerHeight = 1080 } = window;
        let scaleX = +(innerWidth / this.designWidth).toFixed(5);
        let scaleY = +(innerHeight / this.designHeight).toFixed(5);
        let marginTop = 0,
          marginBottom = 0,
          marginLeft = 0,
          marginRight = 0;
        let width = this.designWidth,
          height = this.designHeight;
        /**
         * 不保持宽高比，两端拉伸
         *
         * 保持宽高比
         *    屏幕过宽，取Y轴缩放值，适应高度，两边留白
         *    屏幕过高，取X轴缩放值，适应宽度，上下留白
         */
        if (keepRatio) {
          scaleX = scaleY = Math.min(scaleX, scaleY);
          marginTop = Math.floor((innerHeight - this.designHeight * scaleY) / 2) + 'px';
          marginLeft = marginRight =
            Math.floor((innerWidth - this.designWidth * scaleX) / 2) + 'px';
        } else {
          console.log("don't keep ratio");
        }
        const styleObj = {
          margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft} ${important}`,
          width: `${width}px ${important}`,
          height: `${height}px ${important}`,
          /*
          position: `absolute ${important}`,
          top: `50% ${important}`,
          left: `50% ${important}`,
          */
          transformOrigin: `0 0 ${important}`,
          // transform: `scale(${scaleX}) translate(-50%, -50%) ${important}`,
          transform: `scale(${scaleX}, ${scaleY}) ${important}`,
          // transition: `all 0s ${important}`,
        };
        const cssText =
          Object.entries(styleObj)
            .map(([k, v]) => `${BigScreenAdapter.camelCaseToKebabCase(k)}:${v}`)
            .join(';') + ';';

        const styleElement =
          document.querySelector('style#big-screen-adapter') ||
          document.head.appendChild(document.createElement('style'));
        styleElement.id = 'big-screen-adapter';

        if (inlineStyle) {
          targetElement.style.cssText = cssText;
        } else {
          styleElement.innerHTML = `
            .big-screen-adapter { ${cssText} }
          `;
          targetElement.classList.add('big-screen-adapter');
        }
        console.log('BigScreenAdapter useScaleSolution', styleObj, innerWidth, innerHeight);
      },
      200,
      this
    );
    this._onEvent();
  }
}
