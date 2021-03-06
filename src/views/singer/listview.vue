<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="true"
    @scroll="scroll"
    :probeType="3"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            v-for="(item,index) in group.items"
            :key="index"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img alt class="avatar" v-lazy="item.picUrl" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item,index) in shortcutList"
          :key="index"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixedTitle" v-show="fiexdTitle">
      <div class="fixed-title">{{fiexdTitle}}</div>
    </div>

    <div class="loading-container" v-if="!data.length">
      <van-loading />
    </div>
  </scroll>
</template>


<script>
import Scroll from "@/base/scroll";
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      touch: {},
      scrollY: -1,
      currentIndex: 0,
      listHeight: [],
      diff: -1
    };
  },
  watch: {
    data(list) {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i];
        const height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY; // 得到fixed title上边界距顶部的偏移距离
          return;
        }
      }
      this.currentIndex = listHeight.length - 2;
      //   console.log(this.currentIndex);
    },
   
    diff(newVal) {
      const fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) return;
      this.fixedTop = fixedTop;
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        // 得到title的集合数组，‘热门’取1个字
        return group.title.substr(0, 1);
      });
    },
    fiexdTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
     selectItem(item) {
      this.$emit("select", item);
    },
    getData(el, name, val) {
      const prefix = "data-";
      name = prefix + name;
      if (val) {
        return el.setAttribute(name, val);
      } else {
        return el.getAttribute(name);
      }
    },
    scroll(pos) {
      this.scrollY = pos.y; // 实时获取BScroll滚动的Y轴距离
    },
    onShortcutTouchStart(e) {
      const anchorIndex = this.getData(e.target, "index");
      const firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      const firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      const delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; // 获取列表项差值，| 0 向下取整
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) return;
      if (index < 0) {
        index = 0;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0); // 列表滚动定位 第二个参数表示：要不要滚动动画缓动时间; 0 瞬间滚动
    },
    _calculateHeight() {
      this.listHight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        const item = list[i]; // 得到每一个group的元素
        height += item.clientHeight; // DOM元素可以用clientHeight获取元素高度
        this.listHeight.push(height); // 得到每一个元素对应的height
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 30;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $color-highlight-background;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
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