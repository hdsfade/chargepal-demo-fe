<template>
  <div class="loginPage">
    <el-form
      class="loginForm"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
    >
      <div class="title-container">
        <h3 style="font-size: 26px" class="title">Makaton</h3>
        <span style="font-size: 20px">LOGIN</span>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Account"
          name="username"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="password"
          name="password"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      redirect: undefined,
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.$store
          //   .dispatch("user/login", this.loginForm)
          //   .then(() => {
          // this.$router.push("/backstage/common");
          this.loading = false;
          // })
          // .catch(() => {
          //   this.loading = false;
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .loginPage .el-input input {
    color: $cursor;
  }
}

.loginPage {
  .el-input {
    width: 100%;
    height: 47px;
    border: 2px solid rgb(235, 235, 235);
    border-radius: 20px;

    input {
      height: 43px;
      background: transparent;
      border: none;
      color: rgb(192, 196, 204);
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-button--primary {
    border-radius: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;
$bl: rgb(42, 130, 228);

.loginPage {
  height: 100vh;
  // background-image: url("../../assets/img/background_img.png");
  background-size: cover;
  // background-size: contain;
  overflow: auto;

  .loginForm {
    width: 13vw;
    margin: 25vh auto;
  }

  .title-container {
    position: relative;

    .title,
    span {
      display: block;
      color: $bl;
      margin: 0px auto 30px auto;
      text-align: center;
    }
  }
}
</style>
