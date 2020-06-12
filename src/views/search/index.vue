
<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox v-model="query" ref="searchInp"></SearchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <div>
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            @click="addQuery(item.searchWord)"
            v-for="(item,index) in hotKey"
            :key="index"
          >{{item.searchWord}}</li>
        </ul>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @beforeScroll="beforeScroll" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
   

<script>
import { mapActions } from 'vuex'
import SearchBox from "./my-input";
import suggest from "./suggest";
import { SearchHot, search } from "@/api/song";
export default {
  components: { SearchBox, suggest },
  data() {
    return {
      query: "",
      hotKey: []
    };
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {});
      }
    }
  },
  methods: {
    ...mapActions(['saveSearchHistory']),
    addQuery(word) {
      this.$refs.searchInp.setQuery(word);
    },
    _getHotKey() {
      SearchHot().then(res => {
        if (res.code == 200) {
          this.hotKey = res.data.slice(0, 10);
        }
      });
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    beforeScroll() {
      this.$refs.searchInp.blur();
    }
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.search-box-wrapper {
  margin: 20px;
}

.shortcut-wrapper {
  margin: 0 20px;
  .title {
    margin-bottom: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: $color-highlight-background;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}

.search-result {
  position: fixed;
  width: 100%;
  top: 178px;
  bottom: 0;
}
</style>