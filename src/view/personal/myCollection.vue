<template>
  <el-container>
    <div class="content-box">
      <el-row class="content-box-nav">
        <el-col :span="4">
          <h1 class="box-title">我的收藏</h1>
        </el-col>
        <el-col :span="20">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1">单曲</el-menu-item>
            <el-menu-item index="2">专辑</el-menu-item>
            <el-menu-item index="3">歌单</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <div v-show="activeIndex=='1'">
        <div v-if="this.songs.length==0" class="content-box-content">
          <img class="none-img" src="../../assets/noneBox.png" alt />
          <p class="none-content">没有找到相关内容</p>
        </div>
        <div v-if="this.songs.length!=0">
          <div class="title">
            <el-row>
              <el-col class="col" :span="1"></el-col>
              <el-col class="col" :span="8">
                <span>歌曲</span>
              </el-col>
              <el-col class="col" :span="5">
                <span>歌手</span>
              </el-col>
              <el-col class="col" :span="6">
                <span>专辑</span>
              </el-col>
              <el-col class="col" :span="4"></el-col>
            </el-row>
          </div>
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
          <el-pagination
            @current-change="handleCurrentChange_song"
            :current-page="currentPage1"
            :page-size="30"
            layout="prev, pager, next"
            :total="page_song.recordsNum"
            fixed="right"
          ></el-pagination>
        </div>
      </div>
      <div v-show="activeIndex=='2'">
        <div v-if="this.albums.length==0" class="content-box-content">
          <img class="none-img" src="../../assets/noneBox.png" alt />
          <p class="none-content">没有找到相关内容</p>
        </div>
        <div v-if="this.albums.length!=0" class="list-content-part">
          <ul class="album-ul">
            <li
              v-for="item in albums"
              :key="item.id"
              style="padding-top:20px"
              @click="detail(item.id)"
            >
              <img class="cover" :src="item.cover" alt />
              <p style="font-size:15px;color:grey">{{item.name}}</p>
            </li>
          </ul>
          <el-pagination
            @current-change="handleCurrentChange_album"
            :current-page="currentPage2"
            :page-size="18"
            layout="prev, pager, next"
            :total="page_album.recordsNum"
            fixed="right"
          ></el-pagination>
        </div>
      </div>
      <div v-show="activeIndex=='3'">
        <div v-if="this.lists.length==0" class="content-box-content">
          <img class="none-img" src="../../assets/noneBox.png" alt />
          <p class="none-content">没有找到相关内容</p>
        </div>
        <div v-if="this.lists.length!=0" class="list-content-part">
          <ul class="list-ul">
            <li
              v-for="item in lists"
              :key="item.id"
              style="padding-top:20px"
              @click="detail(item.id)"
            >
              <img class="cover" :src="item.cover" alt />
              <p style="font-size:15px;color:grey">{{item.lname}}</p>
            </li>
          </ul>
          <el-pagination
            @current-change="handleCurrentChange_list"
            :current-page="currentPage3"
            :page-size="18"
            layout="prev, pager, next"
            :total="page_list.recordsNum"
            fixed="right"
          ></el-pagination>
        </div>
      </div>
    </div>
     <el-dialog title="加入我的歌单" :visible.sync="outerVisible">
    <el-button type="primary" @click="changeInnerVisible">新建歌单</el-button>
    <br>
    <br>
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
                    <el-col class="col" style="height:60px" :span="4"><el-popover placement="top-start" title trigger="hover">
                    <img :src="list.cover" alt style="width: 150px;height: 150px" />
                    <img slot="reference" :src="list.cover" style="width: 60px;height: 60px" />
                  </el-popover></el-col>
                    <el-col class="col" :span="9">
                      <span>{{list.lname}}</span>
                    </el-col>
                    <el-col class="col" :span="8">
                      <span>{{list.tagName}}</span>
                    </el-col>
                    <el-col class="col" :span="3">
                      <a @click="insertThisList(list.lid)" class="el-icon-folder-add" style="font-size:20px;padding-left:20px"></a>
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </div>
    <el-dialog
      width="30%"
      title="新建歌单"
      :visible.sync="innerVisible"
      append-to-body>
      

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
      activeIndex: "1",
      songs: [],
      albums: [],
      lists: [],
      page_song: {},
      page_album: {},
      page_list: {},
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      hoverIndex: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      clickIndex: -1, //表示当前点击的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li

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
    this.getMyFavoSong(1);
    this.getMyFavoAlbum(1);
    this.getMyFavoList(1);
    this.getMySongLists();
  },
  methods: {
    detail(val) {
      this.$router.push({
        name: "albumDetail",
        params: { aid: val }
      });
    },
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
          this.songs.splice(index,1);
        })
        .catch(err => {
          console.log(err);
          this.$message.error("提交失败！");
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
    handleCurrentChange_song(val) {
      this.getMyFavoSong(val);
    },
    handleCurrentChange_album(val) {
      this.getMyFavoAlbum(val);
    },
    handleCurrentChange_list(val) {
      this.getMyFavoList(val);
    },

    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    getMyFavoSong(pageNum) {
      this.$axios
        .post(
          "http://localhost:8080/user/getMyFavoSong",
          qs.stringify({
            tel: sessionStorage.getItem("tel"),
            pageNum: pageNum
          })
        )
        .then(res => {
          this.songs = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/user/getMFSPage?tel=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.page_song = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMyFavoAlbum(pageNum) {
      this.$axios
        .post(
          "http://localhost:8080/user/getMyFavoAlbum",
          qs.stringify({
            tel: sessionStorage.getItem("tel"),
            pageNum: pageNum
          })
        )
        .then(res => {
          this.albums = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/user/getMFAPage?tel=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.page_album = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMyFavoList(pageNum) {
      this.$axios
        .post(
          "http://localhost:8080/user/getMyFavoList",
          qs.stringify({
            tel: sessionStorage.getItem("tel"),
            pageNum: pageNum
          })
        )
        .then(res => {
          this.lists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/user/getMFLPage?tel=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.page_list = res.data;
        })
        .catch(err => {
          console.log(err);
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

.album-ul,.list-ul {
  display: flex;
  flex-wrap: wrap;
}
.cover {
  width: 240px;
  height: 240px;
  margin-right: 20px;
}
.img_list {
  display: inline-block;
}
.list-content-part {
  width: 1300px;
  margin: 0 auto;
}
.hoverBg {
  background: rgba(226, 226, 226, 0.1);
}
.clickBg {
  background: rgba(0, 0, 0, 0.3);
}
.el-pagination {
  text-align: center;
}
.col {
  min-height: 60px;
  border-bottom: 1px solid;
  border-color: rgb(233, 233, 233, 0.4);
}
.title {
  height: 60px;
  font-size: 15px;
  line-height: 59px;
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
  height: 61px;
  border-bottom: solid 1px #e6e6e6;
  padding-top: 10px;
}
.content-box-nav {
  background-color: white;
}
.content-box-content {
  height: 400px;
  position: relative;
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
