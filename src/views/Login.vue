<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container"></span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        >
          <i slot="prefix" style="font-size: 20px" class="el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"></span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          @keyup.enter.native="submitLogin"
          show-password
        >
          <i slot="prefix" style="font-size: 20px" class="el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" @click="submitLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { endLoading, startLoading } from "@/utils/loading";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          startLoading();
          this.$store
            .dispatch("login", this.loginForm)
            .then(() => {
              // this.$route.query 获取路径参数 redirect 的值
              const path = this.$route.query.redirect;
              this.$router
                .push(path === undefined ? "/" : path)
                .catch(() => {});
              endLoading();
            })
            .catch(() => {
              endLoading();
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
};
</script>

<style scoped>
.login-form {
  width: 360px;
  margin: 180px auto;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  box-shadow: 0 0 55px #cac6c6;
  padding: 15px 35px;
}

.title-container {
  text-align: center;
}
</style>
