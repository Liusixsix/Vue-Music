<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList">
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
            <li v-for="(item,index) in discList" :key="index" class="item">
             
              <div class="icon">
                <img :src="item.imgurl" alt width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "@/api/recommend";
import Slider from "@/base/slider";
import Scroll from "@/base/scroll";
export default {
  components: { Slider, Scroll },
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === 0) {
          //  console.log(this.discList);
          this.discList = res.data.list;
        }
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
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>