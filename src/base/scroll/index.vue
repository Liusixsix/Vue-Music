<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 100);
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true, // 禁止纵向滚动
        probeType: this.probeType,
        click: this.click
      });
      if (this.listenScroll) {
        let self = this;
        this.scroll.on('scroll',pos=>{
          self.$emit('scroll',pos)
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement(arg) {
      this.scroll && this.scroll.scrollToElement(arg);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  }
};
</script>