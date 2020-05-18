<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list";
import { getSongList } from "@/api/recommend";
export default {
  props: { id: {} },
  components: { MusicList },
  mounted: function() {
    getSongList(this.id).then(res => {
      if (res.code === 0) {
        console.log(res.cdlist[0].songlist)
        // this.songs = this._normalizeSongs(res.cdlist[0].songlist);
      }
    });
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