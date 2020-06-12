<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" :key="index" class="item" @click="selectItem(song, index)">
       <div class="rank" v-if="rank">
         <span class="text">{{index+1}}</span>
       </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singerName}}·{{song.desc}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: { type: Array, default: null },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable";
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
  }
  .rank{
    flex-basis: 25px;
    margin-right: 30px;
    text-align: center;
    .text{
      font-size: $font-size-large;
    }
  }
  .content {
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name {
       @extend .no-wrap;
      color: $color-text;
    }
    .desc {
       @extend .no-wrap;
      margin-top: 4px;
      color: $color-text-d;
    }
  }
}


</style>