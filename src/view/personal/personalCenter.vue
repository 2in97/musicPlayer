<template>
  <div>
    <div class="personal-card-bg">
      <el-row class="personal-card">
        <el-col class="left-card">
          <div class="left-card-avatar">
            <el-avatar :size="130" :src="info.avatar"></el-avatar>
          </div>
          <el-button class="edit-bt" @click="toSettingPage">编辑资料</el-button>
        </el-col>
        <el-col class="right-card">
          <h1 style="padding-top:100px;padding-left:60px;">{{info.username}}</h1>
          <h3 style="padding-left:60px;color:grey">{{info.introduction}}</h3>
          <div class="right-card-nav">
            <el-button class="nav-bt" @click="toCollectionPage">我的收藏</el-button>
            <el-button class="nav-bt" @click="toListPage">我的歌单</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <router-view></router-view>

  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      info:{},
    };
  },
  mounted(){
    this.getInfo()
  },
  methods: {
    getInfo(){
      this.$axios
            .post(
              "http://localhost:8080/user/getInfo",
              qs.stringify({
                tel:sessionStorage.getItem("tel")
              })
            )
            .then(res => {
              this.info=res.data
            })
            .catch(err => {
              console.log(err);
            });
    },
    setDialogVisible() {
      this.dialogVisible = false;
    },
    isLogin(val) {
      console.log("val:" + val);
      this.isLogin = val;
    },
    toCollectionPage() {
      this.$router.push({ name: "myCollection" });
    },
    toListPage() {
      this.$router.push({ name: "mySongList" });
    },
    toSettingPage() {
      this.$router.push({ name: "setting" });
    }
  }
};
</script>
<style scoped>
.personal-card-bg {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: rgba(52, 52, 52, 1);
}
.personal-card {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 1300px;
  height: 280px;
}
.left-card {
  width: 350px;
  height: 280px;
  background-color: rgb(46, 179, 255);
  text-align: center;
  position: relative;
}
.left-card-avatar {
  height: 230px;
  padding-top: 50px;
  position: relative;
}
.edit-bt {
  width: 350px;
  height: 50px;
  background-color: rgb(44, 156, 221);
  border: 1px solid rgb(44, 156, 221);
  color: white;
}
.right-card {
  height: 280px;
  width: 950px;
  background-color: rgb(255, 255, 255);
}
.right-card-nav {
  position: absolute;
  bottom: 0;
  width: 950px;
  background-color: rgb(247, 247, 247);
}
.nav-bt {
  width: 200px;
  height: 50px;
  background-color: rgb(247, 247, 247);
  border: 1px solid rgb(247, 247, 247);
  color: rgb(144, 147, 153);
}
</style>
