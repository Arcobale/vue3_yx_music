<template>
  <div id="nav">
    <div class="login">
      <div class="no" v-if="cookie == ''">
        <img src="" alt="" class="user" @click="openQR">
        <span class="status" @click="openQR">未登录 ></span>
      </div>
      <div class="yes" v-else>
        <img :src="userInfo.avatarUrl" alt="" class="user">
        <span class="status">{{ userInfo.nickname }}</span>
      </div>
    </div>

    <el-menu router :default-active="activePath.split('/')[1]" class="el-menu-vertical-demo" active-text-color="#d74d45">
      <template v-for="(menu, index) in menus">
        <el-menu-item :index="menu.path" :key="index" v-if="!menu.hidden">
          <template #title>
            <component :is="menu.iconClass" style="height:16px; width: 16px; margin-right: 8px;" />
            <span>{{ menu.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>

    <el-dialog v-model="centerDialogVisible" width="35%" align-center draggable>
      <div class="content">
        <div class="qr-login">
          <span>扫码登录</span>
          <div class="qr-box">
            <img :src="QRImgUrl" alt="">
          </div>
          <div class="hint">
            使用
            <a href="https://music.163.com/#/download">网易云音乐App</a>
            扫码登录
          </div>
          <div class="other">
            选择其他登录方式 >
          </div>
        </div>

        <div class="phone-login">

        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import QRCodeVue from 'qrcode.vue'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter();
    const store = useStore();

    const centerDialogVisible = ref(false);
    const QRImgUrl = ref('');
    const QRCodeLinkParams = reactive({
      key: computed(() => store.state.login.QRKey),
      qrimg: true,
      timestamp: -1,
    })
    const cookie = ref('');
    const userInfo = reactive({
      avatarUrl: '',
      nickname: ''
    })

    const menus = computed(() => router.options.routes);
    const activePath = computed(() => {
      return router.currentRoute.value.fullPath;
    });

    function openQR() {
      centerDialogVisible.value = true;

      let timestamp = new Date().getTime();
      let timer = null;
      QRCodeLinkParams.timestamp = timestamp
      store.dispatch('getQRKey', { timestamp });
      // 轮询扫码状态接口
      timer = setInterval(() => {
        store.dispatch('getQRCheck', { key: QRCodeLinkParams.key, timestamp: new Date().getTime() }).then(() => {
          if (store.state.login.status === 803) {
            userInfo.avatarUrl = store.state.login.avatarUrl;
            userInfo.nickname = store.state.login.nickname;
            cookie.value = store.state.login.cookie;
            centerDialogVisible.value = false;
          }
        });
        if (store.state.login.status === 803) {
          timer = null;
        }
      }, 1000);
    }

    watch(QRCodeLinkParams, () => {
      store.dispatch('getQRCodeLink', QRCodeLinkParams).then(() => {
        QRImgUrl.value = store.state.login.QRCodeLink;
      });
    });

    return {
      menus,
      activePath,
      centerDialogVisible,
      openQR,
      QRImgUrl,
      userInfo,
      cookie
    }
  }
}
</script>

<style lang="less" scoped>
#nav {
  background: #edeced;
  width: 200px;
  min-height: 560px;
  overflow: hidden;
  padding-right: 7px;
  box-sizing: border-box;

  .login {
    .no, .yes {
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
  
      img {
        height: 38px;
        width: 38px;
        border-radius: 50%;
        background-color: gray;
        margin: 8px;
        cursor: pointer;
      }
  
      .status {
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  .el-menu {
    border: none;

    .el-menu-item {
      height: 35px;
      line-height: 35px;
      font-size: 12px;
      background: #edeced;
    }

    .el-menu-item:hover {
      background-color: #e1e1e1;
    }

    .is-active {
      background-color: #e1e1e1;
    }
  }

  .el-dialog {
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .qr-login {
        padding: 60px 0;

        span {
          display: block;
          font-size: 24px;
          text-align: center;
          font-weight: 500;
          color: black;
        }

        .qr-box {
          margin: 34px 0 18px;

          img {
            width: 170px;
            height: 170px;
            background-color: gray;
          }
        }

        .hint {
          font-size: 12px;
          text-align: center;

          a {
            text-decoration: none;
          }
        }

        .other {
          font-size: 10px;
          text-align: center;
          cursor: pointer;
          margin-top: 90px;
        }
      }
    }
  }
}
</style>