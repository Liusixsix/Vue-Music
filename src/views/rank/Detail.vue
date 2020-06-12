<template>
  <transition name="slide" appear>
    <music-list :title="singer.name" :bgImage="singer.picUrl"
    :songs='songs' rank></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { createSong } from "@/utils/Song";
import { getDisdetail } from "@/api/recommend";
import MusicList from "@/components/music-list";
export default {
  components: { MusicList },
  props: ["id"],
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["singer"])
  },
  methods: {
    _getRankSongList() {
      if (!this.singer.id) {
        this.$router.push("/rank");
        return;
      }
      getDisdetail(this.singer.id || this.id).then(res => {
        this.songs = this._normallizeSongs(res.playlist.tracks)
      });
    },
    _normallizeSongs(list) {
     
      const ret = [];
      list.forEach(item => {
        const { al, ar, privilege,dt } = item;
        const singerName = ar.map(item => item.name).join("/");
        ret.push(
          createSong({
            id: item.id,
            name: al.name,
            picUrl: al.picUrl,
            desc: al.name,
            singerName,
            duration:dt
          })
        );
      });
      return ret;
    }
  },
  mounted() {
    this._getRankSongList();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(
    100%,
    0,
    0
  ); // 100% 完全移动到屏幕右侧 动画开始后向左滑入
  // transform: translateX(100px);
}
</style>