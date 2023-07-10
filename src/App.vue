<template>
  <el-container class="root">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container class="content">
      <el-side>
        <Navigation></Navigation>
      </el-side>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>
      <Player></Player>
    </el-footer>
  </el-container>
  <SongDetail class="songdetail"></SongDetail>
  <OpenList class="openlist"></OpenList>
</template>

<script>
import Header from './components/Header'
import Navigation from './components/Navigation'
import Player from './components/Player'
import SongDetail from './components/SongDetail'
import OpenList from './components/OpenList'

export default {
  name: 'App',
  components: {
    Header,
    Navigation,
    Player,
    SongDetail,
    OpenList
  }
}
</script>

<style lang="less" scoped>
@import url('./assets/reset.css');

.root {
  padding: 0px;
  margin: 0px;
  min-width: 1000px;
  min-height: 670px;
  width: 1000px;
  height: 670px;

  .el-header {
    padding: 0px;
    position: fixed;
    width: 100%;
    height: 50px;
    z-index: 100;
  }

  .content {
    position: relative;
    top: 50px;
    bottom: 60px;
    width: 100%;
    .el-main {
      margin-bottom: 60px;
    }
  }

  .el-footer {
    padding: 0px;
    position: fixed;
    width: 100%;
    bottom: 0px;
    height: auto;
    z-index: 100;
  }
}

.songdetail {
  display: none;
}
.openlist {
  // display: none;
}
</style>
