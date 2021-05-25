<template>
  <el-container>
    <div class="content-box">
      <el-row class="content-box-nav">
        <el-col :span="6">
          <img :src="song.pic" alt="封面" style="height:200px;width:200px" />
          <br />
          <br />
          <h3 v-if="song.albumName!=''">专辑：{{song.albumName}}</h3>
        </el-col>
        <el-col :span="18">
          <div>
            <p class="title-name">{{song.name}}</p>
            <br />
            <h3>{{song.artist}}</h3>
            <br />
            <br />
            <div class="bt">
              <el-button class="pbt" @click="insertList(song.id)">播放</el-button>
              <span v-if="!mark">
                <el-button class="cbt" icon="el-icon-star-off" @click="like">收藏</el-button>
              </span>
              <span v-if="mark">
                <el-button class="cbt-mark" icon="el-icon-star-on" @click="dislike">已收藏</el-button>
              </span>
            </div>
            <div v-if="song.lyric==''" class="no-lyric-part">暂无歌词</div>
            <div v-if="song.lyric!=''&&!show" class="lyric-part">
              <p v-for="(li, i) in txt2" :key="i" style="line-height:30px">{{li}}</p>
              <div v-if="!show">
                <a @click="showMore">展开</a>
              </div>
            </div>
            <div v-if="song.lyric!=''&&show" class="lyric-part">
              <p v-for="(li, i) in txt" :key="i" style="line-height:30px">{{li}}</p>
              <div v-if="show">
                <a @click="showMore">收起</a>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-container>
</template>
<script>
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      sid: "",
      song: {},
      mark: "" /*是否收藏*/,
      lyric: "",
      txt: [],
      txt2: [],
      show: false
    };
  },
  mounted() {
    this.sid = this.$route.params.sid;
    this.getSongById();
    if (sessionStorage.getItem("token") != null) {
      this.isMark();
    }
  },
  methods: {
    insertList(sid) {
      let list = JSON.parse(localStorage.getItem("list"));
      if (list == null) list = [];
      let flag = list.indexOf(sid);
      if (flag > -1) {
        list.splice(flag, 1);
      }
      list.push(sid);
      localStorage.setItem("list", JSON.stringify(list));
      let routeData = this.$router.resolve({
        name: "playList"
      });
      window.open(routeData.href, "_blank");
    },
    like() {
      this.$axios
        .post(
          "http://localhost:8080/user/addToFavoSong",
          qs.stringify({
            sid: this.sid,
            tel: sessionStorage.getItem("tel")
          })
        )
        .then(res => {
          this.mark = true;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    dislike() {
      this.$axios
        .post(
          "http://localhost:8080/user/deleteFromFavoSong",
          qs.stringify({
            sid: this.sid,
            tel: sessionStorage.getItem("tel")
          })
        )
        .then(res => {
          this.mark = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    showMore() {
      if (this.show) this.show = false;
      else this.show = true;
    },
    getLyric(sid) {
      this.$axios
        .get("http://localhost:8080/song/getLyric?id=" + sid)
        .then(res => {
          this.lyric = res.data;
          this.txt = this.lyricToObj(this.lyric);
          for (var i = 0; i < 10; i++) {
            this.txt2.push(this.txt[i]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    lyricToObj(lyricStr) {
      const obj = [];
      let perLyric;
      lyricStr.split("\n").forEach((item, idx) => {
        perLyric = item.slice(item.indexOf("]") + 1);
        obj.push(perLyric);
      });
      return obj;
    },
    isMark() {
      this.$axios
        .get(
          "http://localhost:8080/user/songIsMark?sid=" +
            this.sid +
            "&tel=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.mark = res.data;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    getSongById() {
      this.$axios
        .get("http://localhost:8080/song/getSongById?id=" + this.sid)
        .then(res => {
          this.song = res.data;
          if (this.song.lyric != "") this.getLyric(this.song.id);
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    detail() {
      this.$router.push({
        name: "artistDetail",
        params: { aid: this.song.artist }
      });
    }
  }
};
</script>
<style scoped>
.lyric-part,
.no-lyric-part {
  padding-top: 50px;
  font-size: 14px;
}

.pbt,
.cbt,
.cbt-mark {
  border-radius: 20px !important;
  font-size: 16px;
  margin-right: 30px;
}
.pbt {
  color: #fff;
  background-color: #e61723;
  border-color: #e61723;
  width: 100px;
}
.cbt-mark {
  color: #e61723;
}
.title-name {
  font-weight: 600;
  font-size: 30px;
}
.content-box {
  width: 1200px;
  margin: auto;
  padding-top: 60px;
}
.content-box-nav {
  background-color: white;
}
.none-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.none-content {
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%);
}
</style>
