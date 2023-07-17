<template>
  <svg :class="svgClass" :style="svgStyle" v-bind="svgAttrs" aria-hidden="true">
    <use :xlink:href="symbolID" :fill="color" />
  </svg>
</template>

<script>
  export default {
    props: {
      prefix: {
        type: String,
        default: () => 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        default: () => '1em',
      },
      width: {
        type: String,
        default: () => '',
      },
      height: {
        type: String,
        default: () => '',
      },
      color: {
        type: String,
        default: 'currentColor',
      },
      className: {
        type: String,
        default: '',
      },
    },
    computed: {
      symbolID() {
        return `#${this.prefix}-${this.name}`;
      },
      svgStyle() {
        return `
          display: inline-block;
          width: ${this.size};
          height: ${this.size};
          position: relative;
          fill: ${this.color};
          color: ${this.color};
          vertical-align: -2px;
        `;
      },
      svgAttrs() {
        return {
          width: this.width || this.size,
          height: this.height || this.size,
          fill: this.color,
        };
      },
      svgClass() {
        return `svg-icon ${this.className}`.trim();
      },
    },
  };
</script>
