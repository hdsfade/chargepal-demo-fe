<template>
  <el-container id="depositPage">
    <el-aside width="30vw">
      <img @click="backHome" src="../../assets/img/Group 40038.png" alt="" />
      <el-menu
        default-active="2"
        class="el-menu"
        @open="handleOpen"
        background-color="rgb(38, 38, 38)"
        text-color="#fff"
        active-text-color="#fff"
      >
        <el-menu-item index="1">
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">My Asset</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">My Profile</span>
        </el-menu-item>
        <el-menu-item index="4"> <span slot="title">Mine</span> </el-menu-item
        ><el-menu-item index="5">
          <span slot="title">Referral</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="line_0">
        <template v-if="showConnectWallet">
          <el-button size="small" @click="connectWallet"
            >CONNECT WALLET</el-button
          ></template
        >
        <template v-else>
          <el-button size="small" @click="connectWallet"
            >{{ currentAccount.slice(0, 6) }}...</el-button
          >
        </template>
      </div>
      <div class="line_1">
        <el-button @click="deposit">Deposit</el-button>
        <el-button @click="subscribe">Subscribe</el-button>
        <el-button>Stake</el-button>
      </div>

      <div class="line_2">
        <div class="leftPart">
          <div class="lefttitle">Deposit</div>
          <div class="littleBox">
            <span>Deposit amount</span>
            <br />
            <span>
              {{ (depositedCharge / 10 ** 18).toFixed(2) }}
            </span>
          </div>
        </div>
        <div class="rightPart">
          <img src="../../assets/img/Group 40038.png" alt="" />
          <el-button>Validation task</el-button>
          <el-button>Check</el-button>
        </div>
      </div>

      <div class="line_3">
        <div class="title">Income</div>
        <div class="IncomeBox">
          <div class="leftIncome">
            <span style="color: rgb(158, 158, 158)">unclaimed income</span>
            <span style="color: #fff; font-size: 30px">
              {{
                ((totalUserReward - claimedUserReward) / 10 ** 18).toFixed(2)
              }}
            </span>
            <el-button @click="claim">CClaim</el-button>
          </div>
          <div class="rightIncome">
            <span style="color: rgb(158, 158, 158)">Cumulative income</span>
            <span style="color: #fff; font-size: 30px">
              {{ (totalUserReward / 10 ** 18).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="line_4">
        <el-button
          >username:
          <span style="color: #fff">{{ username }}</span>
        </el-button>
        <el-input
          style="width: 50%"
          v-model="emaliValue"
          placeholder="Please enter the content"
        >
          <template #prepend>Emali:</template>
          <template #suffix>
            <span @click="bindEmali()"> Verified </span>
          </template>
        </el-input>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { chargepalAPI } from "@/api/chargepal";
import detectEthereumProvider from "@metamask/detect-provider";
import chargeToken from "@/contracts/chargeToken.json";
import userReward from "@/contracts/userReward.json";
import Web3 from "web3";

export default {
  data() {
    return {
      activeIndex: "1",
      regisDialogVisible: false,
      depositedCharge: 0,
      totalUserReward: 0,
      userRewardProof: "",
      claimedUserReward: 0,
      usernameInput: "",
      pswInput: "",
      userId: "",
      username: "",
      email: "",
      address: "",
      emaliValue: "",
      currentAccount: "",
      currentNetworkName: "",
      showConnectWallet: true,
      chargeTokenAddress: "",
      userRewardAddress: "",
      userRewardContract: "",
      chargeTokenContract: "",
      web3: "",
    };
  },
  mounted() {
    chargepalAPI.getUserInfo().then((res) => {
      let info = res.data;
      this.userId = info.id;
      this.username = info.username;
      this.email = info.email;
      this.address = info.address;
      this.emaliValue = info.email;
    });
    this.listenAccountChange();
    this.listenNetworkChange();
    // this.getAndUpdateDepositedCharge();
  },
  methods: {
    subscribe() {
      chargepalAPI.subscribe().then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "subscribe success",
            type: "success",
            duration: 5 * 1000,
          });
          this.depositedCharge = 10;
        } else if (res.code == 401) {
          this.$message({
            message: "please login",
            type: "fail",
            duration: 5 * 1000,
          });
        }
      });
    },
    claim() {
      this.checkConnectionAndNetwork();
      this.getAndUpdateClaimedUserReward();
      this.$prompt("Please enter claim amount", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputType: "number",
      }).then(async ({ value }) => {
        value = Math.floor(value * 10 ** 18);
        value = value.toString();
        const proofArray = this.userRewardProof.split(",");
        console.log(proofArray);

        this.userRewardContract.methods
          .claim(this.totalUserReward, value, proofArray)
          .send({
            from: this.currentAccount,
          })
          .catch((error) => {
            console.error(error);
            this.$message({
              message: "Fail to send transaction",
              duration: 5 * 1000,
            });
          })

          .then((tx) => {
            this.$message({
              message: "Success to claim",
              duration: 5 * 1000,
            });
            this.getAndUpdateClaimedUserReward();
          });
      });
    },
    async initContracts() {
      this.web3 = new Web3(window.ethereum);
      this.chargeTokenContract = new this.web3.eth.Contract(
        chargeToken.abi,
        this.chargeTokenAddress
      );
      this.userRewardContract = new this.web3.eth.Contract(
        userReward.abi,
        this.userRewardAddress
      );
      console.log(this.userRewardContract);
    },
    getAndUpdateClaimedUserReward() {
      this.userRewardContract.methods
        .claimedAmount(this.address)
        .call()
        .then((claimedAmount) => {
          this.claimedUserReward = claimedAmount;
          console.log(this.claimedUserReward);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAndUpdateDepositedCharge() {
      chargepalAPI.userAsset().then((res) => {
        let info = res.data;
        this.depositedCharge = info.charge;
      });
    },
    getAndUpdateUserReward() {
      const address = this.web3.utils.toChecksumAddress(this.address);
      chargepalAPI.getUserRewardAndProof(address).then((res) => {
        let info = res.data;
        this.totalUserReward = info.rew;
        this.userRewardProof = info.proof;
      });
    },
    deposit() {
      this.checkConnectionAndNetwork();
      this.$prompt("Please enter deposit amount", "", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputType: "number",
      }).then(async ({ value }) => {
        value = Math.floor(value * 10 ** 18);
        value = value.toString();

        this.chargeTokenContract.methods
          .topUp(value)
          .send({
            from: this.currentAccount,
          })
          .catch((error) => {
            console.error(error);
            this.$message({
              message: "Fail to send transaction",
              duration: 5 * 1000,
            });
          })
          .then((tx) => {
            this.$message({
              message: "Success to deposit",
              duration: 5 * 1000,
            });
            this.getAndUpdateDepositedCharge();
          });
      });
    },
    checkConnectionAndNetwork() {
      if (!this.isConnectAndSepolia()) {
        this.$message({
          message: "Please connect wallet and switch network to sepolia",
          duration: 5 * 1000,
        });
        return;
      }
    },
    isConnectAndSepolia() {
      return this.currentAccount != "" && this.currentNetworkName === "Sepolia";
    },
    listenAccountChange() {
      window.ethereum.on("accountsChanged", (accounts) => {
        this.currentAccount = accounts[0];
      });
    },
    listenNetworkChange() {
      window.ethereum.on("chainChanged", () => {
        this.currentNetworkName = this.getNetworkName();
      });
    },
    getNetworkName() {
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainId) => {
          console.log(chainId);
          switch (chainId) {
            case "0xaa36a7":
              this.currentNetworkName = "Sepolia";
              break;
            case "0x1":
              this.currentNetworkName = "Ethereum Mainnet";
              break;
            default:
              this.currentNetworkName = "Unknown";
          }
        })
        .catch((error) => {
          console.error("Fail to get chain:", error);
        });
    },

    connectWallet() {
      const provider = detectEthereumProvider().then((provider) => {
        if (provider && provider === window.ethereum) {
          console.log("MetaMask is available!");
          window.ethereum
            .request({ method: "eth_requestAccounts" })
            .catch((err) => {
              if (err.code === 4001) {
                this.$message({
                  message: "Please connect to MetaMask.",
                  duration: 5 * 1000,
                });
              } else {
                console.error(err);
              }
            })
            .then((accounts) => {
              this.currentAccount = accounts[0];
              console.log("accounts: ", accounts);
            });
          window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }],
            })
            .catch((err) => {
              if (err.code === 4902) {
                this.$message({
                  message: "Please add sepolia network into your wallet",
                  duration: 5 * 1000,
                });
              } else {
                console.error(err);
              }
            })
            .then((err) => {
              this.currentNetworkName = this.getNetworkName();
            });
          this.showConnectWallet = false;

          this.initContracts().then(() => {
            console.log("Finish to load contracts");
          });

          this.getAndUpdateClaimedUserReward();
          this.getAndUpdateUserReward();
        } else {
          this.$message({
            message: "Please install MetaMask!",
            duration: 5 * 1000,
          });
        }
      });
    },
    bindEmali() {
      if (this.emaliValue) {
        this.checkConnectionAndNetwork();
        let obj_emali = { email: this.emaliValue };
        chargepalAPI.bindEmali(obj_emali).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "Please check the verification code in your email",
              duration: 5 * 1000,
            });
            this.$prompt("Please enter the verification code", "", {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
            }).then(({ value }) => {
              let obj_code = {
                address: this.currentAccount,
                code: value,
                email: this.emaliValue,
              };

              chargepalAPI.bindCode(obj_code).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: "Success to bind email.",
                    duration: 5 * 1000,
                  });
                }
              });
            });
          }
        });
      }
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    backHome() {
      this.$router.replace("/home");
    },
  },
};
</script>

