<template>
  <div id="footer">
    <div class="song">
      <div class="cover"></div>
      <div class="song-detail">
        <div class="song-detail-info">
          <span class="info-title">达尔文</span>
          <span class="info-singer"> - 林俊杰</span>
        </div>
        <div class="song-detail-length">
          00:00 / 04:06
        </div>
      </div>
    </div>
    <div class="player">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-heart"></use>
      </svg>
      <svg class="icon skip" aria-hidden="true">
        <use xlink:href="#icon-skipback"></use>
      </svg>
      <div class="play">
        <!-- <i class="iconfont icon-play1"></i> -->
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-play2"></use>
        </svg>
      </div>
      <svg class="icon skip" aria-hidden="true">
        <use xlink:href="#icon-skipforward"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-share"></use>
      </svg>
    </div>
    <div class="controler">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-danquxunhuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-icon_playlist"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-geciweidianji"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-004laba-2"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
#footer {
  height: 60px;
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  color: #9b9b9b;

  .icon {
    width: 16px;
    height: 16px;
  }

  .song {
    width: 300px;
    font-size: 10px;
    display: flex;
    align-items: center;

    .cover {
      background-color: white;
      width: 38px;
      height: 38px;
      margin: 0 8px;
    }
    .song-detail {
      .song-detail-info {
        .info-title {
          font-size: 12px;
          color: #000000;
        }
        margin-bottom: 4px;
      }
    }
  }

  .player {
    width: 300px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .skip {
      fill: #c3473a;
    }
    .play {
      background-color: #c3473a;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: relative;

      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        fill: white;
      }
    }
  }

  .controler {
    width: 215px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>