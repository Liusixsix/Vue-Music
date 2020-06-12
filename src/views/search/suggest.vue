<template>
  <Scroll class="suggest" ref="suggest" :data="result"
   :pullup="true" 
  @scrollToEnd="searchMore"
  :beforeScroll='true'
   @beforeScroll='beforeScroll'>
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item,index) in result"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="name">
          <p class="text">{{item.name}}·{{item.artists[0].name}}</p>
        </div>
      </li>
    </ul>

    <div class="loading-container" v-show="loading">
      <van-loading />
    </div>
  </Scroll>
</template>

<script>
import { mapActions } from "vuex";
import Scroll from "@/base/scroll";
import { search } from "@/api/song";
import {createSong} from '@/utils/Song'
export default {
  components: { Scroll },
  props: {
    query: { type: String, default: "" }
  },
  data() {
    return {
      page: 0,
      result: [],
      hasMore: true, // 上拉加载标志位
      loading: true,
      
    };
  },
  watch: {
    query() {
      this.search();
    }
  },
  methods: {
    ...mapActions(["insertSong"]),
    search() {
      this.page = 0;
      this.$refs.suggest.scrollTo(0, 0);
      this.hasMore = true;
      this.loading = true;
      if (!this.query) return;
      search(this.query, this.page).then(res => {
        if (res.code === 200) {
          this.result = res.result.songs;
          this.checkMore(res.result.songs, res.result.songCount);
        }
      });
    },
    checkMore(data, songCount) {
      this.loading = false;
      const song = data;
      if (song.length && song.length * this.page >= songCount) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
    },
    selectItem({id,name,artists,duration}) {
    let song =   createSong({id,name,picUrl:artists[0].img1v1Url,duration:duration})
      this.insertSong(song);
      this.$emit('select',song)
    },
    //   滚动到底部
    searchMore() {
      if (!this.hasMore) return;
      this.loading = true;
      this.page++;
      search(this.query, this.page).then(res => {
        if (res.code == 200) {
          this.result = [...this.result, ...res.result.songs];
          this.checkMore(res.result.songs, res.result.songCount);
        }
      });
    },
    beforeScroll(){
      this.$emit('beforeScroll')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/variable";
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        @extend .no-wrap;
      }
    }
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
</style>