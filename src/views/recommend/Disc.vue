<template>
  <transition name="slide" appear>
    <music-list :bgImage="singer.picUrl" :title="singer.name" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import MusicList from "@/components/music-list";
import { getDisdetail } from "@/api/recommend";
import { createSong } from "@/utils/Song";
export default {
  props: { id: {} },
  components: { MusicList },
  computed: {
    ...mapGetters(["singer"])
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/recommend");
        return;
      }
      getDisdetail(this.singer.id || this.id).then(res => {
        if (res.code === 200) {
          // console.log(res)
          this.songs = this._normallizeSongs(res.playlist.tracks);
        }
      });
    },
    _normallizeSongs(list) {
      const ret = [];
      list.forEach(item => {
        const { al, ar, dt } = item;
        const singerName = ar.map(item => item.name).join("/");
        ret.push(
          createSong({
            id: item.id,
            name: item.name,
            picUrl: al.picUrl,
            desc: al.name,
            singerName,
            duration: dt
          })
        );
      });
      return ret;
    }
  },
  mounted: function() {
    this._getDetail();
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>