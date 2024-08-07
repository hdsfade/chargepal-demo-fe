<template>
  <el-container id="homePage">
    <img id="backImg" src="../../assets/img/HOMEPAGE.jpg" alt="" />
    <el-button
      id="backBtn"
      icon="el-icon-top"
      circle
      @click="backToTop"
    ></el-button>
    <el-header>
      <el-row
        class="mainNav"
        type="flex"
        style="width: 100%; height: 90px; flex-wrap: wrap"
      >
        <el-col :span="6"
          ><div class="grid-content">
            <div style="height: 90px; display: flex; align-items: center">
              <img
                style="margin-left: 5vw"
                src="./../../assets/img/Group 40038.png"
              />
            </div></div
        ></el-col>
        <el-col :span="12"
          ><div class="grid-content">
            <el-menu
              :default-active="activeIndex"
              class="el-menu"
              mode="horizontal"
              @select="handleSelect"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="1">PRODUCTS</el-menu-item>
              <el-menu-item index="2">COMMUNITY</el-menu-item>
              <el-menu-item index="3">CASE STUDIES</el-menu-item>
              <el-menu-item index="4">MEDIA AND NEWS</el-menu-item>
              <el-menu-item index="5">COMPANY</el-menu-item>
            </el-menu>
          </div></el-col
        >
        <el-col :span="4" :offset="2">
          <div class="grid-content right-icons">
            <el-row>
              <el-col :span="12" 
                ><el-button round @click="diaOpen('sign')"
                  >SIGN IN
                </el-button></el-col
              >
              <el-col :span="12">
                <el-button round @click="diaOpen('register')"
                  >REGISTER</el-button
                ></el-col
              >
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-dialog
      class="dialog1"
      title=""
      :visible.sync="regisDialogVisible"
      width="25%"
      center
      :before-close="handleClose"
    >
      <img src="../../assets/img/titleLogo.jpg" alt="" />
      <div class="create">{{ diaTtile }}</div>
      <el-input
        prefix-icon="el-icon-user"
        v-model="usernameInput"
        placeholder="username"
        @keyup.enter.native="registerContinue"
      ></el-input>
      <br />
      <el-input
        prefix-icon="el-icon-lock"
        v-model="pswInput"
        placeholder="Password"
        show-password
        @keyup.enter.native="registerContinue"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          id="continueBtn"
          type="primary"
          @click="registerContinue"
          :loading="continueing"
          >Continue</el-button
        >
        <div class="forget">Forgot Password ?</div>
      </span>
    </el-dialog>

    <el-main>
      <el-row>
        <el-col :span="24">
          <article id="part_1">
            <div class="content">
              <img class="header" src="../../assets/img/Heading.png" />
              <img
                class="share"
                src="../../assets/img/Share the First Decentralized Power Bank Service Network.png"
              />
              <img
                class="blackLogo"
                src="../../assets/img/Group 40036.png"
                alt=""
              />
            </div>
            <div class="btnLine">
              <img class="im" src="../../assets/img/Group 40029.png" alt="" />
              <img class="im" src="../../assets/img/Group 40028.png" alt="" />
            </div>
          </article>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24"> <article id="part_2"></article> </el-col
      ></el-row>

      <el-row>
        <el-col :span="24">
          <article id="part_3">
            <div class="leftdescribe">
              <img class="mineImg" src="../../assets/img/MINE.png" />
              <div class="leftContent">
                By purchasing and placing Chargepal cabinets in shops, malls, or
                any public spaces accessible to users, you can earn CHARGE
                Tokens as a reward for providing convenient charging facilities.
                The more your stations are used, the more youre rewarded！
              </div>
            </div>
            <div class="rightPart">
              <img
                class="rightImg"
                src="../../assets/img/Group 40039.png"
                alt=""
              />
              <img
                class="btnImg"
                src="../../assets/img/Group 40026.png"
                alt=""
              />
            </div>
          </article> </el-col
      ></el-row>

      <el-row>
        <el-col :span="24">
          <div class="line">
            <div class="bottomdescribe">
              Plus, being the first to place charge cabinet in your area can
              receive special pioneer rewards.
            </div>
          </div>
        </el-col></el-row
      >

      <el-row>
        <el-col :span="24">
          <article id="part_4">
            <img
              class="joinImg"
              src="../../assets/img/Group 40040.png"
              alt=""
            />
            <img class="asImg" src="../../assets/img/Group 40042.png" alt="" />
            <img
              class="joinBtnImg"
              style="margin: 170vh auto"
              src="../../assets/img/Group 40044.png"
              alt=""
            />
            <img
              class="joinBtnImg"
              style="margin: 220vh auto"
              src="../../assets/img/Our Team.png"
              alt=""
            />
            <img
              class="joinBtnImg"
              style="margin: 230vh auto"
              src="../../assets/img/LabLogo 1.png"
              alt=""
            />
            <img
              class="finalImg"
              style="margin: 270vh auto"
              src="../../assets/img/Group 40043.png"
              alt=""
            />
          </article> </el-col
      ></el-row>
    </el-main>
  </el-container>
</template>

<script>
import { chargepalAPI } from "@/api/chargepal";

