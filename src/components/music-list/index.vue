<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="$router.back()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll" :probe-type="3" listenScroll class="list" ref="list" >
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <van-loading />
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SongList from "@/base/song-list";
import Scroll from "@/base/scroll";
import { playlistMixin } from '@/utils/mixin'
const RESERVED_HEIGHT = 40; // 顶部以下偏移常量
export default {
  components: { Scroll, SongList },
  mixins:[playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  watch: {
    scrollY(newY) {
      const translateY = Math.max(this.minTranslateY, newY); // 设置最大滚动量，限制bg-layer滚动, 不小于 this.minTranslateY
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;
      let zIndex = 0;
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      let scale = 1,
        blur = 0;
      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.bgImage.style["transform"] = `scale(${scale})`;
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  methods: {
    ...mapActions(["selectPlay",'randomPlay']),
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
      // console.log(item, index);
    },
    random(){
       this.randomPlay({
        list: this.songs
      });
    },
    handlePlaylist(playlist){
       const bottom = playlist.length > 0 ? "60px" : "";
     this.$refs.list.$el.style.bottom = bottom; // 底部播放器适配
           this.$refs.list.refresh(); 
    },
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight; // 记录imageHeight，计算最远滚动位置，不超过minTranslateY
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-fanhui {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    transform-origin: top;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        margin: 0 auto;
        padding: 7px 0;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    // overflow: hidden;
  }
  .song-list-wrapper {
    padding: 20px 30px;
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