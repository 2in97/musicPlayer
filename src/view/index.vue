<template>
  <el-container>
    <el-header style="height:61px">
      <div class="header">
        <a href>
          <img class="logo" src="../assets/17-logo.png" alt="logo" />
        </a>
        <el-menu
          :default-active="$route.path"
          class="nav-header"
          mode="horizontal"
          router
        >
            <el-menu-item v-for="item in routes" :index="item.path" :key="item.path">
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
            <el-menu-item><a @click="toPlaying">音乐盒</a></el-menu-item>
        </el-menu>
        <div class="login-a1" v-if="!isLogin">
          <a @click="dialogVisible = true">登录 / 注册</a>
        </div>
        <div class="login-a2" v-if="isLogin">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :src="avatar"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <a @click="toPersonal"><el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item></a>
              <a @click="logout"><el-dropdown-item icon="el-icon-close">退出</el-dropdown-item></a>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-input placeholder="请输入内容" v-model="search" class="search-input">
          <el-select class="search-select" v-model="searchType" slot="prepend" placeholder="请选择">
            <el-option label="歌曲名" value="1"></el-option>
            <el-option label="歌手" value="2"></el-option>
            <el-option label="专辑" value="3"></el-option>
          </el-select>
          <el-button class="search-bt" slot="append" icon="el-icon-search" @click="toSearch()"></el-button>
        </el-input>
      </div>
    </el-header>
    <el-main>
      <router-view :key="$route.fullPath"></router-view>
    </el-main>
    <el-footer>
      <div>
        <p>版权归个人方所有 @2020-2021</p>
        <span>邮箱 ：hello2in9uan7u@163.com 丨 合作QQ ：122218767</span>
        <div class="vx_part">
          <span>个人微信 ：</span>
          <img class="vx" src="../assets/weixin.png" alt="weixin" />
        </div>
      </div>
    </el-footer>
    <loginDialog
      :dialogVisible="dialogVisible"
      @setdialogvisible="setDialogVisible"
    ></loginDialog>
  </el-container>
</template>
<script>
import qs from "qs";
import scrollLists from "@/components/scrollList";
import slfs from "@/components/scrollListForSong";
import slfa from "@/components/scrollListForArtist";
import loginDialog from "@/components/loginRegister";

export default {
  components: {
    scrollLists,
    slfs,
    slfa,
    loginDialog
  },
  data() {
    return {
      hotSongs: [],
      lastedSongs: [],
      hotArtists: [],
      search:"",
      searchType: "1",
      routes: [
        { name: "首页", path: "/music" },
        { name: "歌单", path: "/songList"},
        { name: "歌手", path: "/artist"},
      ],
      dialogVisible: false,
      isLogin: false,
      recommends: [],
      avatar:'',
    };
  },
  mounted() {
    this.getAllRecommends();
    this.getHotSongs();
    this.getLastedSongs();
    this.getHotArtists();
    this.getAvatar();
    if(sessionStorage.getItem("token")!=null){
      this.isLogin=true
    }
  },
  methods: {
    getAvatar(){
      this.$axios
        .post("http://localhost:8080/user/getAvatar",
        qs.stringify({
                tel: sessionStorage.getItem("tel")
              })
        )
        .then(res => {
          this.avatar = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toPlaying() {
      let routeData = this.$router.resolve({
        name: "playList"
      });
      window.open(routeData.href, "_blank");
    },
    getHotSongs() {
      this.$axios
        .get("http://localhost:8080/user/getHotSongs")
        .then(res => {
          this.hotSongs = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLastedSongs() {
      this.$axios
        .get("http://localhost:8080/user/getLastedSongs")
        .then(res => {
          this.lastedSongs = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getHotArtists() {
      this.$axios
        .get("http://localhost:8080/user/getHotArtists")
        .then(res => {
          this.hotArtists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllRecommends() {
      this.$axios
        .get("http://localhost:8080/admin/getAllRecommends")
        .then(res => {
          this.recommends = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    setDialogVisible(val) {
      this.dialogVisible = false;
      this.isLogin=val
    },
    logout() {
      this.$axios
        .get("api/user/logout")
        .then(res => {
                console.log(res)
          sessionStorage.clear()
          this.isLogin = false;
        })
        .catch(err => {
          this.$message.error("系统错误");
        });
    },
    toSearch() {
      this.$router.push({
        name: "search",
        params: { type: this.searchType,word:this.search }
      });
    },
    toPersonal(){
      this.$router.push("/personalCenter")
    }
  }
};
</script>
<style scoped>
.vx {
  height: 65px;
  width: 65px;
}
.logo {
  height: 50px;
  width: 125px;
  float: left;
  margin-right: 20px;
  margin-top: 7px;
}
.vx_part {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scroll_part {
  padding-top: 20px;
}
.playlists {
  padding-top: 40px;
  width: 1300px;
  margin: auto;
}
.lists {
  position: absolute;
  left: -30px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.scroll_panel {
  margin: 0 auto;
  width: 1300px;
}

.nav-header {
  width: 500px;
  float: left;
}
.login-a1 {
  float: right;
  padding: 20px 0 0 10px;
}
.login-a2 {
  float: right;
  padding: 10px 0 0 10px;
}
.search-input {
  width: 30%;
  float: right;
  padding-top: 10px;
}
.search-select {
  width: 100px;
}
.el-header {
  height: 61px;
  border-bottom: solid 1px #e6e6e6;
  box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
}
.header {
  height: 100px;
  margin: 0 auto;
  width: 1300px;
}
.el-footer {
  height: 130px !important;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 30px;
}
</style>
