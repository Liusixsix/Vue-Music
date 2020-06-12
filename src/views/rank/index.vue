<template>
  <div class="toplist-wrapper" ref="toplist">
    <Scroll class="toplist-content" ref="scroll">
      <ul>
        <li class="item" v-for="(item,index) in dataList" :key="index" @click="select(item)">
          <div class="iocn">
            <img :src="item.coverImgUrl" width="100" height="100" alt />
          </div>
          <ul class="songList">
            <li
              class="song-item"
              v-for="(song,i) in item.tracks"
              :key="i"
            >{{i+1}} {{song.first}} - {{song.second}}</li>
            <li v-if="!item.tracks.length" class="song-item">暂无歌单</li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Singer from "@/utils/Singer";
import { toplist } from "@/api/rank";
import { playlistMixin } from "@/utils/mixin";
import Scroll from "@/base/scroll";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      dataList: []
    };
  },
  components: { Scroll },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.toplist.style.bottom = bottom; // 底部播放器适配
      this.$refs.scroll.refresh(); // 强制 scroll 重新计算
    },
    _toplist() {
      toplist().then(res => {
        if (res.code === 200) {
          this.dataList = res.list;
        }
      });
    },
    select(item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        picUrl: item.coverImgUrl
      });
      this.setSinger(singer);
      this.$router.push({
        path: `/rank/${item.id}`
      });
    }
  },
  mounted() {
    this._toplist();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.toplist-wrapper {
  position: fixed;
  top: 88px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  margin: 0 20px;
  background: $color-background;
  .toplist-content {
    height: 100%;
    overflow: hidden;
  }
  .item {
    display: flex;
    padding-top: 20px;
    color: $color-text-d;
    &:last-child {
      padding-bottom: 20px;
    }
    .icon {
      flex-basis: 100px;
      height: 100px;
    }
    .songList {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 20px;
      background-color: $color-highlight-background;
      box-sizing: border-box;
      overflow: hidden;
      .song-item {
        line-height: 26px;
        font-size: $font-size-small;

        @extend .no-wrap;
      }
    }
  }
}
</style>