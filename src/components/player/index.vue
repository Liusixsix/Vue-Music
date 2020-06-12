<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      appear
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.picUrl" width="100%" height="100%" alt />
        </div>
        <div class="top">
          <div class="back">
            <i class="iconfont icon-fanhui" @click="back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singerName}}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.picUrl" width="100%" height="100%" alt class="image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentLineText}}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                  class="text"
                  ref="lyricLine"
                  :class="{'current':currentLineNum===index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>

          <div class="progess-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration,'ms')}}</span>
          </div>

          <div class="operators">
            <div class="icon i-left" @click="ChangeMode">
              <i class="iconfont" :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="iconfont icon-icon-1" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="iconfont icon-icon-" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-love-b"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini" appear>
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.picUrl" :class="cdCls" width="40" height="40" alt />
        </div>
        <div class="text">
          <div class="name">{{currentSong.name}}</div>
          <div class="desc">{{currentSong.singerName}}</div>
        </div>
        <div class="control">
          <progress-circle :percent="percent">
            <i class="iconfont icon-mini" :class="playIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop.prevent="showPlaylist">
          <i class="iconfont icon-ziyuan"></i>
        </div>
      </div>
    </transition>
    <paly-list ref="playlist"></paly-list>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="timeupdate"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import progressBar from "@/base/progress-bar";
import progressCircle from "@/base/progress-circle";
import palyList from '../play-list'
import { playMode } from "@/utils/config";
import { shuffle } from "@/utils/util";
import Scroll from "@/base/scroll";
import Lyric from "lyric-parser";
export default {
  components: { progressBar, progressCircle, Scroll,palyList },
  data() {
    return {
      songReady: false,
      currentTime: null,
      currentLyric: null,
      currentLineNum: 0,
      currentLineText: null,
      currentShow: "cd"
    };
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ]),
    playIcon() {
      return this.playing ? "icon-bofang" : "icon-ziyuan";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-fanhuiyulan"
        : this.mode === playMode.loop
        ? "icon-xunhuanbofang"
        : "icon-suijibofang";
    },
    percent() {
      return this.currentTime / (this.currentSong.duration / 1000);
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return;
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      
      setTimeout(()=>{
        this.getLyric();
        this.$refs.audio.play();
      },1000)
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      SetPlayingState: "SET_PLAYING_STATE",
      setCrrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    showPlaylist(){
      this.$refs.playlist.show()
    },
    getLyric() {
      this.currentSong
        .getLyric&&this.currentSong
        .getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(err => {
          this.currentLyric = null;
          this.currentLineText = null;
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.currentLineText = txt;
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        "transform"
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style["transform"] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40; // mini-player icon宽度
      const paddingLeft = 40;
      const paddingBottom = 30; // mini-player icon中心距底部位置
      const paddingTop = 80;
      const width = window.innerWidth * 0.8; // cd-wrapper宽度
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft); // X轴方向移动的距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    togglePlaying() {
      if (!this.songReady) return;
      this.SetPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    prev() {
      if (!this.songReady) return;
      if (this.playList.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCrrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) return;
      if (this.playList.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCrrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval, ms) {
      if (ms) {
        interval = interval / 1000;
      }
      interval = interval;
      const minute = (interval / 60) | 0;
      const secoud = this._pad(interval % 60 | 0);
      return `${minute}:${secoud}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime =
        (percent * this.currentSong.duration) / 1000;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime);
      }
    },
    ChangeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCrrentIndex(index);
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pagey;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const left = this.currentShow == "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style["transitionDuration"] = `0ms`;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style["transitionDuration"] = 0;
    },
    middleTouchEnd() {
      this.touch.initiated = false;
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = "cd";
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style["transitionDuration"] = `300ms`;
      this.$refs.middleL.style.opacity = opacity;
    }
  },

  mounted() {
    this._getPosAndScale();
  },
  created() {
    this.touch = {};
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.player {
  .normal-player {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      //   background: red;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-fanhui {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
        @extend .no-wrap;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      //   background: yellow;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        // background: gray;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 10px solid hsla(0, 0%, 100%, 0.1);
            }
          }
        }

        .playing-lyric-wrapper {
          margin-top: 50px;
          text-align: center;
          color: $color-text-l;
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          text-align: center;
          overflow: hidden;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              font-size: $font-size-medium-x;
              color: $color-text;
              transition: 0.4s;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;

            transition: all 0.2s;
          }
        }
      }
      .progess-wrapper {
        display: flex;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          font-size: $font-size-small;
          flex-basis: 30px;
          line-height: 30px;
          color: $color-text;
          &-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;
          i {
            font-size: 30px;
          }
          &.disable {
            color: $color-theme-d;
          }
        }
        .i-left {
          text-align: right;
        }

        .i-right {
          text-align: left;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    display: flex;
    align-items: center;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex-basis: 40px;
      padding: 0 10px 0 20px;
      width: 40px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        @extend .no-wrap;
        margin-bottom: 2px;
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        @extend .no-wrap;
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex-basis: 30px;
      width: 30px;
      padding: 0 10px;
      .iconfont {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        top: 0;
        left: 0;
        position: absolute;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>