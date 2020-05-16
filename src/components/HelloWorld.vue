<template>
  <div class="hello">
    <van-nav-bar
      :title="$t('app.hello')"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <form action="/">
      <van-search show-action placeholder="请输入搜索关键词" />
    </form>

    <div>
      
    </div>
  </div>
</template>

<script>
import { i18n, vantLocales } from "../lang";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return { heart: "" };
  },
  methods: {
    onClickLeft() {
      vantLocales("zh");
      i18n.locale = "zh";
    },
    onClickRight() {
      vantLocales("en");
      i18n.locale = "en";
    },
    
  },
  mounted() {
  
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
