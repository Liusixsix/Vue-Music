<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" ref="list" @select="selectItem"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getSingerList } from "@/api/singer";
import Singer from "@/utils/Singer";
import ListView from "./listview";
import getPy from "@/utils/Py";
import { playlistMixin } from "@/utils/mixin";
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  components: { ListView },
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    };
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 200) {
          this.singers = this._normalizeSinger(res.artists);
        }
      });
    },
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              picUrl: item.picUrl
            })
          );
        }
        const key = getPy(item.name.substring(0, 1))[0].toUpperCase();
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }

        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            picUrl: item.picUrl
          })
        );
      });

      const hot = [];
      const ret = [];
      for (const key in map) {
        const val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return [...hot, ...ret];
    },
    selectItem(Singer) {
      console.log(Singer);
      this.setSinger(Singer);
      this.$router.push({
        path: `/singer/${Singer.id}`
      });
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom; // 底部播放器适配
      // this.$refs.scroll.refresh(); // 强制 scroll 重新计算
    }
  },
  created() {
    this._getSingerList();
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>