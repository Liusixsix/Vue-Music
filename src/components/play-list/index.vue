<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode"></i>
            <span class="text">{{modeText}}</span>
          </h1>
        </div>
        <Scroll class="list-content" ref="listContent">
          <transition-group name="list" tag="ul">
            <li
              class="item"
              v-for="(item,index) of sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
               ref="listItem"
            >
              <i :class="getCurrentIcon(item)"></i>
              <div class="text">{{item.name}}</div>
              <span class="delete"></span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add">
            <div class="text">添加歌曲到队列</div>
          </div>
        </div>
        <div class="list-close" @click="hide">关闭</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { playMode } from "@/utils/config";
import Scroll from "@/base/scroll";
export default {
  components: { Scroll },
  computed: {
    ...mapGetters(["mode", "sequenceList", "currentSong", "playlist"]),
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-fanhuiyulan"
        : this.mode === playMode.loop
        ? "icon-xunhuanbofang"
        : "icon-suijibofang";
    },
      modeText() {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.random
          ? '随机播放'
          : '单曲循环'
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  watch: {
      currentSong(newSong, oldSong){
          if(!this.showFlag ||  newSong.id === oldSong.id) return
          this.scrollToCurrent(newSong)
      }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING_STATE"
    }),
    show() {
      this.showFlag = true;
      this.$nextTick(()=>{
            this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      return this.currentSong.id === item.id ? "iconfont icon-ziyuan" : "";
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
     this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.playlist {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 30px;
          margin-right: 10px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        i {
          // margin-right: 10px;
          font-size: $font-size-small;
          color: $color-theme-d;
          width: 20px;
        }
        .text {
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px;
      .add {
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
      }
    }
    .list-close {
      text-align: center;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
      line-height: 50px;
    }
  }
}
</style>