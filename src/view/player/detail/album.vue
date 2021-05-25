<template>
  <el-container>
    <div class="title-box">
      <el-row class="title-box-nav">
        <el-col :span="6">
          <img :src="album.cover" alt="封面" style="height:200px;width:200px" />
          <br />
          <br />
        </el-col>
        <el-col :span="18">
          <div>
            <p class="title-name">{{album.name}}</p>
            <br />
            <h2>{{album.artist}}</h2>
            <br />
            <h3 style="color:grey">发行时间 : {{album.time}}</h3>
            <br />
            <br />
            <div class="bt">
              <span v-if="!mark">
                <el-button class="cbt" icon="el-icon-star-off" @click="like">收藏</el-button>
              </span>
              <span v-if="mark">
                <el-button class="cbt-mark" icon="el-icon-star-on" @click="dislike">已收藏</el-button>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="content-box-nav">
        <h1 class="box-title">作品</h1>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul class="list">
            <li
              v-for="(song,index) in songs"
              class="list-item"
              :key="index"
              :class="{'clickBg':index==clickIndex,'hoverBg':index==hoverIndex}"
              @click="clickIndex = index"
              @mouseover="hoverIndex = index"
              @mouseout="hoverIndex = -1"
            >
              <el-row>
                <el-col class="col" :span="1">{{index+1}}</el-col>
                <el-col class="col" :span="8">
                  <span>{{song.name}}</span>
                </el-col>
                <el-col class="col" :span="5">
                  <span>{{song.artist}}</span>
                </el-col>
                <el-col class="col" :span="6">
                  <span>{{song.albumName}}</span>
                </el-col>
                <el-col class="col" :span="4">
                  <a
                    @click="insertList(song.id)"
                    class="el-icon-video-play"
                    style="font-size:20px;color: rgb(187, 187, 187);"
                  ></a>
                  <a
                    v-if="!marks[index]"
                    @click="likeForSong(song.id,index)"
                    class="icon iconfont icon-dislike"
                    style="font-size:20px;color: rgb(187, 187, 187);padding-left:20px;"
                  ></a>
                  <a
                    v-if="marks[index]"
                    @click="dislikeForSong(song.id,index)"
                    class="icon iconfont icon-aixin3"
                    style="font-size:20px;padding-left:20px;"
                  ></a>
                  <a
                    @click="addToList(song.id)"
                    class="el-icon-folder-add"
                    style="font-size:20px;color: rgb(187, 187, 187);padding-left:20px"
                  ></a>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <el-dialog title="加入我的歌单" :visible.sync="outerVisible">
      <el-button type="primary" @click="changeInnerVisible">新建歌单</el-button>
      <br />
      <br />
      <div class="title">
        <el-row class="form-title">
          <el-col class="col" :span="4"></el-col>
          <el-col class="col" :span="9">
            <span>名字</span>
          </el-col>
          <el-col class="col" :span="8">
            <span>标签</span>
          </el-col>
          <el-col class="col" :span="3"></el-col>
        </el-row>
      </div>
      <div class="infinite-list-wrapper" style="overflow:auto;height:200px">
        <ul class="list">
          <li
            v-for="(list,index) in songLists"
            class="list-item"
            :key="index"
            :class="{'clickBg':index==clickIndex1,'hoverBg':index==hoverIndex1}"
            @click="clickIndex = index"
            @mouseover="hoverIndex = index"
            @mouseout="hoverIndex = -1"
          >
            <el-row>
              <el-col class="col" style="height:60px" :span="4">
                <el-popover placement="top-start" title trigger="hover">
                  <img :src="list.cover" alt style="width: 150px;height: 150px" />
                  <img slot="reference" :src="list.cover" style="width: 60px;height: 60px" />
                </el-popover>
              </el-col>
              <el-col class="col" :span="9">
                <span>{{list.lname}}</span>
              </el-col>
              <el-col class="col" :span="8">
                <span>{{list.tagName}}</span>
              </el-col>
              <el-col class="col" :span="3">
                <a
                  @click="insertThisList(list.lid)"
                  class="el-icon-folder-add"
                  style="font-size:20px;padding-left:20px"
                ></a>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
      <el-dialog width="30%" title="新建歌单" :visible.sync="innerVisible" append-to-body>
        <el-form :model="listForm" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="10">
              <el-upload
                class="avatar-uploader"
                ref="upload"
                action="http://localhost:8080/file/upload2"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-change="changeAvatar"
                :auto-upload="false"
                :on-success="handleAvatarSuccess_update"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="14">
              <el-form-item label="名字" prop="name">
                <el-input v-model="listForm.name" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="tag">
                <el-select v-model="listForm.tag" placeholder="请选择" style="width:80%">
                  <el-option
                    v-for="item in tags"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="详细信息">
            <el-input
              type="textarea"
              v-model="listForm.detail"
              autocomplete="off"
              style="width:100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </el-container>
