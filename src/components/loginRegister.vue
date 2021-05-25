<template>
  <el-dialog
    ref="logRegDialogRef"
    class="log-reg-dialog"
    :visible.sync="innerVisible"
    :width="'800px'"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @closed="setDialogVisible"
  >
    <!--登录-->
    <div class="log-wrapper">
      <el-row>
        <el-col :span="9">
          <div style="width:250px;height:500px">
            <img class="lr-img" src="../assets/17-login-img.png" alt />
          </div>
        </el-col>
        <el-col :span="15">
          <div class="lr-content-wrapper">
            <span class="lr-content-wrapper-title">登录/注册</span>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="loginForm"
            >
              <el-form-item label="手机号" prop="tel">
                <el-input v-model="ruleForm.tel" auto-complete="off" placeholder="请输入您的手机号">
                  <template slot="prepend">+86</template>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="Verification">
                <el-input
                  v-model="ruleForm.Verification"
                  auto-complete="off"
                  placeholder="请输入短信验证码"
                >
                  <el-button @click="getVerification" slot="append" :disabled="disable">{{count}}</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="验证码">
                <el-input
                  class="code_input"
                  v-model="ruleForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                ></el-input>
                <div class="code" @click="refreshCode">
                  <Sidentify :identifyCode="identifyCode"></Sidentify>
                </div>
              </el-form-item>
              <div class="bottom">
                <el-form-item>
                  <el-button class="button" @click="submit()">登录/注册</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import Sidentify from "@/components/identify";
import qs from "qs";
export default {
  name: "loginRegister",
  components: {
    Sidentify
  },
  props: {
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      searchType: "",
      disable:false,
      timer:"",
      count:"获取验证码",
      closeDialog: true,
      isLogin:false,
      ruleForm: {
        tel: "",
        Verification: "",
        code: ""
      },
      identifyCodes: "1234567890",
      identifyCode: "",
      rules: {
        tel: [{ required: true, message: "请输入手机号", trigger: "blur" },
        {
		    pattern: /^1[3-9]\d{9}$/,
		    message: '手机号格式错误'
		  }],

      }
    };
  },
  computed: {
    //窗口可见
    innerVisible: {
      get() {
        if (this.closeDialog) return this.dialogVisible;
        else return false;
      },
      set(show) {
        this.closeDialog = show;
      }
    }
  },
  methods: {
    getVerification(){
        this.$axios
        .post(
          "api/user/getVerification",
          qs.stringify({
            tel: this.ruleForm.tel
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res.data);
          this.$message.success("验证码已发送");
          let TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.disable = true;
        this.timer = setInterval(()=>{
          if (this.count > 0 && this.count <= TIME_COUNT){
            this.count--;
          }else {
            this.disable = false;
            this.count="获取验证码",
            clearInterval(this.timer);
            this.timer = null;
          }
        },1000)
      }
          this.Verification = res.data;
        })
        .catch(err => {
          this.$message.error("手机号有误");
        });
    },
    submit() {
      this.login();
    },
    login() {
      this.$axios
        .post(
          "api/user/login",
          qs.stringify({
            tel: this.ruleForm.tel,
            code: this.ruleForm.Verification
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res.data);
          sessionStorage.setItem("token", JSON.stringify(res.data));
          sessionStorage.setItem("tel", this.ruleForm.tel);
          this.dialogVisible = false;
          this.isLogin=true;
          window.location.reload();
        })
        .catch(err => {
          this.$message.error("验证码错误");
        });
    },
    setDialogVisible() {
      this.closeDialog = true;
      this.$emit("setdialogvisible",this.isLogin);/*关闭窗口设置登录*/
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    }
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  }
};
</script>
<style scoped>
.code_input {
  width: 150px;
  float: left;
}
.code {
  width: 140px;
  float: left;
  padding-left: 20px;
}
.lr-img {
  position: absolute;
  top: -60px;
  left: -20px;
}
.log-wrapper {
  height: 410px;
}
.lr-content-wrapper {
  padding-left: 20px;
}
.lr-content-wrapper-title {
  font: 20px bold;
}

.el-button--primary {
  width: 170px;
  background-color: #00dada;
  border-color: #00dada;
}
.button {
  width: 350px;
  background-color: #00dada;
  border-color: #00dada;
  color: white;
}
.bottom {
  position: relative;
  left: -50px;
}
.whole {
  top: 0;
  left: 0;
  background-color: rgb(34, 37, 56);
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
}
.loginPart {
  border-radius: 10px;
  width: 480px;
  height: 350px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -65%);
  background: rgb(163, 161, 161, 0.2);
  color: #2d2d2d;
}

.loginForm {
  padding-top: 10%;
  margin-right: 60px;
}

.loginForm >>> .el-form-item__label {
  line-height: 50px;
}
.el-input >>> .el-input__inner {
  height: 50px;
}
</style>
