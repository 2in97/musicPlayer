<template>
  <div class="whole">
    <div class="bg-part">
      <img src="../../assets/bg4.jpg" alt class="bg" />
    </div>
    <div class="bg2"></div>
    <div class="loginPart">
      <el-row>
        <el-col :span="11">
          <div class="title">
            <div class="title1">MusicPlayer</div>
            <div class="title2">后台</div>
          </div>
        </el-col>
        <el-col span="2px">
          <div class="verticalBar"></div>
        </el-col>
        <el-col :span="11">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="loginForm"
          >
            <br />
            <br />
            <el-form-item label="账号" prop="username">
              <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入您的用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                auto-complete="off"
                placeholder="请输入您的密码"
              ></el-input>
            </el-form-item>
            <div class="bottom">
              <el-form-item>
                <el-button type="primary" @click="submit()">登录</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    submit() {
      this.login();
    },
    login() {
      this.$axios
        .post(
          "api/user/login",
          qs.stringify({
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res.data);
          if(res.data){
          // localStorage.setItem("user", JSON.stringify(res.data));
          sessionStorage.setItem("user", res.data);
          this.$router.push({ path: "/uploadMusic" });
          }
          else{
            this.$message.error("账号或密码错误");
          }
        })
        .catch(err => {
          this.$message.error("账号或密码错误");
        });
    }
  }
};
</script>
<style scoped>
.verticalBar {
  width: 2px;
  height: 290px;
  background: rgb(107, 107, 107);
  display: inline-block;
  margin-top: 30px;
  vertical-align: top;
}
.bg {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: fixed;
}
.bg2 {
  background: rgba(20, 27, 47, 0.6);
  width: 100%;
  height: 100%;
  position: fixed;
}
.el-button--primary {
  width: 130px;
  background-color: #00dada;
  border-color: #00dada;
}
.whole {
  top: 0;
  left: 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
}
.loginPart {
  border-radius: 10px;
  width: 800px;
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
}
.title {
  padding-left: 28%;
  padding-top: 35%;
}
.title1 {
  font: 30px bold;
  color:white;
}
.title2 {
  font-size: 20px;
  color: #ff9102;
  padding-left: 25%;
}
.loginForm >>> .el-form-item__label {
  line-height: 50px;
  color: white;
}
.el-input >>> .el-input__inner {
  height: 50px;
}
</style>
