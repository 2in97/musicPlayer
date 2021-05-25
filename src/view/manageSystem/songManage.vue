<template>
  <div class="whole">
    <div class="bg-part">
      <img src="../../assets/bg4.jpg" alt class="bg" />
    </div>
    <div class="bg2"></div>
    <div style="height:100%">
      <div class="box">
        <div class="nav-part-left">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-nav"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            router
          >
            <el-menu-item @click="changeCollapsse">
              <i v-show="isCollapse" class="el-icon-arrow-right"></i>
              <span v-show="isCollapse" slot="title">展开</span>
              <i v-show="!isCollapse" class="el-icon-arrow-left"></i>
              <span v-show="!isCollapse" slot="title">收起</span>
            </el-menu-item>
            <el-menu-item v-for="item in routes" :index="item.path" :key="item.icon">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="form-part-right">
          <div class="title">
            <span class="title1">歌曲</span>
            <span class="title2">管理</span>
          </div>
          <el-main class="table-center">
            <el-row>
              <el-col :span="12">
                <div class="content-left">
                  <el-button class="add-bt" @click="addPage()">增加</el-button>
                  <el-button class="delete-bt" @click="toDeleteAll()">删除</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="content-right">
                  <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                    <el-select
                      class="search-select"
                      v-model="searchType"
                      slot="prepend"
                      placeholder="请选择"
                    >
                      <el-option label="歌曲名" value="1"></el-option>
                      <el-option label="歌手" value="2"></el-option>
                      <el-option label="专辑" value="3"></el-option>
                    </el-select>
                    <el-button
                      class="search-bt"
                      slot="append"
                      icon="el-icon-search"
                      @click="toSearch"
                    ></el-button>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <br />
            <br />
            <el-table
              class="song-table"
              :data="songs"
              stripe
              style="width: 100%"
              border
              :row-style="{height:'20px'}"
              :cell-style="{padding:'3px'}"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="name" label="歌曲"></el-table-column>
              <el-table-column prop="artist" label="歌手"></el-table-column>
              <el-table-column prop="albumName" label="专辑"></el-table-column>
              <el-table-column prop="type" label="类别"></el-table-column>
              <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                  <el-button @click="editPage(scope.row.id)" icon="el-icon-edit"></el-button>
                  <el-button @click="detailPage(scope.row.id)" icon="el-icon-view"></el-button>
                  <el-button @click="toDelete(scope.row.id)" icon="el-icon-delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage1"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="page.recordsNum"
              fixed="right"
            ></el-pagination>
          </el-footer>
        </div>
      </div>
      <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
        <el-table :data="songDetail">
          <el-table-column prop="id" label="编号" width="115"></el-table-column>
          <el-table-column prop="name" label="歌曲"></el-table-column>
          <el-table-column prop="artist" label="歌手"></el-table-column>
          <el-table-column prop="albumName" label="专辑"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
        </el-table>
        <el-table :data="songDetail">
          <el-table-column prop="detail" label="详细信息"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="修改" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="songUpdate" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="10">
              <el-upload
                class="avatar-uploader"
                ref="uploadAvatar"
                action="http://localhost:8080/file/upload2"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess_update"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="14">
              <el-form-item label="歌曲" prop="name">
                <el-input v-model="songUpdate.name" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="歌手" prop="artist">
                <el-input v-model="songUpdate.artist" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="专辑" prop="album">
                <el-input v-model="songUpdate.albumName" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="songUpdate.typeID" placeholder="请选择" style="width:80%">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <audio class="easy_audio" :src="songUpdate.address" ref="audio" controls="controls"></audio>
          <p>
            歌词
            <span v-if="songUpdate.lyric!=''">:{{songUpdate.name}}-{{songUpdate.artist}}.lrc</span>
            <span v-if="songUpdate.lyric==''">:无</span>
          </p>
          <el-upload
            class="upload-lyric"
            :limit="1"
            ref="uploadLyric"
            :on-success="handleLyricSuccess_update"
            action="http://localhost:8080/file/upload2"
          >
            <el-button slot="trigger" size="small" type="primary">更改</el-button>
          </el-upload>
          <el-form-item label="详细信息">
            <el-input
              type="textarea"
              v-model="songUpdate.detail"
              autocomplete="off"
              style="width:100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdate('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="新增" :visible.sync="dialogForm1Visible" width="35%">
        <el-form :model="song" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="10">
              <el-upload
                class="avatar-uploader"
                ref="uploadAvatar"
                action="http://localhost:8080/file/upload2"
                :show-file-list="false"
                :on-change="changeAvatar"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="14">
              <el-form-item label="歌曲" prop="name">
                <el-input v-model="song.name" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="歌手" prop="artist">
                <el-input v-model="song.artist" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="专辑" prop="album">
                <el-input v-model="song.albumName" autocomplete="off" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="song.typeID" placeholder="请选择" style="width:80%">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <p>歌曲</p>
          <el-upload
            class="upload-song"
            ref="uploadSong"
            drag
            action="http://localhost:8080/file/upload2"
            multiple
            :auto-upload="false"
            :on-success="handleFileSuccess"
            :on-change="analysisName"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将音频文件拖到此处，或
              <em>点击上传</em>
              通过解析获取歌曲信息
            </div>
          </el-upload>
          <p>歌词</p>
          <el-upload
            class="upload-lyric"
            :limit="1"
            ref="uploadLyric"
            action="http://localhost:8080/file/upload2"
            :auto-upload="false"
            :on-success="handleLyricSuccess"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
          <el-form-item label="详细信息">
            <el-input type="textarea" v-model="song.detail" autocomplete="off" style="width:100%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm1Visible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
