<template>
  <div class="about">
    <van-nav-bar :title="$t('app.hello')" left-text="返回" right-text="按钮" left-arrow />
    <div class="content">
      <div class="cate-left">
        <ul>
          <li
            v-for="(item,index) of 20"
            class="van-hairline--bottom"
            :key="item"
            :class="{active:index==active}"
            @click="active=index"
          >{{item}}</li>
        </ul>
      </div>
      <div class="cate-right">
        <van-grid :border="false" :column-num="3">
          <van-grid-item>
            <van-image src="https://img.yzcdn.cn/vant/apple-1.jpg" />
          </van-grid-item>
          <van-grid-item>
            <van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
          </van-grid-item>
          <van-grid-item>
            <van-image src="https://img.yzcdn.cn/vant/apple-3.jpg" />
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <footer>底部</footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.about {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    display: flex;
    overflow: hidden;
    .cate-left {
      flex-basis: 100px;
      overflow-y: auto;
      li {
        height: 40px;
        line-height: 40px;
        background: #efefef;
        text-align: center;
        &.active {
          background: #fff;
          color: red;
        }
      }
    }
    .cate-right {
      flex: 1;
       overflow-y: auto;
    }
  }
}
footer {
  height: 54px;
}
</style>