<style lang="scss" scoped>
$bg: #000000;
$bl: #d8ff00;

#depositPage {
  max-width: 100vw;
  max-height: 100vh;

  .el-aside {
    height: 100vh;
    background-color: rgb(38, 38, 38);
    color: #333;

    img {
      width: 90%;
      margin: 25px 10px;
      cursor: pointer;
    }

    .el-menu {
      height: 60vh;
      border: none;

      .el-menu-item:hover,
      .el-menu-item.is-active {
        border-radius: 40px;
        background-color: rgb(63, 63, 63) !important;
        box-shadow: 0 10px 10px #111;
      }

      .el-menu-item {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 20px;
        height: 12vh;
        line-height: 12vh;
        border-radius: 40px;
        text-align: center;
        font-size: 18px;
        background-color: rgb(38, 38, 38);
      }
    }
  }

  .el-main {
    background-color: rgb(33, 33, 33);
    color: #333;
    text-align: center;

    .line_0 {
      width: 85%;
      height: 3vh;
      margin: 0 auto;

      .el-button {
        float: right;
        // height: 5vh;
        // width: 25%;
        border-radius: 20px;
        font-size: 16px;
        color: $bl;
        border-color: $bl;
        background-color: transparent;
      }
    }

    .line_1 {
      width: 90%;
      height: 10vh;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-button {
        height: 5vh;
        width: 30%;
        border-radius: 20px;
        font-size: 20px;
        color: #111;
        font-weight: 600;
        border-color: $bl;
        background-color: $bl;
      }
    }

    .line_2 {
      width: 90%;
      height: 30vh;
      margin: 20px auto;
      display: flex;
      justify-content: space-between;

      .leftPart {
        width: 70%;
        height: 100%;
        background: rgb(38, 38, 38);
        border-radius: 20px;
        border: 1px solid #111;
        position: relative;
        .lefttitle {
          position: absolute;
          top: 30px;
          left: 30px;
          font-size: 24px;
          color: #fff;
        }

        .littleBox {
          width: 85%;
          height: 55%;
          border-radius: 20px;
          border: 3px solid #111;
          background: rgb(54, 47, 36);
          position: absolute;
          top: 90px;
          left: 30px;

          span {
            position: absolute;
            color: #fff;

            &:nth-child(1) {
              position: absolute;
              color: rgb(148, 150, 139);
              top: 40px;
              left: 40px;
              font-size: 16px;
            }

            &:nth-child(3) {
              position: absolute;
              color: #fff;
              top: 75px;
              left: 40px;
              font-size: 30px;
            }
          }
        }
      }

      .rightPart {
        width: 25%;
        height: 100%;
        background: rgb(38, 38, 38);
        border-radius: 20px;
        border: 1px solid #111;

        img {
          width: 90%;
          margin: 25px 10px;
        }

        .el-button {
          height: 5vh;
          width: 85%;
          margin: 10px auto;
          border-radius: 20px;
          font-size: 20px;
          color: $bl;
          border-color: $bl;
          background-color: transparent;
        }
      }
    }

    .line_3 {
      width: 90%;
      height: 35vh;
      margin: 20px auto;
      background: rgb(38, 38, 38);
      border-radius: 20px;
      border: 1px solid #111;
      position: relative;

      .title {
        position: absolute;
        top: 30px;
        margin-left: 30px;
        font-size: 24px;
        color: #fff;
      }

      .IncomeBox {
        width: 95%;
        height: 60%;
        margin: 90px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .leftIncome,
        .rightIncome {
          width: 47%;
          height: 90%;
          background: rgb(33, 33, 33);
          border-radius: 20px;
          border: 3px solid #111;
          display: flex;
          align-items: center;
        }

        .leftIncome {
          justify-content: space-between;
          padding: 50px;

          .el-button {
            height: 5vh;
            width: 25%;
            border-radius: 20px;
            font-size: 16px;
            color: $bl;
            border-color: $bl;
            background-color: transparent;
          }
        }

        .rightIncome {
          justify-content: space-around;
        }
      }
    }

    .line_4 {
      width: 90%;
      height: 10vh;
      margin: 20px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      ::v-deep.el-input__inner {
        height: 5vh;
        background-color: rgb(36, 37, 32);
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border: 1px solid rgb(59, 60, 53);
        color: #fff;
        border-left: none;
      }

      ::v-deep.el-input-group__append,
      ::v-deep.el-input-group__prepend {
        background-color: rgb(36, 37, 32);
        border: 1px solid rgb(59, 60, 53);
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        border-right: none;
      }

      ::v-deep.el-input__suffix {
        display: flex;
        align-items: center;
        padding: 0 20px;
        cursor: pointer;

        &:hover {
          color: $bl;
        }
      }

      .el-button {
        height: 5vh;
        border-color: rgb(59, 60, 53);
        border-radius: 20px;
        background-color: rgb(36, 37, 32);

        &:nth-child(1) {
          width: 35%;
          text-align: left;
        }
        &:nth-child(2) {
          width: 55%;
          text-align: left;
        }

        &:hover,
        &:active {
          color: rgb(225, 252, 86);
          background: rgb(51, 54, 33);
          border-color: rgb(225, 252, 86);
        }
      }
    }
  }
}
</style>