let audio = "";
import qs from "qs";
export default {
  data() {
    return {
      routes: [
        { name: "歌曲管理", path: "/songManage", icon: "el-icon-menu" },
        { name: "歌手管理", path: "/artistManage", icon: "el-icon-user-solid" },
        { name: "专辑管理", path: "/albumManage", icon: "el-icon-folder" },
        {
          name: "首页推荐",
          path: "/index_recommend",
          icon: "el-icon-s-platform"
        }
      ],
      isCollapse: false, //导航栏收缩
      playing: false, // 播放状态
      imageUrl: "",
      search: "",
      searchType: "1",
      songs: [],
      picAddress: "",
      lyric: "",
      songAddress: "",
      checkModel: [],
      page: "",
      currentPage1: 1,
      currentPage2: 2,
      songDetail: [],
      songUpdate: {},
      song: {
        name: "",
        artist: "",
        albumName: "",
        detail: "",
        typeID: ""
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogForm1Visible: false,
      types: [
        { value: "2200", name: "流行" },
        { value: "2201", name: "摇滚" },
        { value: "2202", name: "民谣" },
        { value: "2203", name: "电子" },
        { value: "2204", name: "影视原声" },
        { value: "2205", name: "ACG" },
        { value: "2206", name: "乡村" },
        { value: "2207", name: "古风" },
        { value: "2208", name: "说唱" },
        { value: "2209", name: "古典" },
        { value: "2210", name: "金属" },
        { value: "2211", name: "其他" }
      ],
      ruleForm: {
        name: "",
        artist: "",
        album: "",
        type: "",
        detail: ""
      },
      rules: {
        name: [{ required: true, message: "请输入歌名", trigger: "blur" }],
        artist: [{ required: true, message: "请输入歌手", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.turnPage(1, this.searchType, this.serach);
  },
  beforeMount(){
        this.isCollapse=JSON.parse(localStorage.getItem("isCollapse"))
  },
  activated: function() {
    this.turnPage(1, this.searchType, this.serach);
  },
  methods: {
    analysisName(file, fileList) {
      let str = file.name;
      let strs = str.split(/-|.mp3|.flac/);
      this.song.name = strs[1];
      this.song.artist = strs[0];
    },
    changeAvatar(file, fileList) {
      if (this.imageUrl == "") this.imageUrl = URL.createObjectURL(file.raw);
    },
    changeCollapsse() {
      if (this.isCollapse) this.isCollapse = false;
      else this.isCollapse = true;
      localStorage.setItem("isCollapse",JSON.stringify(this.isCollapse))
    },
    play() {
      if (this.playing) {
        // 播放中,点击则为暂停
        this.playing = false;
        this.audio.pause();
      } else {
        // 暂停中,点击则为播放
        this.playing = true;
        this.audio.play();
      }
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
    handleSelectionChange(val) {
      this.checkModel = [];
      val.forEach(array => {
        this.checkModel.push(array.id);
      });
      console.log("handleSelectionChange--", this.checkModel);
    },
    handleCurrentChange(val) {
      this.turnPage(val, this.searchType, this.serach);
    },

    toSearch() {
      this.turnPage(1, this.searchType, this.serach);
    },
    toDeleteAll() {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get(
          "http://localhost:8080/song/deleteAllSongs?id=" + this.checkModel
        );
        window.location.reload();
      });
    },
    toDelete(id) {
      this.$confirm("此操作将永久删除该曲目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get("http://localhost:8080/song/deleteSong?id=" + id);
        window.location.reload();
      });
    },

    turnPage(pageNum) {
      this.$axios
        .get(
          "http://localhost:8080/song/getSongsPerPage?pageNum=" +
            pageNum +
            "&searchType=" +
            this.searchType +
            "&search=" +
            this.search
        )
        .then(res => {
          this.songs = res.data;
          console.log(this.songs);
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/song/getPage?searchType=" +
            this.searchType +
            "&search=" +
            this.search
        )
        .then(res => {
          this.page = res.data;
          console.log(this.page);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addPage() {
      this.song.name = "";
      this.song.artist = "";
      this.song.albumName = "";
      this.song.typeID = "";
      this.song.detail = "";
      this.imageUrl = "";
      this.dialogForm1Visible = true;
      this.songAddress = "";
      this.lyric = "";
      this.$refs.uploadAvatar.clearFiles();
      this.$refs.uploadSong.clearFiles();
      this.$refs.uploadLyric.clearFiles();
    },
    editPage(sid) {
      this.$nextTick(() => {
        this.audio = this.$refs.audio;
      });
      this.songDetail = [];
      for (var i in this.songs) {
        if (this.songs[i].id == sid) {
          this.songUpdate = this.songs[i];
          this.imageUrl = this.songs[i].pic;
          this.songUpdate.address = this.songs[i].address;
          console.log(this.songUpdate);
        }
      }
      this.dialogFormVisible = true;
    },
    uploadSong(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/song/uploadSong",
              qs.stringify({
                name: this.song.name,
                picAddress: this.imageUrl,
                artist: this.song.artist,
                album: this.song.albumName,
                songAddress: this.songAddress,
                type: this.song.typeID,
                lyric: this.lyric,
                detail: this.song.detail
              })
            )
            .then(res => {
              this.$message.success("提交成功！");
              this.$refs.uploadAvatar.clearFiles();
              this.$refs.uploadSong.clearFiles();
              this.$refs.uploadLyric.clearFiles();
              this.dialogForm1Visible = false;
              console.log(this.page.pageNum);
              this.turnPage(this.page.pageNum);
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },

    submitUpload() {
      new Promise((resolve, reject) => {
        this.$refs.uploadAvatar.submit();
        setTimeout(() => resolve(), 500);
      }).then(data => {
        return new Promise((resolve, reject) => {
          this.$refs.uploadLyric.submit();
          setTimeout(() => resolve(1), 500);
        }).then(data => {
          this.$refs.uploadSong.submit();
        });
      });
    },
    detailPage(sid) {
      this.songDetail = [];
      for (var i in this.songs) {
        if (this.songs[i].id == sid) {
          this.songDetail.push(this.songs[i]);
        }
      }
      this.dialogTableVisible = true;
    },
    submitUpdate(formName) {
      this.$refs[formName].validate(valid => {
        console.log("10" + this.imageUrl);
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/song/updateSong",
              qs.stringify({
                id: this.songUpdate.id,
                name: this.songUpdate.name,
                picAddress: this.imageUrl,
                artist: this.songUpdate.artist,
                album: this.songUpdate.albumName,
                lyric: this.songUpdate.lyric,
                type: this.songUpdate.typeID,
                detail: this.songUpdate.detail
              })
            )
            .then(res => {
              this.$message.success("提交成功！");
              this.dialogFormVisible = false;
              this.turnPage(this.page.pageNum);
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },
    handleFileSuccess(res, file) {
      console.log("3");
      this.songAddress = res.url[0];
      this.uploadSong("ruleForm");
    },
    handleAvatarSuccess(res, file) {
      console.log("1");
      this.imageUrl = res.url[0];
    },
    handleLyricSuccess(res, file) {
      console.log("2");
      this.lyric = res.url[0];
    },
    handleAvatarSuccess_update(res, file) {
      this.imageUrl = res.url[0];
    },
    handleLyricSuccess_update(res, file) {
      this.songUpdate.lyric = res.url[0];
    }
  }
};
</script>
<style scoped>
.box {
  overflow: hidden;
  height: 100%;
}
.nav-part-left {
  float: left;
  height: 100%;
  min-height: 100%;
}
.el-menu-vertical-nav:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  height: 100%;
}
.el-menu-vertical-nav {
  min-height: 100%;
  height: 100%;
}
.easy_audio {
  width: 100%;
}
.bg {
  z-index: -2;
  width: 100%;
  height: 100%;
  position: fixed;
}
.bg2 {
  z-index: -1;
  background: rgba(20, 27, 47, 0.6);
  width: 100%;
  height: 100%;
  position: fixed;
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
.el-container {
  width: 100%;
  margin: auto;
  position: relative;
}
.add-bt {
  background-color: rgba(7, 176, 255, 0.4);
  border-color: rgba(7, 176, 255, 0.4);
  color: white;
  margin-left: 30px;
  border: 1px solid rgb(168, 168, 168);
  width: 120px;
}
.delete-bt {
  background-color: rgba(255, 0, 0, 0.4);
  border-color: rgba(255, 0, 0, 0.4);
  color: white;
  margin-left: 30px;
  border: 1px solid rgb(168, 168, 168);
  width: 120px;
}
.search-bt {
  width: 50px;
}
.search-select {
  width: 100px;
}
.input-with-select {
  width: 500px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.upload-song >>> .el-upload__input {
  display: none !important;
}
.upload-song >>> .el-upload-dragger {
  width: 100%;
  height: 130px;
}
.upload-song >>> .el-upload--text {
  width: 100%;
}
.el-button:focus,
.el-button:hover {
  color: white;
  border-color: white;
  background-color: rgba(0, 0, 0, 0.2);
}
.title {
  text-align: center;
  padding-top: 20px;
}
.title1 {
  font: 20px bold;
  color: white;
  text-align: center;
}
.title2 {
  font: 20px bold;
  color: #ff9102;
  text-align: center;
}
.song-table {
  background-color: rgba(0, 0, 0, 0.2);
}

.el-pagination {
  float: right;
}
.el-pagination >>> .el-pagination__total {
  color: white;
}
.el-pagination >>> .el-pagination__jump {
  color: white;
}
.content-left {
  float: left;
}
.content-right {
  float: right;
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
