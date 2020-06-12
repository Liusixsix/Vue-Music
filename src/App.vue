<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import MHeader from "components/m-header";
import tab from "components/tab";
import player from "components/player";
export default {
  components: { MHeader, tab, player }
};
</script>
<style lang="scss">
@import "@/assets/style/variable.scss";
#app {
  color: $color-theme;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 1s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0,  0 ); // 100% 完全移动到屏幕右侧 动画开始后向左滑入
}
</style>
