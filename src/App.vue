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
  <OpenList></OpenList>
  <HotSearchList></HotSearchList>
  <SuggestList></SuggestList>
  <Lyric></Lyric>
</template>

<script>
import Header from './components/Header'
import Navigation from './components/Navigation'
import Player from './components/Player'
import OpenList from './components/OpenList'
import HotSearchList from './components/HotSearchList'
import SuggestList from './components/SuggestList'
import Lyric from './components/Lyric'

export default {
  name: 'App',
  components: {
    Header,
    Navigation,
    Player,
    OpenList,
    HotSearchList,
    SuggestList,
    Lyric
  }
}
</script>

<style lang="less" scoped>
@import url('./assets/reset.css');

.el-container.root {
  padding: 0px;
  margin: 0px;
  min-width: 1000px;
  min-height: 640px;
  width: 1000px;
  overflow: hidden;

  .el-header {
    padding: 0px;
    position: fixed;
    width: 100%;
    height: 50px;
    z-index: 20;
  }

  .el-container.content {
    position: relative;
    top: 50px;
    bottom: 60px;
    width: 100%;
    max-height: 538px;
    overflow: hidden;
    background-color: white;

    .el-side {
      height: 558px;
    }

    .el-main {
      // margin-bottom: 60px;
      overflow-x: hidden;
      overflow-y: scroll;
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
</style>
