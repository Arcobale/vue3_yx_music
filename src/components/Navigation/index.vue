<template>
  <div id="nav">
    <div class="login">
      <div class="no" v-if="!isLogin">
        <img src="" alt="" class="user" @click="openQR">
        <span class="status" @click="openQR">未登录 ></span>
      </div>
      <div class="yes" v-else>
        <img :src="userInfo?.avatarUrl" alt="" class="user">
        <span class="status">{{ userInfo?.nickname }}</span>
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

      <el-sub-menu v-if="isLogin" index="createPlaylist">
        <template #title>创建的歌单</template>
        <el-menu-item v-for="playlist in userPlaylist?.slice(1, createdPlaylistCount)" :key="playlist?.id"
          :index="activePath" @click="showDetail(playlist?.id)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-24gl-playlistMusic4"></use>
          </svg>
          <span>{{ playlist?.name }}</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu v-if="isLogin" index="subPlaylist">
        <template #title>收藏的歌单</template>
        <el-menu-item v-for="playlist in userPlaylist?.slice(createdPlaylistCount)" :key="playlist?.id" :index="activePath"
          @click="showDetail(playlist?.id)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-24gl-playlistMusic4"></use>
          </svg>
          <span>{{ playlist?.name }}</span>
        </el-menu-item>
      </el-sub-menu>

    </el-menu>

    <el-dialog v-model="centerDialogVisible" width="350px" align-center draggable @close="stopTimer">
      <div class="content">
        <div class="qr-login" v-if="isQRLogin">
          <span class="title">扫码登录</span>
          <div class="qr-box">
            <img :src="QRImgUrl" alt="">
            <div class="expire" v-if="isExpire">
              <span class="qr-expire">二维码已失效</span>
              <div class="refresh" @click="refreshQR">点击刷新</div>
            </div>
          </div>
          <div class="hint">
            使用
            <a href="https://music.163.com/#/download">网易云音乐App</a>
            扫码登录
          </div>
          <div class="other" @click="isQRLogin = false">
            选择其他登录方式 >
          </div>
        </div>

        <div class="phone-login" v-else>
          <div class="logo">
            <img src="" alt="">
          </div>
          <el-form :model="formData" :inline="true" label-width="80px">
            <el-form-item label="手机号">
              <el-input v-model="formData.phone" />
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="formData.captcha" />
              <span class="sent-captcha" @click="sentCaptcha">发送验证码</span>
            </el-form-item>
          </el-form>
          <div class="option">
            <!-- <el-form-item label="">
              <el-checkbox-group v-model="formData.auto">
                <el-checkbox label="自动登录" name="type" />
              </el-checkbox-group>
            </el-form-item> -->
            <div class="left">
              <input type="checkbox" value="1" id="auto" class="autologin" />
              <label for="auto">自动登录</label>
            </div>
            <div class="right">
              <!-- <span class="forget">忘记密码</span> -->
              <span class="captcha">密码登录</span>
            </div>
          </div>
          <div class="button">
            <div class="login" @click="login">登录</div>
            <div class="register">注册</div>
          </div>
          <div class="othermethod">
            <div class="method"></div>
            <div class="method"></div>
            <div class="method"></div>
            <div class="method"></div>
          </div>
          <div class="service">
            <!-- <el-form-item label="">
              <el-checkbox-group v-model="formData.service">
                <el-checkbox label="" name="type" />
              </el-checkbox-group>
            </el-form-item> -->
            <input type="checkbox" value="1" id="service" class="service" />
            <label for="service">同意</label>
            <a href="https://st.music.163.com/official-terms/service">《服务条款》</a>
            <a href="https://st.music.163.com/official-terms/privacy">《隐私政策》</a>
            <a href="https://st.music.163.com/official-terms/children">《儿童隐私政策》</a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import QRCodeVue from 'qrcode.vue'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter();
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const centerDialogVisible = ref(false);
    const QRImgUrl = ref('');
    const isExpire = ref(false);
    const isQRLogin = ref(true);
    const userInfo = reactive({
      avatarUrl: localStorage.getItem('avatarUrl'),
      nickname: localStorage.getItem('nickname'),
      id: -1,
    })
    const isLogin = computed(() => {
      return localStorage.getItem('nickname') !== undefined
    });

    let timer = null;
    const formData = reactive({
      phone: '',
      captcha: ''
    });
    const QRCodeLinkParams = reactive({
      key: computed(() => store.state.login.QRKey),
      qrimg: true,
      timestamp: -1,
    })

    const menus = computed(() => router.options.routes);
    const activePath = computed(() => {
      return router.currentRoute.value.fullPath;
    });

    const createdPlaylistCount = computed(() => store.state.user.userSubcount?.createdPlaylistCount);
    const userPlaylist = computed(() => store.state.user.userPlaylist);

    onMounted(() => {
      if (isLogin.value) {
        // 获取用户id
        store.dispatch('getUserAccount').then(() => {
          userInfo.id = store.state.user.userId;
          // 获取创建歌单数量和收藏歌单数量
          store.dispatch('getUserSubcount').then(() => {
            // 获取用户歌单
            store.dispatch('getUserPlaylist', { uid: userInfo.id }).then(() => {
              if (userPlaylist.value[0]) {
                router.getRoutes()[27].redirect  = {path:`/playlist/${userPlaylist.value[0]?.id}`}
              }
            });
          });
        });
        // 获取收藏的专辑
        store.dispatch('getUserAlbumSublist', { limit: 10000, offset: 0 });
      }
    })

    function openQR() {
      centerDialogVisible.value = true;
      getQRCode();
    }

    function stopTimer() {
      clearInterval(timer);
      timer = null;
    }

    function refreshQR() {
      isExpire.value = false;
      getQRCode();
    }

    function getQRCode() {
      let timestamp = new Date().getTime();
      QRCodeLinkParams.timestamp = timestamp
      store.dispatch('getQRKey', { timestamp });
      // 轮询扫码状态接口
      stopTimer();
      timer = setInterval(() => {
        store.dispatch('getQRCheck', { key: QRCodeLinkParams.key, timestamp: new Date().getTime() }).then(() => {
          if (store.state.login.status === 803) {
            localStorage.setItem("avatarUrl", store.state.login.avatarUrl);
            localStorage.setItem("nickname", store.state.login.nickname);

            proxy.$cookies.set('token', store.state.login.cookie);
            centerDialogVisible.value = false;
            stopTimer();
          } else if (store.state.login.status == 800) {
            isExpire.value = true;
            stopTimer();
          }
        });
      }, 1000);
    }

    function sentCaptcha() {
      store.dispatch('getSentCaptcha', { phone: formData.phone });
    }

    function login() {
      store.dispatch('getVerifyCaptcha', { phone: formData.phone, captcha: formData.captcha }).then(() => {
        store.dispatch('getLoginPhone', { phone: formData.phone, captcha: formData.captcha });
      });
      closeQR();
    }

    function logout() {
      localStorage.removeItem('avatarUrl');
      localStorage.removeItem('nickname');
    }

    function showDetail(playListId) {
      router.push({
        name: 'playlist',
        params: {
          id: playListId
        }
      });
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
      stopTimer,
      QRImgUrl,
      isExpire,
      isLogin,
      isQRLogin,
      formData,
      userInfo,
      refreshQR,
      sentCaptcha,
      login,
      showDetail,
      createdPlaylistCount,
      userPlaylist
    }
  }
}
</script>

