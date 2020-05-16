<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" />
    <div class="demo">字体大小</div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>

<style lang="scss" scoped>
.demo {
  width: 345px;
  margin: 0 auto;
  height: 415px;
  margin-top: 143px;
  background-color: pink;
  font-size: 14px;
}

</style>