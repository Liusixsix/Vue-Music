<template>
 <div class="singer" ref="singer">
    <list-view :data="singers"  ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "@/api/singer";
import Singer from "@/utils/Singer";
import ListView from "./listview";
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  components: { ListView },
  data() {
    return {
      singers: []
    };
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.singers = this._normalizeSinger(res.data.list);
          console.log(this.singers);
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
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }

        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
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