export default {
  data() {
    return {
      activeIndex: "1",
      regisDialogVisible: false,
      usernameInput: "",
      pswInput: "",
      diaTtile: "",
      continueing: false,
    };
  },
  mounted() {},
  methods: {
    handleSelect() {},
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    handleClose() {
      this.continueing = false;
      this.regisDialogVisible = false;
    },
    diaOpen(str) {
      str == "register"
        ? (this.diaTtile = "Create Account")
        : (this.diaTtile = "Login");
      this.regisDialogVisible = true;
    },
    registerContinue() {
      if (this.usernameInput && this.pswInput) {
        let obj = {
          username: this.usernameInput,
          password: this.pswInput,
        };

        this.continueing = true;
        if (this.diaTtile == "Create Account") {
          chargepalAPI.registerUser(obj).then((res) => {
            if (res === "Error") {
              this.continueing = false;
              this.regisDialogVisible = true;
            }
            if (res.code == 200) {
              this.continueing = false;
              this.regisDialogVisible = false;
              this.$message({
                message: "Register success",
                type: "success",
                duration: 5 * 1000,
              });
            }
          });
        } else if (this.diaTtile == "Login") {
          chargepalAPI.login(obj).then((res) => {
            if (res === "Error") {
              this.continueing = false;
              this.regisDialogVisible = true;
            }
            if (res.code == 200) {
              this.continueing = false;
              this.regisDialogVisible = false;
              localStorage.setItem("token", res.data.token);
              this.$router.replace("/deposit");
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog1 ::v-deep .el-dialog {
  background-color: #000;
  border-radius: 20px;
}
.el-dialog__body {
  img {
    display: block;
    margin: 10px auto;
  }
  .create {
    text-align: center;
    color: #fff;
    font-size: 20px;
    margin: 40px auto;
  }

  .el-input {
    display: block;
    width: 60%;
    margin: 0px auto;

    ::v-deep input::-webkit-input-placeholder {
      -webkit-text-fill-color: rgb(151, 142, 146);
    }

    ::v-deep .el-input__inner {
      padding: 20px 40px;
      color: rgb(151, 142, 146);
      border-radius: 20px !important;
      background-color: rgb(47, 49, 37) !important;
      font-size: 14px;
      border: 1px solid #d8ff00;
    }
  }
}

.dialog-footer {
  .forget {
    text-align: center;
    color: rgb(160, 160, 160);
    font-size: 14px;
    margin: 20px 0;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
$bg: #000000;
$bl: #d8ff00;

#homePage {
  width: 100%;
  position: relative;

  #backImg {
    width: 100%;
    margin: 0;
    position: absolute;
    z-index: 1;
  }

  #backBtn {
    position: fixed;
    z-index: 2;
    right: 3vw;
    bottom: 5vh;
  }

  .el-header {
    width: 100%;
    background-color: transparent;
    color: #333;
    min-height: 90px;
    max-height: 90px;
    position: absolute;
    z-index: 2;

    .el-col {
      height: 90px;
      line-height: 90px;
    }

    .grid-content {
      height: 90px;
      display: flex;
      align-items: center;
    }

    img:nth-child(1) {
      height: 45px;
    }

    .el-menu {
      height: 45px;
      border-bottom: none;
      display: flex;
      align-items: center;

      .el-menu-item,
      .el-menu-item:hover,
      .el-menu-item.is-active {
        height: 45px;
        line-height: 45px;
        border-radius: 20px;
        font-size: 16px;
        border: none;
      }

      .el-menu-item {
        background-color: #111;
        margin: 0 5px;
      }

      .el-menu-item:hover,
      .el-menu-item.is-active {
        background-color: $bl !important;
        color: $bg !important;
      }
    }
    .el-button {
      background: transparent;
      color: #fff;
      height: 45px;
      font-size: 16px;
      padding: 5px 30px;
    }
  }

  #continueBtn {
    background: $bl;
    color: #111;
    width: 60%;
    border-radius: 20px;
    border: none;
    font-size: 16px;
  }

  .el-main {
    width: 100%;
    margin: 120px auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-row {
      width: 100%;
      margin-bottom: 20px;
      position: absolute;
      z-index: 2;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }

    #part_1 {
      width: 100%;

      .content {
        width: 90%;
        margin: 10vh auto;
        .header {
          width: 100%;
        }
        .share {
          width: 100%;
          margin: 20px auto;
          scale: 0.6;
        }

        .blackLogo {
          width: 10vw;
          height: 10vw;
          position: absolute;
          right: 4vw;
          top: 40vh;
        }
      }

      .btnLine {
        width: 40vw;
        height: 80px;
        margin: 30vh auto;
        display: flex;
        justify-content: center;

        .im {
          width: 30vw;
          height: 10vh;
        }
      }
    }

    #part_2 {
      width: 100%;
      height: 85vh;
      margin: 120vh auto;
      position: absolute;
      z-index: 2;
      scale: 0.85;
      background-image: url("../../assets/img/Group 40045.png");
      background-size: 100% 100%;
    }

    #part_3 {
      width: 100%;
      margin: 275vh auto;
      position: absolute;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      scale: 0.8;

      .leftdescribe {
        width: 40%;
        font-size: 40px;

        .mineImg {
          width: 20%;
          position: absolute;
          z-index: 3;
        }

        .leftContent {
          width: 70%;
          min-width: 50vw;
          font-size: 40px;
          margin: 200px 100px;
        }
      }

      .rightPart {
        width: 50%;

        .rightImg {
          width: 100%;
          min-width: 30vw;
        }

        .btnImg {
          width: 25%;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }

    .line {
      width: 100%;
      height: 200px;
      position: absolute;
      margin: 370vh auto;
      z-index: 2;
      display: flex;
      align-items: center;
      scale: 0.8;

      .bottomdescribe {
        width: 40%;
        font-size: 40px;
        z-index: 3;
        text-align: center;
        margin: 0 auto;
      }
    }

    #part_4 {
      width: 100%;
      margin: 470vh auto;
      position: absolute;
      display: flex;
      z-index: 2;
      scale: 0.8;

      img {
        position: absolute;
        z-index: 3;
        width: 100%;
      }

      .joinImg {
        width: 40%;
      }

      .asImg {
        width: 100%;
        margin: 30vh auto;
      }

      .joinBtnImg {
        width: 30vw;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .finalImg {
        width: 100vw;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
