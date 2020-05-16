<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </div>
</template>
<script>
import MHeader from "components/m-header";
import tab from "components/tab";
export default {
  components: { MHeader, tab }
};
</script>
<style lang="scss">
@import "@/assets/style/variable.scss";
#app {
  color: $color-theme;
}
</style>
