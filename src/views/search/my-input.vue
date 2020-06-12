<template>
  <div class="search-box">
    <input type="text" v-model="query" ref="query" class="inp" :placeholder="placeholder" />
  </div>
</template>

<script>
import { debounce } from "@/utils/util";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
      setQuery(query){
          this.query = query;
      },
      blur(){
        this.$refs.query.blur();
      }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("input", newQuery);
      },200)
    )
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  //   width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .inp {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    border: none;
    outline: none;
    &::placeholder {
      color: $color-text-d;
    }
  }
}
</style>
