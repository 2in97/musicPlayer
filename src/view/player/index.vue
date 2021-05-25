<template>
  <div>
    <div class="scroll_panel">
        <el-carousel :interval="4000" type="card" height="260px">
          <el-carousel-item v-for="(item,index) in recommends" :key="index">
            <img class="scroll_img" :src="item.url" style="width:650px;height:260px" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="playlists">
        <div class="scroll_part">
          <h1>热门歌单</h1>
          <scrollLists class="lists" :list="hotSongLists"></scrollLists>
        </div>
        <div class="scroll_part">
          <h1>新歌首发</h1>
          <slfs class="lists" :list="lastedSongs"></slfs>
        </div>
        <div class="scroll_part">
          <h1>热门歌手</h1>
          <slfa class="lists" :list="hotArtists"></slfa>
        </div>
      </div>
  </div>
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
      hotSongLists: [],
      lastedSongs: [],
      hotArtists: [],
      search:"",
      searchType: "1",
      dialogVisible: false,
      isLogin: false,
      recommends: [],
      avater: require("../../assets/cd.png")
    };
  },
  mounted() {
    this.getAllRecommends();
    this.getHotSongLists();
    this.getLastedSongs();
    this.getHotArtists();
  },
  methods: {
    getHotSongLists() {
      this.$axios
        .get("http://localhost:8080/user/getHotSongLists")
        .then(res => {
          this.hotSongLists = res.data;
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
    toPersonal(){
      this.$router.push("/personalCenter")
    }
  }
};
</script>
<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
}
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


</style>
