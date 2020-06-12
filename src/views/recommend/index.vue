<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index" class="slider-item">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="(item,index) in discList"
              :key="index"
              class="item"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img :src="item.coverImgUrl" alt width="60" height="60" v-lazy="item.coverImgUrl" />
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">{{item.description}}</p>
              </div>
            </li>
          </ul>
          <div class="loading-container" v-if="!discList.length">
            <van-loading />
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getRecommend, getDiscList } from "@/api/recommend";
import { playlistMixin } from '@/utils/mixin'
import Singer from '@/utils/Singer'
import Slider from "@/base/slider";
import Scroll from "@/base/scroll";

export default {
  components: { Slider, Scroll },
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    handlePlaylist(playlist){
       const bottom = playlist.length > 0 ? "60px" : "";
       this.$refs.recommend.style.bottom = bottom; // 底部播放器适配
      this.$refs.scroll.refresh(); // 强制 scroll 重新计算
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === 200) {
          this.discList = res.playlists;
        }
      });
    },
    selectItem(item) {
      // console.log(item)
      const singer = new Singer({
        id:item.id,
        name:item.name,
        picUrl:item.coverImgUrl
      })
      // console.log(singer)
      this.setSinger(singer);
      this.$router.push({
        path: `/recommend/${item.id}`
      });
    }
  },

  created() {
    this._getRecommend();
    this._getDiscList();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px;
        // border: 1px solid red;

        .icon {
          flex-basis: 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
            @extend .no-wrap;
          }
          .desc {
            @extend .no-wrap;
            color: $color-text-d;
          }
        }
      }
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
}
</style>