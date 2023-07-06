<template>
  <div id="nav">
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
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter();
    const menus = computed(() => router.options.routes);
    const activePath = computed(() => {
      return router.currentRoute.value.fullPath;
    });
    return {
      menus,
      activePath
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
}
</style>