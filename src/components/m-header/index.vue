<template>
  <div class="header">
    <div class="icon"></div>
    <div class="text">Chicken Music</div>
    <router-link to="/user" class="mine" tag="div">
      <i class="iconfont icon-yonghu"></i>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.header {
  height: 44px;
  line-height: 44px;
  text-align: center;
  // color: #ffcb32;
  position: relative;
  .icon {
    display: inline-block;
    vertical-align: top;
    width: 30px;
    height: 32px;
    margin-top: 6px;
    margin-right: 9px;
    background-image: url("../../assets/image/logo@2x.png");
    background-size: 30px 32px;
  }
  .text {
    font-size: $font-size-large;
    display: inline-block;
    line-height: 44px;
    vertical-align: top;
  }
  .mine{
    position: absolute;
    right: 0;
    top: 0;
    .icon-yonghu {
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
    }
  }
}
</style>