<style lang="less" scoped>
#nav {
  background: #edeced;
  width: 200px;
  padding-right: 7px;
  box-sizing: border-box;
  // margin-bottom: 60px;

  .icon {
    height: 16px;
    width: 16px;
    margin-right: 8px;
  }

  .login {
    background: #edeced;
    position: absolute;
    top: 0;
    height: 60px;
    width: 200px;
    z-index: 1;

    .no,
    .yes {
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
    background: #edeced;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 498px;
    margin-top: 60px;

    .el-menu-item {
      height: 35px;
      line-height: 35px;
      font-size: 12px;
    }

    .el-menu-item:hover {
      background-color: #e1e1e1;
    }

    .is-active {
      background-color: #e1e1e1;
    }

    .el-sub-menu:hover {
      background-color: #e1e1e1;
    }

    :deep(.el-sub-menu__title) {
      font-size: 12px;
      height: 35px;
      line-height: 35px;
    }

    .el-sub-menu .el-menu-item {
      padding: 0px 20px;

      span {
        max-width: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .el-dialog {
    :deep(.el_dialog__body) {
      padding: 0px;
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .qr-login {
        padding: 60px 0;

        .title {
          display: block;
          font-size: 24px;
          text-align: center;
          font-weight: 500;
          color: black;
        }

        .qr-box {
          margin: 34px 0 18px;
          color: white;
          font-size: 12px;

          img {
            width: 170px;
            height: 170px;
          }

          .expire {
            width: 170px;
            height: 170px;
            position: absolute;
            background-color: rgba(51, 51, 51, 0.8);
            transform: translate(0, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;

            .qr-expire {
              margin-top: 60px;
            }

            .refresh {
              background-color: #c3473a;
              width: 78px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              margin: 18px 0 50px;
              border-radius: 20px;
              cursor: pointer;
            }
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

      .phone-login {
        padding: 0 40px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
          margin-bottom: 45px;

          img {
            width: 56px;
            height: 56px;
            background-color: #eb4d44;
            border-radius: 50%;
          }
        }

        .sent-captcha {
          cursor: pointer;
        }

        .option {
          display: flex;
          width: 80%;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0 45px;

          .autologin {
  
          }

          .right {
            display: flex;
            justify-content: right;

            span {
              display: block;
              padding-left: 10px;
              color: blue;
            }

            span.forget {
              padding-right: 10px;
              border-right: 1px solid #eaeaea;
            }
          }
        }

        .button {
          width: 258px;
          text-align: center;
          margin: 24px 0 28px;

          .login {
            font-size: 14px;
            height: 38px;
            line-height: 38px;
            color: white;
            background-color: #eb4d44;
            border-radius: 5px;
            letter-spacing: 5px;
          }

          .register {
            height: 38px;
            line-height: 38px;
            font-size: 12px;
            text-decoration: underline;
          }
        }

        .othermethod {
          font-size: 10px;
          width: 258px;
          display: flex;
          align-items: center;
          justify-content: space-around;

          .method {
            border-radius: 50%;
            width: 30px;
            height: 30px;
            background-color: #eb4d44;
          }
        }

        .service {
          margin-top: 26px;

          a {
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>