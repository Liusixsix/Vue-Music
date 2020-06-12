<template>
  <transition name="slide" appear>
    <MusicList :title="title" :songs="songs" :bg-image="bgImg"></MusicList>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerList, getSingerDetail } from "@/api/singer";
import { createSong } from "@/utils/Song";
import MusicList from "@/components/music-list";
export default {
  components: { MusicList },
  data() {
    return {
      songs: []
    };
  },
  props: ["id"],
  computed: {
    title() {
      return this.singer.name;
    },
    bgImg() {
      return this.singer.picUrl;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id || this.id).then(res => {
        if (res.code === 200) {
          this.songs = this._normallizeSongs(res.hotSongs);
        }
      });
    },
    _normallizeSongs(list) {
      const ret = [];
      list.forEach(item => {
        const { al, ar, privilege,dt } = item;
        const singerName = ar.map(item => item.name).join("/");
        ret.push(
          createSong({
            id: privilege.id,
            name: item.name,
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
  created() {
    this._getDetail();
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