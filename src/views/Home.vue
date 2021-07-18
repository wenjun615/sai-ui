<template>
  <el-container>
    <el-header class="home-header">
      <h1 class="home-header-title">{{ title }}</h1>
      <div class="home-header-info">
        <i class="el-icon-user-solid"></i>
        <el-dropdown trigger="click" @command="commandHandler">
          <span class="el-dropdown-link">{{ name }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-row>
          <el-menu :default-active="$route.path" unique-opened router>
            <template v-for="route in routes">
              <el-submenu
                :index="route.path"
                v-if="!route.hidden"
                :key="route.path"
              >
                <template slot="title">
                  <span>{{ route.name }}</span>
                </template>
                <el-menu-item
                  :index="child.path"
                  v-for="child in route.children"
                  :key="child.path"
                >
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-row>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if="$router.currentRoute.path === '/'">首页</div>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      title: "Sai",
    };
  },
  computed: {
    name() {
      return this.$store.state.name;
    },
    routes() {
      return this.$store.state.routes;
    },
    ...mapState(["routes"]),
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.replace("/login").then(() => {});
    },
    commandHandler(command) {
      if (command === "logout") {
        this.$confirm("是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.logout();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      }
    },
  },
};
</script>

<style>
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-header-title {
  display: inline-block;
  margin-left: 20px;
  line-height: 100px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  font-size: 34px;
  font-weight: 800;
  color: #000;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-right: 20px;
}
</style>
