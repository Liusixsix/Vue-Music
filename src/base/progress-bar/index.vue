<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress">
        <div
          class="progress-btn-wrapper"
          ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      touch: {}
    };
  },
  watch: {
    percent(newPercent) {
      if (newPercent > 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  methods: {
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`; // 进度条偏移
      this.$refs.progressBtn.style[
        "transform"
      ] = `translate3d(${offsetWidth}px, 0, 0)`; // 小球偏移
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX; // 当前拖动点X轴位置
      this.touch.left = this.$refs.progress.clientWidth; // 当前进度条位置
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) return;
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        barWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      console.log( e.pageX )
      const offsetWidth = e.pageX - rect.left
     this._offset(offsetWidth)
      this._triggerPercent()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    top: 13px;
    height: 4px;
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;

      .progress-btn-wrapper {
        position: absolute;
        width: 30px;
        height: 30px;
        //   background: red;
        left: -8px;
        top: -13px;

        .progress-btn {
          position: relative;
          width: 16px;
          height: 16px;
          background: $color-theme;
          border-radius: 50%;
          border: 3px solid $color-text;
          box-sizing: border-box;
          top: 7px;
          left: 7px;
        }
      }
    }
  }
}
</style>