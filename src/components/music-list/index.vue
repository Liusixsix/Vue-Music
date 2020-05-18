<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log("list");
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: $color-background;
}
</style>