</template>
<script>
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      aid: "",
      album: {},
      mark: "" /*是否收藏*/,
      songs: [],
      hoverIndex: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      clickIndex: -1, //表示当前点击的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      page_song: {},
      currentPage1: 1,

      marks: [],
      outerVisible: false,
      innerVisible: false,
      songLists: [],
      sid: [], //要保存到歌单的歌曲id
      hoverIndex1: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      clickIndex1: -1, //表示当前点击的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      tags: [
        { value: "2400", name: "快乐" },
        { value: "2401", name: "美好" },
        { value: "2402", name: "安静" },
        { value: "2403", name: "寂寞" },
        { value: "2404", name: "思念" },
        { value: "2405", name: "悲伤" },
        { value: "2406", name: "孤独" },
        { value: "2407", name: "怀旧" },
        { value: "2408", name: "感动" },
        { value: "2409", name: "治愈" },
        { value: "2410", name: "放松" },
        { value: "2411", name: "浪漫" },
        { value: "2412", name: "励志" },
        { value: "2413", name: "清新" },
        { value: "2414", name: "其他" }
      ],
      listForm: {
        name: "",
        tag: "",
        detail: ""
      },
      imageUrl: "",
      rules: {
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        tag: [{ required: true, message: "请选择标签", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.aid = this.$route.params.aid;
    this.getAlbumById();
    this.getSongsByAlbum();
    if (sessionStorage.getItem("token") != null) {
      this.isMark(this.aid);
    }
    this.getMySongLists();
  },
  methods: {
    changeInnerVisible() {
      this.innerVisible = true;
      this.imageUrl = "";
      this.listForm = {
        name: "",
        tag: "",
        detail: ""
      };
    },
    changeAvatar(file, fileList) {
      if (this.imageUrl == "") this.imageUrl = URL.createObjectURL(file.raw);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/song/createSongList",
              qs.stringify({
                name: this.listForm.name,
                cover: this.imageUrl,
                tag: this.listForm.tag,
                detail: this.listForm.detail,
                tel: sessionStorage.getItem("tel")
              })
            )
            .then(res => {
              this.$message.success("提交成功！");
              this.innerVisible = false;
              this.getMySongLists();
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },
    submitForm() {
      this.$refs.upload.submit();
    },
    handleAvatarSuccess_update(res, file) {
      console.log(res.url);
      this.imageUrl = res.url[0];
      this.submit("ruleForm");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        setTimeout(() => {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }, 1000);
      }
      return isJPG && isLt2M;
    },
    addToList(val) {
      this.outerVisible = true;
      this.sid = val;
    },
    insertThisList(val) {
      this.$axios
        .post(
          "http://localhost:8080/song/insertThisList",
          qs.stringify({
            lid: val,
            sid: this.sid
          })
        )
        .then(res => {
          this.$message.success(res.data);
          this.outerVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMySongLists() {
      this.$axios
        .get(
          "http://localhost:8080/song/getMySongLists?id=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.songLists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    isMarkForSong(val) {
      this.$axios
        .get(
          "http://localhost:8080/user/songIsMark?sid=" +
            val +
            "&tel=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.marks.push(res.data);
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    likeForSong(val, index) {
      this.$axios
        .post(
          "http://localhost:8080/user/addToFavoSong",
          qs.stringify({
            sid: val,
            tel: sessionStorage.getItem("tel")
          })
        )
        .then(res => {
          this.marks[index] = true;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    dislikeForSong(val, index) {
      this.$axios
        .post(
          "http://localhost:8080/user/deleteFromFavoSong",
          qs.stringify({
            sid: val,
            tel: sessionStorage.getItem("tel")
          })
        )
        .then(res => {
          this.marks[index] = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },

    getSongsByAlbum() {
      this.$axios
        .get("http://localhost:8080/song/getSongsByAlbum?id=" + this.aid)
        .then(res => {
          this.songs = res.data;
          for (var i in this.songs) {
            this.isMarkForSong(this.songs[i].id);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
          "http://localhost:8080/user/addToFavoAlbum",
          qs.stringify({
            aid: this.aid,
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
          "http://localhost:8080/user/deleteFromFavoAlbum",
          qs.stringify({
            aid: this.aid,
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

    isMark(val) {
      this.$axios
        .get(
          "http://localhost:8080/user/albumIsMark?aid=" +
            val +
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
    getAlbumById() {
      this.$axios
        .get("http://localhost:8080/album/getAlbumById?id=" + this.aid)
        .then(res => {
          this.album = res.data;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
        });
    },
    detail() {
      this.$router.push({
        name: "artistDetail",
        params: { aid: this.album.artist }
      });
    }
  }
};
</script>
<style scoped>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 180px;
  margin-top: 10%;
  margin-left: 8%;
}
.avatar-uploader >>> .el-upload__input {
  display: none;
}
.upload-lyric >>> .el-upload__input {
  display: none;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.form-title {
  font-size: 15px;
  line-height: 60px;
}

.hoverBg {
  background: rgba(226, 226, 226, 0.1);
}
.clickBg {
  background: rgba(0, 0, 0, 0.3);
}
.col {
  min-height: 60px;
  border-bottom: 1px solid;
  border-color: rgb(233, 233, 233, 0.4);
}
.infinite-list-wrapper {
  width: 100%;
  font-size: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.list {
  width: 100%;
}
.list-item {
  line-height: 58px; /*border算进去2px*/
}
.list li {
  height: 60px;
}
.infinite-list-wrapper p {
  text-align: center;
  font-size: 15px;
  line-height: 60px;
}
.content-box {
  width: 1300px;
  margin: auto;
  padding-top: 60px;
}
.box-title {
  height: 60px;
  border-bottom: solid 1px #e6e6e6;
  padding-top: 10px;
}
.content-box-nav {
  background-color: white;
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
.title-box {
  width: 1300px;
  margin: auto;
  padding-top: 60px;
}
.title-box-nav {
  background-color: white;
}
</style>
